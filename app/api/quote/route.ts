import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/email/send"
import { generateQuoteEmail } from "@/lib/email/templates/quote-email"
import { CONTACT } from "@/constants/contact"

const requestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long")
    .transform((v) => v.trim()),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long")
    .transform((v) => v.trim()),
  company: z
    .string()
    .max(200, "Company name is too long")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email address is too long")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(30, "Phone number is too long")
    .transform((v) => v.trim()),
  freightType: z.enum(["air", "road", "ocean"] as const),
  weight: z
    .string()
    .max(50)
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  quantity: z
    .string()
    .max(50)
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  from: z
    .string()
    .min(1, "Origin is required")
    .max(200, "Origin is too long")
    .transform((v) => v.trim()),
  to: z
    .string()
    .min(1, "Destination is required")
    .max(200, "Destination is too long")
    .transform((v) => v.trim()),
  notes: z
    .string()
    .max(5000, "Notes are too long")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
})

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "")
}

type RequestBody = z.infer<typeof requestSchema>

function sanitize(data: RequestBody): RequestBody {
  return {
    firstName: stripHtml(data.firstName),
    lastName: stripHtml(data.lastName),
    company: data.company ? stripHtml(data.company) : undefined,
    email: data.email,
    phone: stripHtml(data.phone),
    freightType: data.freightType,
    weight: data.weight ? stripHtml(data.weight) : undefined,
    quantity: data.quantity ? stripHtml(data.quantity) : undefined,
    from: stripHtml(data.from),
    to: stripHtml(data.to),
    notes: data.notes ? stripHtml(data.notes) : undefined,
  }
}

const freightLabels: Record<string, string> = {
  air: "Air Freight",
  road: "Road Freight",
  ocean: "Ocean Freight",
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

    const html = generateQuoteEmail({
      firstName: sanitized.firstName,
      lastName: sanitized.lastName,
      company: sanitized.company,
      email: sanitized.email,
      phone: sanitized.phone,
      freightType: freightLabels[sanitized.freightType] || sanitized.freightType,
      weight: sanitized.weight,
      quantity: sanitized.quantity,
      from: sanitized.from,
      to: sanitized.to,
      notes: sanitized.notes,
      submittedAt,
      siteName: "NileLink",
    })

    await sendEmail({
      to: process.env.EMAIL_TO || CONTACT.EMAIL,
      subject: `New Quote Request from ${sanitized.firstName} ${sanitized.lastName}`,
      html,
    })

    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Quote API] Error processing quote request:", error)

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
