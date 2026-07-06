import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <>
      <Head>
        <title>Wedding Mood Board Pro</title>
        <meta name="description" content="Create beautiful wedding mood boards collaboratively" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-wedding-cream">
        {/* Placeholder - Will be replaced with landing page */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-5xl font-serif text-wedding-dark mb-4">Wedding Mood Board Pro</h1>
            <p className="text-lg text-gray-600 mb-8">Create beautiful mood boards with your partner</p>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
