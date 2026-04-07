import { MONTHLY_AMOUNT } from '../../utils/supabase'

interface TotalFundCardProps {
  totalPaid: number
  totalMembers: number
  isLoading?: boolean
}

export function TotalFundCard({ totalPaid, totalMembers, isLoading }: TotalFundCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <div className="skeleton h-4 w-24 mb-3" style={{ background: 'rgba(51,65,85,0.6)' }} />
        <div className="skeleton h-10 w-48 mb-2" style={{ background: 'rgba(51,65,85,0.6)' }} />
        <div className="skeleton h-3 w-32" style={{ background: 'rgba(51,65,85,0.6)' }} />
      </div>
    )
  }

  const formattedAmount = new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(totalPaid)

  return (
    <div className="gradient-card glass-card p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-primary-300)' }}>
          Total Fund
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.2)' }}
        >
          <span className="text-sm">💰</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="text-3xl font-bold animate-count-up"
          style={{ color: 'var(--color-surface-50)' }}
        >
          ৳{formattedAmount}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-surface-400)' }}>
          BDT
        </span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-surface-400)' }}>
        from {totalMembers} members • ৳{MONTHLY_AMOUNT.toLocaleString()}/month each
      </p>
    </div>
  )
}
