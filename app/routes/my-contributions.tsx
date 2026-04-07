import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clock, RefreshCw, Wallet } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { BottomNav } from '../components/layout/BottomNav'
import { Timeline } from '../components/contributions/Timeline'
import { useAuth } from '../components/auth/AuthProvider'
import { supabase, MONTHLY_AMOUNT } from '../utils/supabase'
import type { Payment } from '../utils/supabase'

export const Route = createFileRoute('/my-contributions')({
  component: MyContributionsPage,
})

function MyContributionsPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/login' })
      return
    }

    async function fetchContributions() {
      if (!user) return

      try {
        const { data } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: false })
          .order('month', { ascending: false })

        setPayments((data ?? []) as Payment[])
      } catch (err) {
        console.error('Error fetching contributions:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchContributions()
  }, [user, authLoading, navigate])

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const monthsPaid = payments.filter((p) => p.status === 'paid').length

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
            <Clock size={20} style={{ color: 'var(--color-primary-400)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
              My Contributions
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
              Your payment history
            </p>
          </div>
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
              {loading ? (
                <span className="skeleton inline-block h-6 w-20" style={{ background: 'rgba(51,65,85,0.6)' }} />
              ) : (
                <>৳{totalPaid.toLocaleString()}</>
              )}
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
              {loading ? (
                <span className="skeleton inline-block h-6 w-12" style={{ background: 'rgba(51,65,85,0.6)' }} />
              ) : (
                monthsPaid
              )}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-surface-300)' }}>
            Payment Timeline
          </h2>
          <Timeline payments={payments} isLoading={loading} />
        </div>
      </div>

      <BottomNav />
    </MobileLayout>
  )
}
