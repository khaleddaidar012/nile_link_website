"use client"

import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { InvoiceStatusBadge } from "./InvoiceStatusBadge"
import { MapPin, Phone, Mail, Building2, Link as LinkIcon, Download, Printer, Clock } from "lucide-react"

interface InvoiceLivePreviewProps {
  invoice: any
  payments: any[]
}

export function InvoiceLivePreview({ invoice, payments }: InvoiceLivePreviewProps) {
  const t = useTranslations()

  if (!invoice) return null

  const percentage = invoice.totalAmount > 0 
    ? Math.round(((invoice.paidAmount || 0) / invoice.totalAmount) * 100) 
    : 0

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Top Actions & Summary (Not part of the printed invoice, but useful for web view) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-2xl border border-secondary-200 shadow-sm dark:bg-secondary-900 dark:border-secondary-800">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <InvoiceStatusBadge status={invoice.status} />
          <div className="text-sm font-bold text-secondary-900 dark:text-white">
            {percentage}% {t("portal.financials.metrics.paid") || "Paid"}
          </div>
          <div className="hidden sm:block w-32 h-2 rounded-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${percentage === 100 ? "bg-emerald-500" : percentage > 0 ? "bg-blue-500" : "bg-transparent"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:ring-secondary-700 dark:hover:bg-secondary-700">
            <LinkIcon className="h-4 w-4 sm:mr-1.5 text-secondary-500" />
            <span className="hidden sm:inline">{t("portal.financials.actions.copyLink") || "Copy Link"}</span>
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:ring-secondary-700 dark:hover:bg-secondary-700">
            <Printer className="h-4 w-4 sm:mr-1.5 text-secondary-500" />
            <span className="hidden sm:inline">{t("portal.financials.actions.print") || "Print"}</span>
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-500">
            <Download className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">{t("portal.financials.actions.downloadPdf") || "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* The Actual Invoice Document */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Ribbon */}
        <div className="h-3 w-full bg-primary-600"></div>
        
        <div className="p-8 sm:p-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between gap-8 border-b border-secondary-200 pb-8">
            <div>
              <h1 className="text-3xl font-black text-secondary-900 uppercase tracking-tight mb-2">INVOICE</h1>
              <p className="font-mono text-secondary-500">{invoice.invoiceNumber}</p>
              
              <div className="mt-8 space-y-1">
                <p className="text-sm font-bold text-secondary-900">Billed To:</p>
                <p className="text-sm text-secondary-700 font-semibold">{invoice.customerId?.companyName || "N/A"}</p>
                {invoice.customerId?.address && <p className="text-sm text-secondary-500 max-w-[200px]">{invoice.customerId.address}</p>}
                {invoice.customerId?.email && <p className="text-sm text-secondary-500 mt-2 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {invoice.customerId.email}</p>}
              </div>
            </div>
            
            <div className="text-left sm:text-right">
              {/* Company Logo placeholder */}
              <div className="flex items-center sm:justify-end gap-2 mb-6 text-primary-600">
                <Building2 className="h-8 w-8" />
                <span className="text-xl font-black tracking-tighter uppercase">NileLink</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-secondary-500">NileLink Logistics S.A.E</p>
                <p className="text-sm text-secondary-500">123 Maritime Blvd, Alexandria, Egypt</p>
                <p className="text-sm text-secondary-500">VAT: 994-123-456</p>
                <p className="text-sm text-secondary-500 flex items-center sm:justify-end gap-1.5 mt-2"><Phone className="w-3.5 h-3.5"/> +20 100 123 4567</p>
              </div>
            </div>
          </div>

          {/* Key Dates Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-secondary-200">
            <div>
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Issue Date</p>
              <p className="text-sm font-bold text-secondary-900">{invoice.issueDate ? format(new Date(invoice.issueDate), "MMM dd, yyyy") : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Due Date</p>
              <p className="text-sm font-bold text-secondary-900">{invoice.dueDate ? format(new Date(invoice.dueDate), "MMM dd, yyyy") : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Related Request</p>
              <p className="text-sm font-bold text-secondary-900 font-mono">{invoice.relatedRequestId ? "REQ-..." : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm font-bold uppercase" style={{ color: percentage === 100 ? "#10b981" : "#3b82f6" }}>
                {invoice.status.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-8">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary-50 text-secondary-500">
                <tr>
                  <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider rounded-l-lg">Description</th>
                  <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-center">Qty</th>
                  <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-right">Unit Price</th>
                  <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-right rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-4 px-4 font-medium text-secondary-900">{item.description}</td>
                      <td className="py-4 px-4 text-center text-secondary-600">{item.quantity}</td>
                      <td className="py-4 px-4 text-right text-secondary-600">${item.unitPrice?.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-bold text-secondary-900">${item.total?.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-secondary-400 italic">No line items provided.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-t border-secondary-200 pt-8">
            <div className="w-full sm:w-1/2">
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Payment Instructions</p>
              <div className="bg-secondary-50 p-4 rounded-xl text-xs text-secondary-600 space-y-2">
                <p><strong>Bank:</strong> National Bank of Egypt</p>
                <p><strong>Account Name:</strong> NileLink Logistics</p>
                <p><strong>IBAN:</strong> EG12000300040005000600070008</p>
                <p><strong>SWIFT:</strong> NBEGEGCX</p>
                <p className="mt-2 text-secondary-400 italic">Please include the invoice number ({invoice.invoiceNumber}) in the transfer reference.</p>
              </div>
            </div>
            
            <div className="w-full sm:w-1/2 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-semibold text-secondary-900">${(invoice.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Tax</span>
                <span className="font-semibold text-secondary-900">${(invoice.tax || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Discount</span>
                <span className="font-semibold text-rose-600">-${(invoice.discount || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-end pt-4 border-t border-secondary-200 border-dashed">
                <span className="text-sm font-bold text-secondary-900 uppercase">Grand Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary-600">${(invoice.totalAmount || 0).toLocaleString()}</span>
                  <span className="ml-1 text-sm font-bold text-secondary-500">{invoice.currency || "USD"}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 px-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-600">Paid Amount</span>
                <span className="text-sm font-bold text-emerald-600">${(invoice.paidAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">Remaining Balance</span>
                <span className="text-base font-black text-blue-700">${(invoice.remainingAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment History Timeline (Web only) */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 sm:p-8 dark:bg-secondary-900 dark:border-secondary-800 print:hidden">
        <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-secondary-400" />
          {t("portal.financials.paymentHistory") || "Payment History"}
        </h3>
        
        {payments && payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((payment, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 before:absolute before:left-2 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-secondary-200 last:before:hidden dark:before:bg-secondary-700">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-secondary-200 dark:border-secondary-900 dark:ring-secondary-700" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p className="font-bold text-secondary-900 dark:text-white">
                      ${payment.amount.toLocaleString()} <span className="text-sm font-medium text-secondary-500 ml-1">{payment.currency || "USD"}</span>
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                      {payment.paymentMethod.replace("_", " ")} {payment.referenceNumber ? `(Ref: ${payment.referenceNumber})` : ""}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-secondary-500">
                    {format(new Date(payment.paymentDate), "MMM dd, yyyy - HH:mm")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary-500 italic text-center py-4">{t("portal.financials.noPayments") || "No payments have been recorded for this invoice yet."}</p>
        )}
      </div>

    </div>
  )
}
