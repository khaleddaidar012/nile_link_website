"use client"

import { type ReactNode, useCallback } from "react"
import { CONTACT } from "@/constants/contact"

type EmailLinkProps = {
  email?: string
  children?: ReactNode
  className?: string
}

function getGmailUrl(email: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
}

export function EmailLink({ email = CONTACT.EMAIL, children, className }: EmailLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      const gmailUrl = getGmailUrl(email)
      const mailtoUrl = `mailto:${email}`

      const gmailWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer")

      if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === "undefined") {
        window.location.href = mailtoUrl
      }
    },
    [email]
  )

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={className}
      aria-label={`Send email to ${email}`}
    >
      {children || email}
    </a>
  )
}
