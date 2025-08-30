"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { validateDomain } from '@/lib/domainUtils'

// Lazy load the heavy Prism component
const Prism = dynamic(() => import('./Prism'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20" />
  )
})

export default function Hero() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWebsiteUrl(value)
    
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
    
    // Validate on input change if there's content
    if (value.trim()) {
      const validation = validateDomain(value)
      if (!validation.isValid) {
        setError(validation.error || '')
      }
    }
  }

  const handleStartMonitoring = (e: React.FormEvent) => {
    e.preventDefault()
    if (!websiteUrl.trim()) return

    const validation = validateDomain(websiteUrl)
    if (!validation.isValid) {
      setError(validation.error || '')
      return
    }

    setIsLoading(true)
    
    // Clean the URL (add https if missing)
    let cleanUrl = websiteUrl.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    // Redirect to your Firebase app with the website URL as parameter
    const monitoringAppUrl = `https://app.exit1.dev/?website=${encodeURIComponent(cleanUrl)}`
    window.open(monitoringAppUrl, '_blank')
    
    setIsLoading(false)
  }

  const isFormValid = websiteUrl.trim() && !error

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16 min-h-[60vh] flex items-center"
      aria-labelledby="hero-heading"
    >
      {/* Prism Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Prism
          animationType="rotate"
          timeScale={0.2}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={0.5}
          suspendWhenOffscreen={true}
        />
        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            id="hero-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-tight text-white drop-shadow-lg"
          >
            Free Uptime Monitoring. No Limits. No Catches.
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 sm:mb-6 max-w-3xl mx-auto font-medium leading-relaxed px-2 sm:px-4 drop-shadow-md">
            Check every site, every minute. Get alerts the second something breaks. Unlimited websites. Still free.
          </p>

          {/* Quick Start Form */}
          <form onSubmit={handleStartMonitoring} className="max-w-md mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <div className="relative flex items-center">
                  {/* HTTPS Prefix */}
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/40 text-sm font-mono pointer-events-none select-none z-10">
                    https://
                  </div>
                  {/* URL Input */}
                  <Input
                    type="text"
                    placeholder="example.com"
                    value={websiteUrl}
                    onChange={handleInputChange}
                    className={`pl-24 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-md focus:bg-white/15 transition-all duration-300 cursor-pointer ${
                      error ? 'border-red-400 focus:border-red-400' : ''
                    }`}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit"
                size="lg"
                disabled={isLoading || !isFormValid}
                className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-12 px-6 glass-primary border backdrop-blur-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Starting...' : 'Start Monitoring'}
              </Button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-300 text-sm mt-2 bg-red-900/20 border border-red-500/30 rounded-md p-2 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <p className="text-xs text-white/60 mt-2">
              Enter your website URL and we&apos;ll set up monitoring in seconds
            </p>
          </form>
          
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4"
            role="group"
            aria-label="Additional action buttons"
          >
            <Button 
              variant="outline"
              size="lg"
              className="font-semibold transition-all duration-300 w-full sm:w-auto text-sm sm:text-base backdrop-blur-md border-white/30 hover:bg-white/10 text-white cursor-pointer"
              asChild
            >
              <a href="https://discord.com/invite/uZvWbpwJZS" target="_blank" rel="noopener noreferrer" className="interactive">
                Join Discord Community
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
