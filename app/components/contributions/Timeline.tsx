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
    <div className="relative pl-7">
      {/* Vertical line */}
      <div 
        className="absolute left-[11px] top-2 bottom-2 w-0.5" 
        style={{ background: 'linear-gradient(to bottom, var(--color-primary-500), rgba(99,102,241,0.05))' }}
      />

      <div className="space-y-5 stagger-children">
        {sortedPayments.map((payment, index) => {
          const isPaid = payment.status === 'paid'
          const isFirst = index === 0

          return (
            <div key={payment.id} className="flex items-start gap-5 relative">
              <div 
                className={`w-3 h-3 rounded-full border-2 border-primary-500 shrink-0 relative z-10 mt-1.5 ${isFirst ? 'bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-surface-950'}`} 
              />

              <div
                className="glass-card p-5 flex-1 transition-all hover:scale-[1.01]"
                style={{
                  borderLeft: isPaid
                    ? '3px solid var(--color-success)'
                    : '3px solid var(--color-surface-700)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-surface-50)' }}>
                    {MONTH_NAMES[payment.month - 1]} {payment.year}
                  </span>
                  {isPaid ? (
                    <span
                      className="flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)' }}
                    >
                      <Check size={10} /> Paid
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--color-surface-400)' }}
                    >
                      <Minus size={10} /> Pending
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--color-surface-500)' }}>Amount</p>
                    <span className="text-xl font-black" style={{ color: isPaid ? 'var(--color-surface-50)' : 'var(--color-surface-500)' }}>
                      ৳{payment.amount.toLocaleString()}
                    </span>
                  </div>
                  {payment.created_at && (
                    <div className="text-right">
                      <p className="text-[10px] mb-0.5" style={{ color: 'var(--color-surface-600)' }}>Date</p>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-surface-400)' }}>
                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </span>
                    </div>
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
