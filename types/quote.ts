import { z } from "zod"

export const quoteFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  freightType: z.enum(["air", "road", "ocean"]),
  weight: z.string().optional(),
  quantity: z.string().optional(),
  from: z.string().min(1, "Origin is required"),
  to: z.string().min(1, "Destination is required"),
  notes: z.string().optional(),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>
