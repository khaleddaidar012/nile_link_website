import type { IconType } from "react-icons"
import { FaPhone, FaEnvelope, FaWhatsapp, FaFacebook, FaLinkedin, FaMapMarkedAlt, FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa"

export const CONTACT = {
  COMPANY_NAME: "Nile Link Logistics Services",
  EMAIL: "info@nilelinklogistics.com",
  PHONE: "+20100018549",
  PHONE_ALT: "+20100018549",
  WHATSAPP: "https://wa.me/201000018549",
  FACEBOOK: "https://www.facebook.com/nilelinklogistics/",
  LINKEDIN: "https://www.linkedin.com/company/nilelinklogistics/about/?viewAsMember=true",
  MAPS: "https://maps.google.com/?q=31.4038182,31.8101459",
} as const

export interface ContactChannel {
  id: string
  title: string
  description: string
  value: string
  href: string
  icon: IconType
  external?: boolean
  hidden?: boolean
  secondaryValue?: string
  secondaryHref?: string
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "phone",
    title: "contact.channels.phone.title",
    description: "contact.channels.phone.description",
    value: "+20 10 00018549",
    href: "tel:+20100018549",
    icon: FaPhone,
    secondaryValue: "0572222008",
    secondaryHref: "tel:0572222008",
  },
  {
    id: "email",
    title: "contact.channels.email.title",
    description: "contact.channels.email.description",
    value: "info@nilelinklogistics.com",
    href: "mailto:info@nilelinklogistics.com",
    icon: FaEnvelope,
  },
  {
    id: "whatsapp",
    title: "contact.channels.whatsapp.title",
    description: "contact.channels.whatsapp.description",
    value: "+20 10 0001 8549",
    href: "https://wa.me/201000018549",
    icon: FaWhatsapp,
    external: true,
  },
  {
    id: "facebook",
    title: "contact.channels.facebook.title",
    description: "contact.channels.facebook.description",
    value: "Nile Link Logistics",
    href: "https://www.facebook.com/nilelinklogistics/",
    icon: FaFacebook,
    external: true,
  },
  {
    id: "linkedin",
    title: "contact.channels.linkedin.title",
    description: "contact.channels.linkedin.description",
    value: "Nile Link Logistics",
    href: "https://www.linkedin.com/company/nilelinklogistics/about/?viewAsMember=true",
    icon: FaLinkedin,
    external: true,
  },
  {
    id: "maps",
    title: "contact.channels.maps.title",
    description: "contact.channels.maps.description",
    value: "Damietta, Egypt",
    href: "https://maps.google.com/?q=31.4038182,31.8101459",
    icon: FaMapMarkedAlt,
    external: true,
  },
  {
    id: "instagram",
    title: "contact.channels.instagram.title",
    description: "contact.channels.instagram.description",
    value: "@nilelinklogistics",
    href: "#",
    icon: FaInstagram,
    external: true,
    hidden: true,
  },
  {
    id: "x",
    title: "contact.channels.x.title",
    description: "contact.channels.x.description",
    value: "@nilelinklogistics",
    href: "#",
    icon: FaTwitter,
    external: true,
    hidden: true,
  },
  {
    id: "discord",
    title: "contact.channels.discord.title",
    description: "contact.channels.discord.description",
    value: "nilelinklogistics",
    href: "#",
    icon: FaDiscord,
    external: true,
    hidden: true,
  },
]
