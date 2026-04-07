import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { getAvatarColor, getInitials, MONTHLY_AMOUNT, MONTH_NAMES } from '../../utils/supabase'
import type { Profile } from '../../utils/supabase'

interface MarkAsPaidDrawerProps {
  profile: Profile
  month: number
  year: number
  onConfirm: (amount: number) => Promise<void>
  onClose: () => void
}

export function MarkAsPaidDrawer({ profile, month, year, onConfirm, onClose }: MarkAsPaidDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<string>(MONTHLY_AMOUNT.toString())
  
  const numericAmount = Number(amount)
  const isInvalidAmount = !amount || isNaN(numericAmount) || numericAmount < MONTHLY_AMOUNT

  const handleConfirm = async () => {
    if (isInvalidAmount) return
    
    setLoading(true)
    try {
      await onConfirm(Number(amount))
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
        <div className="mb-6">
          <label htmlFor="custom-amount" className="text-xs uppercase tracking-wider mb-2 block text-center" style={{ color: 'var(--color-surface-500)' }}>
            Amount (BDT)
          </label>
          <div className="relative max-w-[240px] mx-auto">
            <span 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold" 
              style={{ color: 'var(--color-surface-400)' }}
            >
              ৳
            </span>
            <input
              id="custom-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-center font-black"
              min={MONTHLY_AMOUNT}
              style={{ 
                color: isInvalidAmount && amount !== '' ? 'var(--color-danger)' : 'var(--color-surface-50)', 
                fontSize: '28px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderColor: isInvalidAmount && amount !== '' ? 'var(--color-danger)' : undefined
              }}
            />
          </div>
          {isInvalidAmount && amount !== '' && (
            <p className="text-center text-xs mt-2 animate-fade-in" style={{ color: 'var(--color-danger)' }}>
              Minimum amount is ৳{MONTHLY_AMOUNT.toLocaleString()} BDT
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading || isInvalidAmount}
            className="btn-primary"
            style={{ opacity: loading || isInvalidAmount ? 0.5 : 1 }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {loading ? 'Confirming...' : `Confirm ৳${amount || '0'}`}
          </button>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
