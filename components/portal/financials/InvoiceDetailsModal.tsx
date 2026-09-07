"use client"

import { useState, useEffect, Fragment } from "react"
import { useTranslations } from "next-intl"
import { Dialog, Transition } from "@headlessui/react"
import { X, RefreshCw } from "lucide-react"
import { InvoiceLivePreview } from "./InvoiceLivePreview"

interface InvoiceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceToken: string
}

export function InvoiceDetailsModal({ isOpen, onClose, invoiceToken }: InvoiceDetailsModalProps) {
  const t = useTranslations()
  const [data, setData] = useState<{ invoice: any, payments: any[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && invoiceToken) {
      setLoading(true)
      fetch(`/api/invoice/${invoiceToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setData({ invoice: data.invoice, payments: data.payments })
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, invoiceToken])

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
          <div className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm transition-opacity dark:bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all w-full max-w-5xl my-8">
                
                {/* Close Button floating outside the document */}
                <div className="absolute right-4 top-4 z-10 rtl:right-auto rtl:left-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-900/10 text-secondary-500 hover:bg-secondary-900/20 focus:outline-none dark:bg-black/40 dark:text-secondary-400 dark:hover:bg-black/60 backdrop-blur-md"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-slate-50/50 p-4 sm:p-8 md:p-12 dark:bg-secondary-950 max-h-[90vh] overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mb-4" />
                      <p className="text-secondary-500 font-medium">{t("portal.financials.loadingDetails") || "Loading invoice details..."}</p>
                    </div>
                  ) : data?.invoice ? (
                    <InvoiceLivePreview invoice={data.invoice} payments={data.payments} />
                  ) : (
                    <div className="py-20 text-center text-rose-500 font-bold">Failed to load invoice.</div>
                  )}
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
