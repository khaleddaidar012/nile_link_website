"use client"

import { useTranslations } from "next-intl"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, FileText, Download, Printer, CheckCircle, XCircle, Clock, Check, Plane, Ship, Truck, MapPin } from "lucide-react"
import { format } from "date-fns"
import { QuoteStatusBadge } from "./QuoteStatusBadge"
import { cn } from "@/lib/utils"

interface QuoteDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quote: any
  onQuoteUpdated: () => void
}

export function QuoteDetailsModal({ isOpen, onClose, quote, onQuoteUpdated }: QuoteDetailsModalProps) {
  const t = useTranslations()

  if (!quote) return null

  // Placeholder action handlers
  const handleAccept = async () => {
    // API call to accept quote
    // await fetch(`/api/portal/quotes/${quote._id}/accept`, { method: "POST" })
    onQuoteUpdated()
    onClose()
  }

  const handleReject = async () => {
    // API call to reject quote
    onQuoteUpdated()
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary-900/40 backdrop-blur-sm transition-opacity dark:bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 rtl:left-0 rtl:right-auto rtl:pr-10 sm:pl-16 rtl:sm:pr-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400 sm:duration-500"
                enterFrom="translate-x-full rtl:-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-400 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full rtl:-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-3xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-slate-50 shadow-2xl dark:bg-secondary-950">
                    
                    {/* Header */}
                    <div className="bg-white px-4 py-6 shadow-sm sm:px-6 border-b border-secondary-200/80 dark:bg-secondary-900 dark:border-secondary-800">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-bold leading-6 text-secondary-900 dark:text-white flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div>{t("portal.quotes.details.title") || "Quote Details"}</div>
                            <div className="text-sm font-mono text-secondary-500 mt-1">{quote.quoteNumber}</div>
                          </div>
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center rtl:mr-3 rtl:ml-0">
                          <button
                            type="button"
                            className="rounded-full bg-white text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-secondary-900 dark:text-secondary-500 dark:hover:text-secondary-300"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <QuoteStatusBadge status={quote.status} />
                        <span className="text-xs text-secondary-500">
                          {t("portal.quotes.details.created") || "Created"}: {quote.createdAt ? format(new Date(quote.createdAt), "MMM d, yyyy") : "-"}
                        </span>
                        <span className="text-xs text-secondary-500 border-l border-secondary-300 pl-3 rtl:border-r rtl:border-l-0 rtl:pl-0 rtl:pr-3">
                          {t("portal.quotes.details.validUntil") || "Valid Until"}: <span className="font-bold text-secondary-700 dark:text-secondary-300">{quote.validUntil ? format(new Date(quote.validUntil), "MMM d, yyyy") : "-"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 px-4 py-6 sm:px-6 space-y-8">
                      
                      {/* Shipment Info Summary */}
                      <section className="rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                        <h3 className="text-sm font-bold text-secondary-900 dark:text-white mb-4 uppercase tracking-wider">{t("portal.quotes.details.shipmentInfo") || "Shipment Overview"}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-secondary-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-secondary-500">{t("portal.quotes.details.origin") || "Origin"}</p>
                              <p className="font-semibold text-secondary-900 dark:text-white">Shanghai, China (CNSHA)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-secondary-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-secondary-500">{t("portal.quotes.details.destination") || "Destination"}</p>
                              <p className="font-semibold text-secondary-900 dark:text-white">Alexandria, Egypt (EGALY)</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Pricing Breakdown */}
                      <section className="rounded-2xl border border-secondary-200 bg-white shadow-sm overflow-hidden dark:border-secondary-800 dark:bg-secondary-900">
                        <div className="border-b border-secondary-200 bg-secondary-50/50 px-5 py-4 dark:border-secondary-800 dark:bg-secondary-950">
                          <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-wider">{t("portal.quotes.details.pricing") || "Pricing Breakdown"}</h3>
                        </div>
                        <div className="p-5">
                          <div className="space-y-3">
                            {/* Mocking Items for display as the exact schema might differ */}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-secondary-600 dark:text-secondary-400">Ocean Freight (FCL - 1x40HQ)</span>
                              <span className="font-medium text-secondary-900 dark:text-white">$3,200.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-secondary-600 dark:text-secondary-400">Terminal Handling Charges (THC)</span>
                              <span className="font-medium text-secondary-900 dark:text-white">$150.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-secondary-600 dark:text-secondary-400">Customs Clearance</span>
                              <span className="font-medium text-secondary-900 dark:text-white">$350.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-secondary-600 dark:text-secondary-400">Documentation Fee</span>
                              <span className="font-medium text-secondary-900 dark:text-white">$50.00</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-secondary-200 border-dashed flex justify-between items-end dark:border-secondary-800">
                            <div>
                              <p className="text-xs font-bold text-secondary-500 uppercase">{t("portal.quotes.details.grandTotal") || "Grand Total"}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                ${(quote.totalAmount || 3750).toLocaleString()}
                              </span>
                              <span className="ml-1 text-sm font-bold text-secondary-500">{quote.currency || "USD"}</span>
                            </div>
                          </div>
                        </div>
                      </section>

                    </div>

                    {/* Actions Footer */}
                    <div className="flex flex-shrink-0 justify-between border-t border-secondary-200 bg-white px-4 py-4 dark:border-secondary-800 dark:bg-secondary-900 sm:px-6">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:ring-secondary-700 dark:hover:bg-secondary-700"
                        >
                          <Download className="mr-1.5 h-4 w-4 rtl:ml-1.5 rtl:mr-0 text-secondary-500" />
                          PDF
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:ring-secondary-700 dark:hover:bg-secondary-700"
                        >
                          <Printer className="h-4 w-4 text-secondary-500" />
                        </button>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-inset ring-secondary-300 hover:bg-rose-50 hover:ring-rose-200 dark:bg-secondary-800 dark:text-rose-400 dark:ring-secondary-700 dark:hover:bg-rose-900/30 dark:hover:ring-rose-800/50"
                          onClick={handleReject}
                        >
                          <XCircle className="mr-1.5 h-4 w-4 rtl:ml-1.5 rtl:mr-0" />
                          {t("portal.quotes.actions.reject") || "Reject"}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                          onClick={handleAccept}
                        >
                          <CheckCircle className="mr-1.5 h-4 w-4 rtl:ml-1.5 rtl:mr-0" />
                          {t("portal.quotes.actions.accept") || "Accept Quote"}
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
