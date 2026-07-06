import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  isLoggedIn?: boolean
  userName?: string
  onLogout?: () => void
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, userName = '', onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const router = useRouter()

  return (
    <header className="bg-white shadow-card sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-wedding-gold rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">💍</span>
          </div>
          <span className="font-serif font-bold text-2xl text-wedding-dark hidden sm:inline">
            Wedding Mood Board
          </span>
          <span className="font-serif font-bold text-xl text-wedding-dark sm:hidden">
            WMB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isLoggedIn ? (
            <>
              <Link href="#features" className="text-gray-600 hover:text-wedding-dark transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-wedding-dark transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-wedding-dark transition">
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-wedding-dark transition">
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">Welcome, {userName}!</span>
            </>
          )}
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/signup')}>Get Started</Button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={24} className="text-wedding-dark" />
          ) : (
            <Menu size={24} className="text-wedding-dark" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-wedding-cream border-t border-gray-200 px-4 py-4">
          <div className="flex flex-col gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="#features" className="text-gray-600 hover:text-wedding-dark">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-wedding-dark">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-wedding-dark">
                  Pricing
                </Link>
                <hr className="my-2" />
                <Button variant="ghost" className="w-full" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={() => router.push('/signup')}>
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-wedding-dark">
                  Dashboard
                </Link>
                <hr className="my-2" />
                <button
                  onClick={onLogout}
                  className="text-left text-gray-600 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
