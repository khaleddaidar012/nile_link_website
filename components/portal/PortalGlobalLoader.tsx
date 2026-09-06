"use client"

import { usePortal } from "./PortalContext"
import Image from "next/image"
import logoImg from "@/public/images/logo.png"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function PortalGlobalLoader() {
  const { loading } = usePortal()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (!loading) {
      // Small delay to ensure smooth transition after skeletons mount
      const timer = setTimeout(() => setShow(false), 400)
      return () => clearTimeout(timer)
    } else {
      setShow(true)
    }
  }, [loading])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={cn(
            "fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0f19] backdrop-blur-3xl",
          )}
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary-500/10 blur-[100px] animate-pulse" />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-28 w-28 drop-shadow-2xl translate-y-[15px]"
            >
              <Image
                src={logoImg}
                alt="NileLink Loading"
                fill
                sizes="112px"
                className="object-contain animate-bounce"
                style={{ animationDuration: '2s' }}
                priority
              />
            </motion.div>

            {/* Text & Progress */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-xl font-black tracking-widest text-secondary-900 dark:text-white uppercase">
                  NileLink
                </span>
                <span className="mt-1 h-[2px] w-full bg-primary-600 rounded-full" />
                <span className="mt-1.5 flex w-full justify-between text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  {"LOGISTICS".split("").map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-ping" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-ping" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-ping" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
