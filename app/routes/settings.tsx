import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Settings2, LogOut, User, Loader2, RefreshCw, Shield, Info } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { BottomNav } from '../components/layout/BottomNav'
import { useAuth } from '../components/auth/AuthProvider'
import { signOut, updateProfile } from '../utils/auth'
import { getAvatarColor, getInitials } from '../utils/supabase'

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
      <MobileLayout>
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
    <MobileLayout>
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
