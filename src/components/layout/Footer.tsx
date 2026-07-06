import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-wedding-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-wedding-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">💍</span>
              </div>
              <span className="font-serif font-bold text-lg">Wedding Mood Board</span>
            </div>
            <p className="text-gray-300 text-sm">Create beautiful mood boards for your perfect wedding day</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wedding-gold transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-300 text-sm text-center md:text-left">
            © {currentYear} Wedding Mood Board Pro. All rights reserved.
          </p>
          <p className="text-gray-300 text-sm flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart size={16} className="text-wedding-gold" /> for beautiful weddings
          </p>
        </div>
      </div>
    </footer>
  )
}
