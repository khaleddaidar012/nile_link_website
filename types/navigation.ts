import type { LucideIcon } from "lucide-react"

export interface NavLink {
  href: string
  label: string
  children?: NavLink[]
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: LucideIcon
  image: string
  features: string[]
}

export interface StatItem {
  label: string
  value: number
  suffix: string
  prefix?: string
}

export interface TestimonialItem {
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
}

export interface FAQItem {
  question: string
  answer: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export interface ContactInfo {
  hq: {
    address: string[]
    city: string
    country: string
  }
  alexandria: {
    address: string[]
    city: string
    country: string
  }
  email: string
  phone: string[]
}
