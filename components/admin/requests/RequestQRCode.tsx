"use client"

import React, { useRef, useState } from "react"
import { Popover, Transition } from "@headlessui/react"
import Barcode from "react-barcode"
import { Barcode as BarcodeIcon } from "lucide-react"
import { useLocale } from "next-intl"

interface RequestQRCodeProps {
  requestId: string
  trackingNumber: string
}

export function RequestQRCode({ requestId, trackingNumber }: RequestQRCodeProps) {
  const locale = useLocale()

  return (
    <div className="relative inline-block">
      <Popover className="relative inline-flex items-center">
        {({ open }) => (
          <>
            <Popover.Button 
              className="p-1.5 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              title={`View Barcode for ${trackingNumber}`}
            >
              <BarcodeIcon className="w-5 h-5" />
            </Popover.Button>

            <Transition
              show={open}
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel 
                className="absolute z-50 mt-2 w-48 p-4 bg-white dark:bg-secondary-900 rounded-xl shadow-xl border border-secondary-200 dark:border-secondary-800 right-0 origin-top-right rtl:right-auto rtl:left-0 rtl:origin-top-left"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs font-bold text-secondary-500">{trackingNumber}</span>
                  <div className="p-2 bg-white rounded-lg flex justify-center items-center overflow-hidden w-full">
                    <Barcode value={trackingNumber} width={1.5} height={50} displayValue={false} />
                  </div>
                  <span className="text-[10px] text-center text-secondary-400">Scan barcode for request details</span>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
