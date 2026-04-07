import { useState } from 'react'
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { getAvatarColor, getInitials } from '../../utils/supabase'
import type { Profile } from '../../utils/supabase'

interface DeleteMemberDrawerProps {
  profile: Profile
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function DeleteMemberDrawer({ profile, onConfirm, onClose }: DeleteMemberDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      await onConfirm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to delete member')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer-content">
        <div className="drawer-handle" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
               <AlertTriangle size={18} />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-surface-100)' }}>
              Delete Member
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(148,163,184,0.1)' }}
          >
            <X size={18} style={{ color: 'var(--color-surface-400)' }} />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-surface-300)' }}>
            Are you sure you want to delete <span className="font-bold text-white">{profile.full_name}</span>? 
            This will permanently remove their profile and database records. This action cannot be undone.
          </p>
        </div>

        {/* Member Info Card */}
        <div className="glass-card-light p-4 flex items-center gap-4 mb-8">
          <div
            className="avatar"
            style={{ background: getAvatarColor(profile.full_name) }}
          >
            {getInitials(profile.full_name)}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--color-surface-100)' }}>
              {profile.full_name}
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-surface-500)' }}>
              {profile.role}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl text-xs text-center bg-red-500/10 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Actions - Confirm Left, Cancel Right */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
            style={{ 
              background: 'var(--color-danger)', 
              color: 'white',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 h-12 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95 border"
            style={{ 
              background: 'rgba(148,163,184,0.05)', 
              borderColor: 'rgba(148,163,184,0.1)',
              color: 'var(--color-surface-300)'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
