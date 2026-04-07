import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { signIn } from '../utils/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileLayout>
      <div className="flex flex-col justify-center min-h-dvh py-8">
        {/* Logo / Brand */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center gradient-primary animate-pulse-glow"
            style={{ fontSize: '36px' }}
          >
            💰
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-surface-50)' }}>
            Omra Palon
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-surface-400)' }}>
            Track contributions with your friends
          </p>
        </div>

        {/* Login Form */}
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
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                required
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
              <LogIn size={18} />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign up link */}
        <p
          className="text-center text-sm mt-6 animate-fade-in-up"
          style={{ color: 'var(--color-surface-500)', animationDelay: '0.3s' }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold"
            style={{ color: 'var(--color-primary-400)' }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </MobileLayout>
  )
}
