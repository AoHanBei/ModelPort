import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('h-5 w-5', className)}>
      <path d="M5 8.5h5.2l5.8 7.5h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 23.5h5.2l5.8-7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="8.5" r="2.5" fill="currentColor" />
      <circle cx="5" cy="23.5" r="2.5" fill="currentColor" />
      <rect x="13" y="12.5" width="7" height="7" rx="2.2" fill="currentColor" />
      <path d="m24 12 4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
