import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Settings2, LogOut, User, Loader2, RefreshCw, Shield, Info } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { BottomNav } from '../components/layout/BottomNav'
import { useAuth } from '../components/auth/AuthProvider'
import { signOut, updateProfile } from '../utils/auth'
import { supabase, getAvatarColor, getInitials } from '../utils/supabase'
import type { Profile } from '../utils/supabase'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // Admin management state
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [adminActionLoading, setAdminActionLoading] = useState<string | null>(null)

  const isAdmin = profile?.role === 'admin'

  const fetchAllProfiles = async () => {
    if (!isAdmin) return
    setLoadingProfiles(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setAllProfiles(data as Profile[])
    } catch (err) {
      console.error('Error fetching all profiles:', err)
    } finally {
      setLoadingProfiles(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAllProfiles()
    }
  }, [isAdmin])

  const handleAdminAction = async (targetId: string, updates: Partial<Profile>) => {
    setAdminActionLoading(targetId)
    try {
      await updateProfile(targetId, updates)
      await fetchAllProfiles()
      if (targetId === user?.id) {
        await refreshProfile()
      }
    } catch (err) {
      console.error('Admin action failed:', err)
    } finally {
      setAdminActionLoading(null)
    }
  }

  const handleSaveName = async () => {
    if (!user || !fullName.trim()) return
    setSaving(true)
    try {
      await updateProfile(user.id, { full_name: fullName.trim() })
      await refreshProfile()
      setEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate({ to: '/login' })
    } catch (err) {
      console.error('Error signing out:', err)
      setSigningOut(false)
    }
  }

  if (authLoading) {
    return (
      <MobileLayout isSettingsPage>
        <div className="flex items-center justify-center min-h-dvh">
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary-400)' }} />
        </div>
      </MobileLayout>
    )
  }

  if (!user || !profile) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <MobileLayout isSettingsPage>
      <div className="pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)' }}
          >
            <Settings2 size={20} style={{ color: 'var(--color-primary-400)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-surface-50)' }}>
            Settings
          </h1>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-5 mb-4 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="avatar avatar-xl"
              style={{ background: getAvatarColor(profile.full_name) }}
            >
              {getInitials(profile.full_name)}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field text-sm"
                    style={{ padding: '8px 12px' }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'var(--color-primary-600)', color: 'white' }}
                  >
                    {saving ? '...' : 'Save'}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-surface-50)' }}>
                    {profile.full_name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
                    {user.email}
                  </p>
                </>
              )}
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setFullName(profile.full_name)
                setEditing(true)
              }}
              className="btn-ghost text-sm"
              style={{ padding: '8px 16px' }}
            >
              <User size={16} />
              Edit Name
            </button>
          )}
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="btn-ghost text-sm"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="glass-card overflow-hidden mb-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary-400)' }}>
                Admin Management
              </span>
              <button 
                onClick={fetchAllProfiles} 
                disabled={loadingProfiles}
                className="p-1 rounded-lg hover:bg-surface-800 transition-colors"
                title="Refresh users"
              >
                <RefreshCw size={14} className={loadingProfiles ? 'animate-spin' : ''} style={{ color: 'var(--color-surface-400)' }} />
              </button>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.06)' }}>
              {loadingProfiles && allProfiles.length === 0 ? (
                <div className="p-8 text-center">
                  <Loader2 size={24} className="animate-spin mx-auto opacity-20" />
                </div>
              ) : (
                <>
                  {/* Approval Section */}
                  {allProfiles.filter(p => !p.is_approved).length > 0 && (
                    <div className="p-4" style={{ background: 'rgba(245,158,11,0.05)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50" style={{ color: 'var(--color-warning)' }}>
                        Pending Approval
                      </p>
                      <div className="space-y-3">
                        {allProfiles.filter(p => !p.is_approved).map(p => (
                          <div key={p.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="avatar avatar-sm" style={{ background: getAvatarColor(p.full_name) }}>
                                {getInitials(p.full_name)}
                              </div>
                              <span className="text-sm font-medium" style={{ color: 'var(--color-surface-100)' }}>{p.full_name}</span>
                            </div>
                            <button
                              onClick={() => handleAdminAction(p.id, { is_approved: true })}
                              disabled={!!adminActionLoading}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
                              style={{ background: 'var(--color-success)', color: 'white' }}
                            >
                              {adminActionLoading === p.id ? '...' : 'Approve'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role Section */}
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50" style={{ color: 'var(--color-surface-400)' }}>
                      Manage Members
                    </p>
                    <div className="space-y-3">
                      {allProfiles.filter(p => p.is_approved).map(p => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="avatar avatar-sm" style={{ background: getAvatarColor(p.full_name) }}>
                              {getInitials(p.full_name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium" style={{ color: 'var(--color-surface-100)' }}>{p.full_name}</span>
                              <span className="text-[10px] opacity-40">{p.id === user?.id ? 'You' : p.role}</span>
                            </div>
                          </div>
                          
                          {p.id !== user?.id && (
                            <button
                              onClick={() => handleAdminAction(p.id, { role: p.role === 'admin' ? 'member' : 'admin' })}
                              disabled={!!adminActionLoading}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all"
                              style={{ 
                                borderColor: p.role === 'admin' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
                                color: p.role === 'admin' ? 'var(--color-danger)' : 'var(--color-primary-400)',
                                background: p.role === 'admin' ? 'rgba(239,68,68,0.05)' : 'rgba(99,102,241,0.05)'
                              }}
                            >
                              {adminActionLoading === p.id ? '...' : p.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="glass-card overflow-hidden mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-surface-500)' }}>
              Account
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.06)' }}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Shield size={18} style={{ color: 'var(--color-surface-400)' }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-surface-200)' }}>Role</p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{
                  background: profile.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(148,163,184,0.1)',
                  color: profile.role === 'admin' ? 'var(--color-primary-400)' : 'var(--color-surface-400)',
                }}
              >
                {profile.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>

            <div className="flex items-center gap-3 px-4 py-3.5">
              <Info size={18} style={{ color: 'var(--color-surface-400)' }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-surface-200)' }}>App Version</p>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-surface-500)' }}>
                1.0.0
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full p-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all animate-fade-in-up"
          style={{
            animationDelay: '0.2s',
            background: 'rgba(239,68,68,0.08)',
            color: 'var(--color-danger)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          {signingOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      <BottomNav />
    </MobileLayout>
  )
}
