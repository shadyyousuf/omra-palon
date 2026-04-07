import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { getAvatarColor, getInitials, MONTHLY_AMOUNT, MONTH_NAMES } from '../../utils/supabase'
import type { Profile } from '../../utils/supabase'

interface MarkAsPaidDrawerProps {
  profile: Profile
  month: number
  year: number
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function MarkAsPaidDrawer({ profile, month, year, onConfirm, onClose }: MarkAsPaidDrawerProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer-content">
        <div className="drawer-handle" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-surface-100)' }}>
            Confirm Payment
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(148,163,184,0.1)' }}
          >
            <X size={18} style={{ color: 'var(--color-surface-400)' }} />
          </button>
        </div>

        {/* Member Info */}
        <div className="glass-card-light p-4 flex items-center gap-4 mb-6">
          <div
            className="avatar avatar-lg"
            style={{ background: getAvatarColor(profile.full_name) }}
          >
            {getInitials(profile.full_name)}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--color-surface-100)' }}>
              {profile.full_name}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-surface-400)' }}>
              {MONTH_NAMES[month - 1]} {year}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-surface-500)' }}>
            Amount
          </p>
          <p className="text-4xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
            ৳{MONTHLY_AMOUNT.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-surface-500)' }}>
            BDT
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {loading ? 'Confirming...' : `Confirm ৳${MONTHLY_AMOUNT.toLocaleString()} BDT`}
          </button>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
