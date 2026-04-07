import { type ReactNode } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Lock } from 'lucide-react'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
  isSettingsPage?: boolean
}

export function MobileLayout({ children, className = '', noPadding = false, isSettingsPage = false }: MobileLayoutProps) {
  const { user, profile, loading } = useAuth()
  
  const isApproved = profile?.is_approved === true
  const isPending = user && !loading && !isApproved && !isSettingsPage && !!profile

  return (
    <div className="gradient-bg min-h-dvh">
      <div
        className={`mx-auto min-h-dvh max-w-md relative ${noPadding ? '' : 'px-4'} ${className}`}
      >
        {isPending ? (
          <div className="flex flex-col items-center justify-center min-h-dvh text-center px-6 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse-glow">
              <Lock size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-surface-50)' }}>
              Approval Pending
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-surface-400)' }}>
              Your account is waiting for admin approval. You will gain full access once an admin validates your profile.
            </p>
            <div className="w-full space-y-4">
              <div className="p-4 glass-card-light text-left">
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary-400)' }}>
                  What can I do?
                </p>
                <p className="text-sm" style={{ color: 'var(--color-surface-300)' }}>
                  You can still update your profile details in the settings page while you wait.
                </p>
              </div>
              <a href="/settings" className="btn-primary">
                Go to Settings
              </a>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
