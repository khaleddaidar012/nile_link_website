import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User, Customer, Document as DocumentModel, Notification, CustomerRequest, Invoice } from "@/lib/models"
import { hashPassword } from "@/lib/auth/password"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    // 1. Clean existing test data (optional or upsert)
    const existingStaff = await User.findOne({ email: "staff@nilelink.com" })
    if (existingStaff) {
      return NextResponse.json({
        success: true,
        message: "Database already has seed accounts. You can log in directly!",
        accounts: [
          { role: "Staff / Inspector", email: "staff@nilelink.com", password: "StaffAdmin2026!", access: "/admin" },
          { role: "Client (Active)", email: "mohamed@alexexport.com", password: "SecurePass123!", access: "/portal" },
          { role: "Client (Expiring Soon)", email: "operations@redseacargo.com", password: "SecurePass123!", access: "/portal" },
          { role: "Client (Expired)", email: "manager@cairofreight.com", password: "SecurePass123!", access: "/portal" },
        ],
      })
    }

    const staffPasswordHash = await hashPassword("StaffAdmin2026!")
    const clientPasswordHash = await hashPassword("SecurePass123!")

    // Create Staff User
    const staffUser = await User.create({
      email: "staff@nilelink.com",
      passwordHash: staffPasswordHash,
      role: "staff",
      firstName: "Karim",
      lastName: "Nasser",
      phone: "+201000000001",
      emailVerified: true,
    })

    // Company 1: Active & Compliant
    const cust1 = await Customer.create({
      companyName: "Alexandria Exporting Co.",
      commercialRegisterNumber: "CR-98421-EG",
      taxCardNumber: "TAX-55219-ALX",
      contactEmail: "mohamed@alexexport.com",
      contactPhone: "+201001234567",
      accountStatus: "active",
      statusReason: "All company documents are verified and up to date.",
      city: "Alexandria",
      country: "Egypt",
      maxAllowedDocuments: 20,
    })

    const user1 = await User.create({
      email: "mohamed@alexexport.com",
      passwordHash: clientPasswordHash,
      role: "customer_admin",
      customerId: cust1._id,
      firstName: "Mohamed",
      lastName: "Ahmed",
      phone: "+201001234567",
      emailVerified: true,
    })

    // Company 1 Documents
    const now = new Date()
    const in1Year = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    const in6Months = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)

    await DocumentModel.create([
      {
        customerId: cust1._id,
        uploadedBy: user1._id,
        title: "Commercial Register 2026",
        category: "commercial_register",
        fileName: "Commercial_Register_Alex.pdf",
        storedFileName: "cr_alex_2026.pdf",
        fileUrl: "/uploads/documents/sample_cr.pdf",
        fileSize: 1024 * 1024 * 2,
        mimeType: "application/pdf",
        status: "approved",
        startDate: now,
        expiryDate: in1Year,
        reviewedBy: staffUser._id,
        reviewedAt: now,
      },
      {
        customerId: cust1._id,
        uploadedBy: user1._id,
        title: "Corporate Tax Card",
        category: "tax_card",
        fileName: "Tax_Card_Alex.png",
        storedFileName: "tax_alex_2026.png",
        fileUrl: "/uploads/documents/sample_tax.png",
        fileSize: 1024 * 512,
        mimeType: "image/png",
        status: "approved",
        startDate: now,
        expiryDate: in6Months,
        reviewedBy: staffUser._id,
        reviewedAt: now,
      },
    ])

    // Company 2: Expiring Soon (3 days left) - Warning
    const cust2 = await Customer.create({
      companyName: "Red Sea Shipping Logistics",
      commercialRegisterNumber: "CR-77312-EG",
      taxCardNumber: "TAX-11882-SUEZ",
      contactEmail: "operations@redseacargo.com",
      contactPhone: "+201112233445",
      accountStatus: "warning",
      statusReason: "Import License will expire in 3 days.",
      city: "Suez",
      country: "Egypt",
      maxAllowedDocuments: 20,
    })

    const user2 = await User.create({
      email: "operations@redseacargo.com",
      passwordHash: clientPasswordHash,
      role: "customer_admin",
      customerId: cust2._id,
      firstName: "Hassan",
      lastName: "Mahmoud",
      phone: "+201112233445",
      emailVerified: true,
    })

    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    await DocumentModel.create({
      customerId: cust2._id,
      uploadedBy: user2._id,
      title: "Maritime Import License",
      category: "license",
      fileName: "Import_License_RedSea.pdf",
      storedFileName: "lic_redsea.pdf",
      fileUrl: "/uploads/documents/sample_license.pdf",
      fileSize: 1024 * 1024 * 1.5,
      mimeType: "application/pdf",
      status: "expiring_soon",
      warningEscalationTier: "urgent",
      startDate: new Date(now.getTime() - 360 * 24 * 60 * 60 * 1000),
      expiryDate: in3Days,
      reviewedBy: staffUser._id,
      reviewedAt: now,
    })

    // Company 3: Expired Document - Inactive
    const cust3 = await Customer.create({
      companyName: "Cairo International Freight",
      commercialRegisterNumber: "CR-33419-EG",
      taxCardNumber: "TAX-66551-CAI",
      contactEmail: "manager@cairofreight.com",
      contactPhone: "+201229988776",
      accountStatus: "inactive",
      statusReason: "Mandatory document (Customs Clearance Certificate) has expired.",
      city: "Cairo",
      country: "Egypt",
      maxAllowedDocuments: 20,
    })

    const user3 = await User.create({
      email: "manager@cairofreight.com",
      passwordHash: clientPasswordHash,
      role: "customer_admin",
      customerId: cust3._id,
      firstName: "Tarek",
      lastName: "Kamel",
      phone: "+201229988776",
      emailVerified: true,
    })

    const expiredDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)

    await DocumentModel.create({
      customerId: cust3._id,
      uploadedBy: user3._id,
      title: "Customs Clearance Certificate",
      category: "customs_certificate",
      fileName: "Customs_Cert_Cairo.pdf",
      storedFileName: "customs_cairo.pdf",
      fileUrl: "/uploads/documents/sample_customs.pdf",
      fileSize: 1024 * 800,
      mimeType: "application/pdf",
      status: "expired",
      warningEscalationTier: "expired",
      startDate: new Date(now.getTime() - 370 * 24 * 60 * 60 * 1000),
      expiryDate: expiredDate,
      reviewedBy: staffUser._id,
      reviewedAt: now,
    })

    // Company 4: Pending Review
    const cust4 = await Customer.create({
      companyName: "Delta Nile Logistics",
      commercialRegisterNumber: "CR-55210-EG",
      taxCardNumber: "TAX-44119-DLT",
      contactEmail: "sara@deltalogistics.com",
      contactPhone: "+201009876543",
      accountStatus: "warning",
      statusReason: "New documents pending staff review.",
      city: "Tanta",
      country: "Egypt",
      maxAllowedDocuments: 20,
    })

    const user4 = await User.create({
      email: "sara@deltalogistics.com",
      passwordHash: clientPasswordHash,
      role: "customer_admin",
      customerId: cust4._id,
      firstName: "Sara",
      lastName: "Youssef",
      phone: "+201009876543",
      emailVerified: true,
    })

    await DocumentModel.create({
      customerId: cust4._id,
      uploadedBy: user4._id,
      title: "Commercial Register & Tax Card Batch",
      category: "commercial_register",
      fileName: "Delta_CR_2026.pdf",
      storedFileName: "delta_cr.pdf",
      fileUrl: "/uploads/documents/sample_delta.pdf",
      fileSize: 1024 * 1024 * 3,
      mimeType: "application/pdf",
      status: "pending_review",
      warningEscalationTier: "none",
    })

    // Invoices for testing
    await Invoice.create([
      {
        customerId: cust1._id,
        invoiceNumber: "INV-2026-001",
        amount: 45000,
        currency: "EGP",
        status: "paid",
        issueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        paidAt: now,
      },
      {
        customerId: cust1._id,
        invoiceNumber: "INV-2026-002",
        amount: 18500,
        currency: "EGP",
        status: "pending",
        issueDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    ])

    // Sample Requests for testing
    await CustomerRequest.create({
      customerId: cust1._id,
      requestedBy: user1._id,
      trackingNumber: "NL-REQ-2026-8841",
      serviceType: "freight_booking",
      subject: "4x40ft FCL Alexandria to Hamburg",
      description: "Refrigerated citrus cargo, booking confirmation required.",
      priority: "high",
      status: "in_progress",
      timeline: [
        { status: "submitted", title: "Order Submitted", comment: "Received from client.", createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
        { status: "in_progress", title: "Customs Manifest Processed", comment: "Clearance in progress at Alexandria Port.", createdAt: now },
      ],
    })

    return NextResponse.json({
      success: true,
      message: "Database successfully seeded with realistic test accounts, documents, invoices & requests!",
      accounts: [
        { role: "Staff / Inspector", email: "staff@nilelink.com", password: "StaffAdmin2026!", access: "/admin" },
        { role: "Client (Active & Compliant)", email: "mohamed@alexexport.com", password: "SecurePass123!", access: "/portal" },
        { role: "Client (Expiring Soon - 3d)", email: "operations@redseacargo.com", password: "SecurePass123!", access: "/portal" },
        { role: "Client (Expired Document - Inactive)", email: "manager@cairofreight.com", password: "SecurePass123!", access: "/portal" },
        { role: "Client (Pending Review Queue)", email: "sara@deltalogistics.com", password: "SecurePass123!", access: "/portal" },
      ],
    })
  } catch (error: unknown) {
    console.error("Seed database error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
