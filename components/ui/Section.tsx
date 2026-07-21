import { cn } from "@/lib/utils"
import { Container } from "./Container"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  id?: string
}

export function Section({
  children,
  className,
  containerClassName,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("section-padding", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
