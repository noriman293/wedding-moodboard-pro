import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, LogOut, Home, LayoutDashboard, Settings, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Header Component Props
 * @param isLoggedIn - Menunjukkan status login user
 * @param userName - Nama user yang logged in
 * @param onLogout - Callback function ketika user klik logout
 */
interface HeaderProps {
  isLoggedIn?: boolean
  userName?: string
  onLogout?: () => void
}

/**
 * Header Component
 * Responsive navigation bar dengan support untuk desktop dan mobile (hamburger menu)
 * Menggunakan Lucide React icons dan wedding-themed colors
 */
export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  userName = '',
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Close mobile menu ketika user navigate ke halaman lain
  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  /**
   * Navigation links untuk authenticated users
   */
  const authenticatedLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help', href: '/help', icon: HelpCircle },
  ]

  /**
   * Navigation links untuk unauthenticated users
   */
  const publicLinks = [
    { label: 'Features', href: '#features', icon: null },
    { label: 'How It Works', href: '#how-it-works', icon: null },
    { label: 'Pricing', href: '#pricing', icon: null },
  ]

  const navLinks = isLoggedIn ? authenticatedLinks : publicLinks

  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-card sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-wedding-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-serif font-bold text-lg">💍</span>
              </div>
              {/* Brand Text - Hidden on mobile */}
              <div className="hidden sm:flex flex-col">
                <span className="font-serif font-bold text-lg text-wedding-dark leading-none">
                  Wedding
                </span>
                <span className="font-serif font-bold text-xs text-wedding-gold">
                  Mood Board
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Visible on md and above */}
            <div className="hidden md:flex items-center gap-8">
              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm font-semibold transition-colors duration-200 flex items-center gap-1',
                      router.pathname === link.href || router.asPath === link.href
                        ? 'text-wedding-gold'
                        : 'text-gray-600 hover:text-wedding-dark'
                    )}
                  >
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/login')}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => handleNavigation('/signup')}>
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  {/* User Welcome Text */}
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-wedding-dark">{userName}</span>!
                  </span>
                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 font-semibold"
                    title="Logout"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Visible on md and below */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-wedding-dark" />
              ) : (
                <Menu size={24} className="text-wedding-dark" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-card animate-in slide-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-3 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2',
                    router.pathname === link.href || router.asPath === link.href
                      ? 'bg-wedding-gold bg-opacity-10 text-wedding-gold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-wedding-dark'
                  )}
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleNavigation('/signup')}
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Welcome,{' '}
                      <span className="font-semibold text-wedding-dark">{userName}</span>!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onLogout?.()
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors duration-200"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
