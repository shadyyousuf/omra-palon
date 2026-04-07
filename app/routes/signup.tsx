import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Mail, Lock, User, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { signUp } from '../utils/auth'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUp(email, password, fullName)
      setSuccess(true)
      // Auto-redirect after a short delay
      setTimeout(() => navigate({ to: '/dashboard' }), 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-dvh text-center animate-fade-in-up">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-surface-50)' }}>
            Welcome aboard!
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-surface-400)' }}>
            Your account has been created. Redirecting...
          </p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="flex flex-col justify-center min-h-dvh py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center gradient-primary"
            style={{ fontSize: '36px' }}
          >
            🤝
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-surface-50)' }}>
            Join the Group
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-surface-400)' }}>
            Create your account to start tracking
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {error && (
            <div
              className="p-3 rounded-xl text-sm text-center animate-fade-in"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: 'var(--color-danger)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="input-label">Full Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-surface-500)' }}
              />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="input-label">Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-surface-500)' }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="input-label">Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-surface-500)' }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-field"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-surface-500)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '24px' }}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p
          className="text-center text-sm mt-6 animate-fade-in-up"
          style={{ color: 'var(--color-surface-500)', animationDelay: '0.3s' }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: 'var(--color-primary-400)' }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </MobileLayout>
  )
}
