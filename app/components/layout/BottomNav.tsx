import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Users, Clock, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/my-contributions', label: 'History', icon: Clock },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function BottomNav() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.to
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
