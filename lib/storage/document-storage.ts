import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "documents")

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err) {
    // Ignore already exists
  }
}

export function sanitizeFilename(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function saveDocumentFile(
  fileBuffer: Buffer,
  originalFileName: string,
  customerId: string
): Promise<{ fileUrl: string; storedFileName: string; fileHash: string; fileSize: number }> {
  const customerDir = path.join(UPLOAD_ROOT, customerId)
  await ensureDirectoryExists(customerDir)

  const sanitized = sanitizeFilename(originalFileName)
  const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex")
  const uniquePrefix = crypto.randomBytes(8).toString("hex")
  const storedFileName = `${uniquePrefix}_${sanitized}`
  const filePath = path.join(customerDir, storedFileName)

  await fs.writeFile(filePath, fileBuffer)

  const fileUrl = `/uploads/documents/${customerId}/${storedFileName}`
  return {
    fileUrl,
    storedFileName,
    fileHash,
    fileSize: fileBuffer.length,
  }
}

export async function deleteDocumentFile(
  storedFileName: string,
  customerId: string
): Promise<boolean> {
  try {
    const filePath = path.join(UPLOAD_ROOT, customerId, sanitizeFilename(storedFileName))
    await fs.unlink(filePath)
    return true
  } catch {
    return false
  }
}

export async function getDocumentFilePath(
  storedFileName: string,
  customerId: string
): Promise<string> {
  return path.join(UPLOAD_ROOT, customerId, sanitizeFilename(storedFileName))
}
