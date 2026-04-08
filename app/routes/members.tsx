import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Users, Crown, RefreshCw, X, Wallet, Clock } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { BottomNav } from '../components/layout/BottomNav'
import { useAuth } from '../components/auth/AuthProvider'
import { Timeline } from '../components/contributions/Timeline'
import { supabase, getAvatarColor, getInitials, MONTHLY_AMOUNT } from '../utils/supabase'
import type { Profile, Payment } from '../utils/supabase'

export const Route = createFileRoute('/members')({
  component: MembersPage,
})

interface MemberWithTotal {
  profile: Profile
  totalPaid: number
  monthsPaid: number
}

function MembersPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [members, setMembers] = useState<MemberWithTotal[]>([])
  const [allPayments, setAllPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<MemberWithTotal | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleMemberClick = (member: MemberWithTotal) => {
    setSelectedMember(member)
    setIsDrawerOpen(true)
  }

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/login' })
      return
    }

    async function fetchMembers() {
      try {
        // Fetch all profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name')

        // Fetch all payments for history
        const { data: payments } = await supabase
          .from('payments')
          .select('*')

        setAllPayments(payments ?? [])

        const membersWithTotals: MemberWithTotal[] = (profiles ?? []).map((p) => {
          const userPayments = (payments ?? []).filter((pay) => pay.user_id === p.id && pay.status === 'paid')
          return {
            profile: p as Profile,
            totalPaid: userPayments.reduce((sum, pay) => sum + Number(pay.amount), 0),
            monthsPaid: userPayments.length,
          }
        })

        // Sort by total paid descending
        membersWithTotals.sort((a, b) => b.totalPaid - a.totalPaid)
        setMembers(membersWithTotals)
      } catch (err) {
        console.error('Error fetching members:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchMembers()
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-dvh">
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary-400)' }} />
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)' }}
          >
            <Users size={20} style={{ color: 'var(--color-primary-400)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
              Members
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
              {members.length} total members
            </p>
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-3">
                <div className="skeleton w-12 h-12 rounded-full" style={{ background: 'rgba(51,65,85,0.6)' }} />
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 mb-2" style={{ background: 'rgba(51,65,85,0.6)' }} />
                  <div className="skeleton h-3 w-20" style={{ background: 'rgba(51,65,85,0.6)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {members.map((member, index) => (
              <div
                key={member.profile.id}
                className="glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => handleMemberClick(member)}
              >
                {/* Rank + Avatar */}
                <div className="relative">
                  <div
                    className="avatar avatar-lg"
                    style={{ background: getAvatarColor(member.profile.full_name) }}
                  >
                    {getInitials(member.profile.full_name)}
                  </div>
                  {index === 0 && member.totalPaid > 0 && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-warning)' }}
                    >
                      <Crown size={10} color="white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-surface-100)' }}>
                      {member.profile.full_name}
                    </p>
                    {member.profile.role === 'admin' && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-400)' }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
                    {member.monthsPaid} month{member.monthsPaid !== 1 ? 's' : ''} paid
                  </p>
                </div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--color-surface-100)' }}>
                    ৳{member.totalPaid.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-surface-600)' }}>
                    total
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />

      {/* Member History Drawer */}
      {isDrawerOpen && selectedMember && (
        <>
          <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
          <div className="drawer-content">
            <div className="drawer-handle" />
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="avatar avatar-lg"
                  style={{ background: getAvatarColor(selectedMember.profile.full_name) }}
                >
                  {getInitials(selectedMember.profile.full_name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--color-surface-50)' }}>
                      {selectedMember.profile.full_name}
                    </h3>
                    {selectedMember.profile.role === 'admin' && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-400)' }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-primary-400)' }}>
                    Member History
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-surface-800 transition-colors"
                style={{ color: 'var(--color-surface-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-card p-4 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={16} style={{ color: 'var(--color-primary-400)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-surface-400)' }}>
                    Total Paid
                  </span>
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
                  ৳{selectedMember.totalPaid.toLocaleString()}
                </p>
              </div>

              <div className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} style={{ color: 'var(--color-success)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-surface-400)' }}>
                    Months Paid
                  </span>
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
                  {selectedMember.monthsPaid}
                </p>
              </div>
            </div>

            {/* History Timeline */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-surface-500)' }}>
                  Contribution History
                </h4>
                <Timeline 
                  payments={allPayments.filter(p => p.user_id === selectedMember.profile.id)} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </MobileLayout>
  )
}
