import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ""
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ""
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ""
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "nilelink-documents"

const R2_ENDPOINT =
  process.env.R2_ENDPOINT ||
  (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : "")

// Fallback directory for local disk if R2 credentials are not provided during offline dev
const LOCAL_STORAGE_DIR = path.join(process.cwd(), "storage", "r2_local_fallback")

let s3Client: S3Client | null = null

export function isR2Configured(): boolean {
  return !!(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ENDPOINT)
}

export function getR2Client(): S3Client | null {
  if (!isR2Configured()) {
    return null
  }
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return s3Client
}

export function sanitizeFileName(fileName: string): string {
  // Replace non-alphanumeric characters while preserving extensions
  return fileName
    .replace(/[/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 100)
}

export function generateStorageKey(
  customerId: string,
  folder: "documents" | "invoices" | "profile" | "contracts" = "documents",
  originalFileName: string
): string {
  const sanitized = sanitizeFileName(originalFileName)
  const uniqueId = crypto.randomBytes(8).toString("hex")
  return `clients/${customerId}/${folder}/${uniqueId}_${sanitized}`
}

export async function uploadFileToR2(
  fileBuffer: Buffer,
  storageKey: string,
  mimeType: string,
  metadata?: Record<string, string>
): Promise<{ storageKey: string; fileHash: string; fileSize: number; eTag?: string }> {
  const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex")
  const fileSize = fileBuffer.length
  const client = getR2Client()

  if (client) {
    // 1. Production / Configured Cloudflare R2 Upload
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: mimeType,
      Metadata: metadata,
    })

    const response = await client.send(command)
    return {
      storageKey,
      fileHash,
      fileSize,
      eTag: response.ETag,
    }
  } else {
    // 2. Development Local Fallback (emulates R2 object keys in local filesystem)
    const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey)
    await fs.mkdir(path.dirname(localFilePath), { recursive: true })
    await fs.writeFile(localFilePath, fileBuffer)

    console.log(`[R2 Storage: Local Fallback] Stored object at: ${storageKey}`)
    return {
      storageKey,
      fileHash,
      fileSize,
      eTag: fileHash,
    }
  }
}

export async function deleteFileFromR2(storageKey: string): Promise<boolean> {
  const client = getR2Client()

  if (client) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
      })
      await client.send(command)
      return true
    } catch (err) {
      console.error("Failed to delete object from Cloudflare R2:", err)
      return false
    }
  } else {
    try {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey)
      await fs.unlink(localFilePath)
      return true
    } catch {
      return false
    }
  }
}

export async function getFileStreamFromR2(
  storageKey: string
): Promise<{
  body: Uint8Array | ReadableStream | NodeJS.ReadableStream | Buffer
  contentType: string
  contentLength: number
}> {
  const client = getR2Client()

  if (client) {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: storageKey,
    })

    const response = await client.send(command)
    const body = (await response.Body?.transformToByteArray()) || new Uint8Array()
    return {
      body,
      contentType: response.ContentType || "application/octet-stream",
      contentLength: response.ContentLength || body.length,
    }
  } else {
    const localFilePath = path.join(LOCAL_STORAGE_DIR, storageKey)
    const fileBuffer = await fs.readFile(localFilePath)
    return {
      body: fileBuffer,
      contentType: "application/octet-stream",
      contentLength: fileBuffer.length,
    }
  }
}

export async function generatePresignedDownloadUrl(
  storageKey: string,
  originalFileName?: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const client = getR2Client()
  if (!client) {
    // Return backend gateway download route in local dev
    return `/api/portal/documents/download?key=${encodeURIComponent(storageKey)}`
  }

  const disposition = originalFileName
    ? `inline; filename="${encodeURIComponent(originalFileName)}"`
    : "inline"

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: storageKey,
    ResponseContentDisposition: disposition,
  })

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}
