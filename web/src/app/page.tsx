'use client';

import Header from '@/components/header';

export default function Home() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)'
      }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Find Your Perfect
            <span 
              className="block"
              style={{ color: 'var(--color-primary)' }}
            >
              Old Phone
            </span>
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            Buy and sell used phones with confidence. Quality guaranteed, prices you&apos;ll love.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 text-lg font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)'
              }}
            >
              Browse Phones
            </button>
            <button
              className="px-8 py-4 text-lg font-semibold rounded-lg border hover:opacity-80 transition-opacity"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
                backgroundColor: 'transparent'
              }}
            >
              Sell Your Phone
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Easy Search
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              Find exactly what you&apos;re looking for with our advanced filters and search.
            </p>
          </div>
          
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Quality Guaranteed
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              Every phone is tested and verified for quality and authenticity.
            </p>
          </div>
          
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <div className="text-4xl mb-4">💰</div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Best Prices
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              Get the best deals on used phones with our competitive pricing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}