import { useState, useEffect, useCallback } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { BottomNav } from '../components/layout/BottomNav'
import { TotalFundCard } from '../components/dashboard/TotalFundCard'
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress'
import { PaymentStatusList } from '../components/dashboard/PaymentStatusList'
import { MarkAsPaidDrawer } from '../components/admin/MarkAsPaidDrawer'
import { useAuth } from '../components/auth/AuthProvider'
import { supabase, MONTH_NAMES, MONTHLY_AMOUNT } from '../utils/supabase'
import type { Profile, Payment } from '../utils/supabase'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

interface MemberStatus {
  profile: Profile
  payment: Payment | null
}

function DashboardPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  const [members, setMembers] = useState<MemberStatus[]>([])
  const [totalFund, setTotalFund] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      // Next month
      const nextDate = new Date(selectedYear, selectedMonth, 1)
      setSelectedMonth(nextDate.getMonth() + 1)
      setSelectedYear(nextDate.getFullYear())
      setLoading(true)
    } else if (isRightSwipe) {
      // Previous month
      const prevDate = new Date(selectedYear, selectedMonth - 2, 1)
      setSelectedMonth(prevDate.getMonth() + 1)
      setSelectedYear(prevDate.getFullYear())
      setLoading(true)
    }
  }

  // Admin drawer
  const [drawerProfile, setDrawerProfile] = useState<Profile | null>(null)

  const isAdmin = profile?.role === 'admin'

  const fetchData = useCallback(async () => {
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')

      // Fetch payments for selected month/year
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('month', selectedMonth)
        .eq('year', selectedYear)

      // Fetch total fund (all paid payments)
      const { data: totalData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')

      const total = totalData?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0
      setTotalFund(total)

      // Map members to their payment status
      const memberStatuses: MemberStatus[] = (profiles ?? []).map((p) => ({
        profile: p as Profile,
        payment: (payments ?? []).find((pay) => pay.user_id === p.id) as Payment | null,
      }))

      setMembers(memberStatuses)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/login' })
      return
    }
    if (user) {
      fetchData()
    }
  }, [user, authLoading, fetchData, navigate])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleMarkAsPaid = async (customAmount: number) => {
    if (!drawerProfile) return

    // Upsert payment record
    const { error } = await supabase
      .from('payments')
      .upsert(
        {
          user_id: drawerProfile.id,
          amount: customAmount,
          month: selectedMonth,
          year: selectedYear,
          status: 'paid',
        },
        { onConflict: 'user_id,month,year' }
      )

    if (error) throw error

    // Refresh data
    await fetchData()
  }

  const paidCount = members.filter((m) => m.payment?.status === 'paid').length

  // Generate month/year options (last 12 months)
  const monthOptions: { month: number; year: number }[] = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthOptions.push({ month: d.getMonth() + 1, year: d.getFullYear() })
  }

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
      <div 
        className="h-[calc(100dvh-5rem)] flex flex-col pt-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header - Fixed portion */}
        <div className="flex-none px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
              Welcome back
            </p>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
              {profile?.full_name ?? 'Dashboard'}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(148,163,184,0.08)' }}
          >
            <RefreshCw
              size={18}
              className={refreshing ? 'animate-spin' : ''}
              style={{ color: 'var(--color-surface-400)' }}
            />
          </button>
        </div>
        </div>

        {/* Scrollable area for fixed content + list */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
          {/* Total Fund Card */}
          <div className="mb-4">
          <TotalFundCard
            totalPaid={totalFund}
            totalMembers={members.length}
            isLoading={loading}
          />
        </div>

        {/* Month Selector + Progress */}
        <div className="mb-4 relative">
          <div className="flex justify-end">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-1.5 text-sm font-medium mb-3 transition-colors"
              style={{ color: 'var(--color-primary-400)' }}
            >
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Month picker dropdown */}
          {showMonthPicker && (
            <>
              {/* Invisible overlay to catch clicks outside the dropdown */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMonthPicker(false)} 
              />
              <div
                className="absolute top-8 right-0 z-50 p-2 animate-fade-in rounded-2xl border overflow-y-auto"
                style={{ 
                  minWidth: '220px',
                  maxHeight: '300px',
                  background: 'var(--color-surface-900)',
                  borderColor: 'rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
                }}
              >
              {monthOptions.map((opt) => (
                <button
                  key={`${opt.month}-${opt.year}`}
                  onClick={() => {
                    setSelectedMonth(opt.month)
                    setSelectedYear(opt.year)
                    setShowMonthPicker(false)
                    setLoading(true)
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors mb-1 last:mb-0"
                  style={{
                    color:
                      opt.month === selectedMonth && opt.year === selectedYear
                        ? 'white'
                        : 'var(--color-surface-300)',
                    background:
                      opt.month === selectedMonth && opt.year === selectedYear
                        ? 'var(--color-primary-500)'
                        : 'transparent',
                  }}
                >
                  {MONTH_NAMES[opt.month - 1]} {opt.year}
                </button>
              ))}
            </div>
          </>
        )}

          <MonthlyProgress
            paidCount={paidCount}
            totalMembers={members.length}
            month={selectedMonth}
            year={selectedYear}
            isLoading={loading}
          />
        </div>

        {/* Payment Status List */}
        <PaymentStatusList
          members={members}
          isAdmin={isAdmin}
          onMarkAsPaid={(p) => setDrawerProfile(p)}
          isLoading={loading}
        />
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />

      {/* Mark as Paid Drawer */}
      {drawerProfile && (
        <MarkAsPaidDrawer
          profile={drawerProfile}
          month={selectedMonth}
          year={selectedYear}
          onConfirm={handleMarkAsPaid}
          onClose={() => setDrawerProfile(null)}
        />
      )}
    </MobileLayout>
  )
}
