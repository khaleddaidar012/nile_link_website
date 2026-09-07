import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Invoice, Payment, Customer } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
  const { token } = await params;
    await connectDB()

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    const invoice = await Invoice.findOne({ token }).populate("customerId", "companyName email phone address").lean()

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Fetch payment history for this invoice
    const payments = await Payment.find({ invoiceId: invoice._id })
      .sort({ paymentDate: -1 })
      .lean()

    return NextResponse.json({ success: true, invoice, payments })
  } catch (error) {
    console.error("Fetch public invoice error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
