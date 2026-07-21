"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "!border !border-secondary-200 !shadow-premium-lg dark:!border-secondary-700",
      }}
    />
  )
}
