import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Sparkles, Users, ImageIcon, Palette, Download, Share2, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: <ImageIcon className="w-12 h-12" />,
      title: 'Drag & Drop Canvas',
      description: 'Easily organize your inspiration with our intuitive drag-and-drop interface',
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: 'Color Palette Manager',
      description: 'Create and save your wedding color schemes with our built-in palette picker',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Real-time Collaboration',
      description: 'Work together with your partner and designer in real-time',
    },
    {
      icon: <Download className="w-12 h-12" />,
      title: 'Export as PDF',
      description: 'Download your mood board as a beautiful, print-ready PDF document',
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: 'Easy Sharing',
      description: 'Share your mood boards with family, friends, and vendors',
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Elegant Design',
      description: 'Beautiful, minimalist interface inspired by high-end wedding magazines',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Your Board',
      description: 'Enter your couple name and wedding date to get started',
    },
    {
      number: '02',
      title: 'Upload Images',
      description: 'Add inspiration images from your computer or our gallery',
    },
    {
      number: '03',
      title: 'Organize & Customize',
      description: 'Drag images into sections and choose your color palette',
    },
    {
      number: '04',
      title: 'Export & Share',
      description: 'Download as PDF or share with collaborators',
    },
  ]

  return (
    <>
      <Head>
        <title>Wedding Mood Board Pro - Create Your Perfect Wedding Vision</title>
        <meta
          name="description"
          content="Create beautiful, collaborative wedding mood boards with your partner and designer. Drag-and-drop interface, real-time collaboration, and PDF export."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-wedding-cream min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <span className="bg-wedding-gold bg-opacity-20 text-wedding-gold px-4 py-2 rounded-full text-sm font-semibold">
                ✨ The Smart Way to Plan Your Wedding
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-wedding-dark mb-6 leading-tight">
              Your Wedding Vision,
              <span className="text-wedding-gold"> Visualized</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Collaborate with your partner and designer to create stunning mood boards that bring your wedding dreams to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => router.push('/signup')}>
                Start Creating Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('#how-it-works')}>
                See How It Works
              </Button>
            </div>
            <p className="text-gray-500 text-sm">✅ No credit card required • ✅ Takes 2 minutes • ✅ Free to start</p>
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-wedding-dark mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, organize, and share your wedding mood boards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-wedding-gold mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif font-semibold text-wedding-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-wedding-dark mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get started in just 4 simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Step Number */}
                  <div className="text-6xl font-serif font-bold text-wedding-gold opacity-20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-wedding-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  {/* Arrow connector (hidden on last item) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-8 text-wedding-gold text-2xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-wedding-cream py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-wedding-dark mb-12">
              Loved by Couples
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-card">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">⭐</span>
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-6 italic">
                "This app made planning our wedding so much easier! We could see our vision come together in real-time and collaborate with our designer seamlessly."
              </p>
              <p className="font-serif font-semibold text-wedding-dark">— Sarah & John</p>
              <p className="text-gray-500 text-sm">Married June 2024</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-wedding-dark text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Ready to Visualize Your Dream Wedding?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join hundreds of couples creating their perfect wedding mood boards
            </p>
            <Button
              size="lg"
              className="bg-wedding-gold text-wedding-dark hover:bg-yellow-600"
              onClick={() => router.push('/signup')}
            >
              Get Started Free Today
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
