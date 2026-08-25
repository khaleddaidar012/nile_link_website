import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/email/send"
import { generateContactEmail } from "@/lib/email/templates/contact-email"
import { CONTACT } from "@/constants/contact"

const requestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .transform((v) => v.trim()),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email address is too long")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .max(30, "Phone number is too long")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .max(200, "Subject is too long")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long")
    .transform((v) => v.trim()),
})

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "")
}

type RequestBody = z.infer<typeof requestSchema>

function sanitize(data: RequestBody): RequestBody {
  return {
    name: stripHtml(data.name),
    email: data.email,
    phone: data.phone ? stripHtml(data.phone) : undefined,
    subject: data.subject ? stripHtml(data.subject) : undefined,
    message: stripHtml(data.message),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()

    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0] || "Validation failed"

      return NextResponse.json(
        { success: false, message: firstError, errors },
        { status: 400 }
      )
    }

    const sanitized = sanitize(parsed.data)

    const now = new Date()
    const submittedAt = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })

    const html = generateContactEmail({
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone,
      subject: sanitized.subject,
      message: sanitized.message,
      submittedAt,
      siteName: "NileLink",
    })

    await sendEmail({
      to: process.env.EMAIL_TO || CONTACT.EMAIL,
      subject: `New Contact Message from ${sanitized.name}`,
      html,
    })

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Contact API] Error processing contact message:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid request format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
