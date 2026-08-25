interface QuoteEmailData {
  firstName: string
  lastName: string
  company?: string
  email: string
  phone: string
  freightType: string
  weight?: string
  quantity?: string
  from: string
  to: string
  notes?: string
  submittedAt: string
  siteName: string
}

function sanitize(val: string | undefined | null): string {
  if (!val) return ""
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

function field(label: string, value: string | undefined | null): string {
  if (!value) return ""
  return `
    <tr>
      <td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 500; width: 140px; vertical-align: top;">${sanitize(label)}</td>
      <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 600; vertical-align: top;">${sanitize(value)}</td>
    </tr>
  `
}

function section(title: string, rows: string): string {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 12px; border-bottom: 2px solid #2563eb;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">${sanitize(title)}</h3>
        </td>
      </tr>
      ${rows}
    </table>
  `
}

export function generateQuoteEmail(data: QuoteEmailData): string {
  const customerName = `${sanitize(data.firstName)} ${sanitize(data.lastName)}`

  const customerSection = section("Customer Information", `
    ${field("Name", customerName)}
    ${field("Company", data.company)}
    ${field("Email", data.email)}
    ${field("Phone", data.phone)}
  `)

  const shipmentSection = section("Shipment Details", `
    ${field("Freight Type", data.freightType)}
    ${field("Weight (kg)", data.weight)}
    ${field("Quantity", data.quantity)}
    ${field("Origin", data.from)}
    ${field("Destination", data.to)}
  `)

  const notesSection = data.notes
    ? section("Additional Notes", `
      <tr>
        <td colspan="2" style="padding: 8px 0;">
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #2563eb;">${sanitize(data.notes)}</p>
        </td>
      </tr>
    `)
    : ""

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request - NileLink</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
    <tr>
      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align: center; border-radius: 0;">
        <div style="margin-bottom: 8px;">
          <span style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">NileLink</span>
        </div>
        <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Global Logistics Solutions</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 40px 8px;">
        <h2 style="margin: 0 0 4px; font-size: 22px; font-weight: 700; color: #1e293b;">New Quote Request</h2>
        <p style="margin: 0 0 20px; color: #64748b; font-size: 13px;">A customer has submitted a new quote request through the website.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 6px;">
          <tr>
            <td style="padding: 10px 16px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Submitted</td>
            <td style="padding: 10px 16px; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${sanitize(data.submittedAt)}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px;">
        ${customerSection}
        ${shipmentSection}
        ${notesSection}
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 4px; color: #94a3b8; font-size: 11px; text-align: center;">
          ${sanitize(data.siteName)} &mdash; Global Logistics Solutions
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 11px; text-align: center;">
          This email was generated automatically. Please do not reply.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}
