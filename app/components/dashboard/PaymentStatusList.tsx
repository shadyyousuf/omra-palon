import { Check, Clock } from 'lucide-react'
import { getAvatarColor, getInitials, MONTHLY_AMOUNT } from '../../utils/supabase'
import type { Profile, Payment } from '../../utils/supabase'

interface MemberStatus {
  profile: Profile
  payment: Payment | null
}

interface PaymentStatusListProps {
  members: MemberStatus[]
  isAdmin: boolean
  onMarkAsPaid?: (profile: Profile) => void
  isLoading?: boolean
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="skeleton w-10 h-10 rounded-full" style={{ background: 'rgba(51,65,85,0.6)' }} />
      <div className="flex-1">
        <div className="skeleton h-4 w-28 mb-1.5" style={{ background: 'rgba(51,65,85,0.6)' }} />
        <div className="skeleton h-3 w-20" style={{ background: 'rgba(51,65,85,0.6)' }} />
      </div>
      <div className="skeleton w-8 h-8 rounded-full" style={{ background: 'rgba(51,65,85,0.6)' }} />
    </div>
  )
}

export function PaymentStatusList({ members, isAdmin, onMarkAsPaid, isLoading }: PaymentStatusListProps) {
  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <div className="skeleton h-4 w-32" style={{ background: 'rgba(51,65,85,0.6)' }} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    )
  }

  const paidMembers = members.filter((m) => m.payment?.status === 'paid')
  const pendingMembers = members.filter((m) => !m.payment || m.payment.status === 'pending')

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-surface-200)' }}>
          Payment Status
        </h3>
      </div>

      <div className="stagger-children">
        {/* Pending first */}
        {pendingMembers.map((member) => (
          <div
            key={member.profile.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors"
            style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}
          >
            <div
              className="avatar"
              style={{ background: getAvatarColor(member.profile.full_name) }}
            >
              {getInitials(member.profile.full_name)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-surface-100)' }}>
                {member.profile.full_name}
              </p>
              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-warning)' }}>
                <Clock size={11} />
                Pending
              </p>
            </div>

            {isAdmin && onMarkAsPaid ? (
              <button
                onClick={() => onMarkAsPaid(member.profile)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: 'var(--color-primary-400)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                ৳{MONTHLY_AMOUNT.toLocaleString()}
              </button>
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.1)' }}
              >
                <Clock size={16} style={{ color: 'var(--color-warning)' }} />
              </div>
            )}
          </div>
        ))}

        {/* Paid members */}
        {paidMembers.map((member) => (
          <div
            key={member.profile.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors"
            style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}
          >
            <div
              className="avatar"
              style={{ background: getAvatarColor(member.profile.full_name) }}
            >
              {getInitials(member.profile.full_name)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-surface-100)' }}>
                {member.profile.full_name}
              </p>
              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
                <Check size={11} />
                Paid ৳{member.payment!.amount.toLocaleString()}
              </p>
            </div>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.1)' }}
            >
              <Check size={16} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-surface-500)' }}>
            No members found
          </p>
        </div>
      )}
    </div>
  )
}
