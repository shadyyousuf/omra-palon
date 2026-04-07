import { MONTH_NAMES } from '../../utils/supabase'

interface MonthlyProgressProps {
  paidCount: number
  totalMembers: number
  month: number
  year: number
  isLoading?: boolean
}

export function MonthlyProgress({ paidCount, totalMembers, month, year, isLoading }: MonthlyProgressProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="skeleton h-4 w-32 mb-3" style={{ background: 'rgba(51,65,85,0.6)' }} />
        <div className="skeleton h-2 w-full mb-2" style={{ background: 'rgba(51,65,85,0.6)' }} />
        <div className="skeleton h-3 w-20" style={{ background: 'rgba(51,65,85,0.6)' }} />
      </div>
    )
  }

  const percentage = totalMembers > 0 ? Math.round((paidCount / totalMembers) * 100) : 0

  return (
    <div className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--color-surface-200)' }}>
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: percentage === 100 ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
            color: percentage === 100 ? 'var(--color-success)' : 'var(--color-primary-400)',
          }}
        >
          {paidCount}/{totalMembers} paid
        </span>
      </div>

      <div className="progress-bar-bg mb-2">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
          {percentage}% collected
        </span>
        {percentage === 100 && (
          <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>
            ✓ Complete
          </span>
        )}
      </div>
    </div>
  )
}
