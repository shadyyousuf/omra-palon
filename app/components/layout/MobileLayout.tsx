import type { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function MobileLayout({ children, className = '', noPadding = false }: MobileLayoutProps) {
  return (
    <div className="gradient-bg min-h-dvh">
      <div
        className={`mx-auto min-h-dvh max-w-md relative ${noPadding ? '' : 'px-4'} ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
