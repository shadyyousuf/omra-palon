import { Check, Minus } from 'lucide-react'
import { MONTH_NAMES, MONTHLY_AMOUNT } from '../../utils/supabase'
import type { Payment } from '../../utils/supabase'

interface TimelineProps {
  payments: Payment[]
  isLoading?: boolean
}

export function Timeline({ payments, isLoading }: TimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 pl-6 relative">
        <div className="timeline-line" style={{ top: 0 }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-4 relative">
            <div className="timeline-dot" />
            <div className="glass-card p-4 flex-1">
              <div className="skeleton h-4 w-24 mb-2" style={{ background: 'rgba(51,65,85,0.6)' }} />
              <div className="skeleton h-3 w-16" style={{ background: 'rgba(51,65,85,0.6)' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Sort payments by year and month descending
  const sortedPayments = [...payments].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  if (sortedPayments.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-surface-300)' }}>
          No contribution history yet
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-surface-500)' }}>
          Your payments will appear here as a timeline
        </p>
      </div>
    )
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="timeline-line" />

      <div className="space-y-4 stagger-children">
        {sortedPayments.map((payment, index) => {
          const isPaid = payment.status === 'paid'
          const isFirst = index === 0

          return (
            <div key={payment.id} className="flex items-start gap-4 relative">
              <div className={`timeline-dot ${isFirst ? 'active' : ''}`} />

              <div
                className="glass-card p-4 flex-1 transition-all"
                style={{
                  borderLeft: isPaid
                    ? '2px solid var(--color-success)'
                    : '2px solid var(--color-surface-700)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-surface-100)' }}>
                    {MONTH_NAMES[payment.month - 1]} {payment.year}
                  </span>
                  {isPaid ? (
                    <span
                      className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)' }}
                    >
                      <Check size={11} /> Paid
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--color-surface-400)' }}
                    >
                      <Minus size={11} /> Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: isPaid ? 'var(--color-surface-100)' : 'var(--color-surface-500)' }}>
                    ৳{MONTHLY_AMOUNT.toLocaleString()}
                  </span>
                  {payment.created_at && (
                    <span className="text-xs" style={{ color: 'var(--color-surface-600)' }}>
                      {new Date(payment.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
