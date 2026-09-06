import { NextRequest, NextResponse } from "next/server"
import { PricingRule } from "@/lib/models/PricingRule"
import { connectDB } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const updatedRule = await PricingRule.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!updatedRule) {
      return NextResponse.json({ success: false, error: "Pricing rule not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updatedRule })
  } catch (error) {
    console.error("Error updating pricing rule:", error)
    return NextResponse.json({ success: false, error: "Failed to update pricing rule" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const deletedRule = await PricingRule.findByIdAndDelete(params.id)
    if (!deletedRule) {
      return NextResponse.json({ success: false, error: "Pricing rule not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: deletedRule })
  } catch (error) {
    console.error("Error deleting pricing rule:", error)
    return NextResponse.json({ success: false, error: "Failed to delete pricing rule" }, { status: 500 })
  }
}
