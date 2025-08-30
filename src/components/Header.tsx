"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import GlassSurface from '@/components/GlassSurface'

import { Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: "Getting Started", href: "/getting-started" },
  { name: "Blog", href: "/blog" },
  { name: "Community", href: "https://discord.com/invite/uZvWbpwJZS", external: true }
]

const productMenu = {
  name: "Product",
  items: [
    { name: "Real-Time Monitoring", href: "/real-time-monitoring", description: "Free uptime monitor for unlimited websites and APIs with real-time status updates" },
    { name: "SSL Monitoring", href: "/ssl-monitoring", description: "Free SSL certificate uptime monitoring with expiration tracking" },
    { name: "Analytics & Reports", href: "/analytics", description: "Comprehensive statistics dashboard and performance insights" },
    { name: "Smart Alerting", href: "/alerting", description: "Webhook integration and real-time notifications" },
    { name: "Global Monitoring", href: "/global-monitoring", description: "Worldwide coverage with geographic performance analysis" },
    { name: "Data Privacy", href: "/data-privacy", description: "GDPR compliant monitoring with zero data retention policies" },
    { name: "Comprehensive Logs", href: "/logs", description: "Unlimited log retention with advanced search and export capabilities" },
    { name: "API & Webhooks", href: "/api-webhooks", description: "Powerful API and webhook integrations for automation" }
  ]
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header 
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-500",
        isScrolled && "shadow-xl"
      )}
      role="banner"
    >
      <GlassSurface
        width="100%"
        height={56}
        borderRadius={16}
        brightness={60}
        opacity={0.8}
        blur={8}
        displace={2}
        backgroundOpacity={0.2}
        saturation={1.2}
        distortionScale={-120}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        mixBlendMode="screen"
        className="cursor-pointer"
        allowOverflow={true}
      >
        <div className="flex items-center h-14 px-4 sm:px-6 w-full">
          {/* Logo - Left */}
          <Link 
            href="/" 
            className="flex items-center text-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg interactive"
            aria-label="Go to homepage"
          >
            <span className="font-mono font-semibold text-base sm:text-lg tracking-tight">exit1.dev</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden xl:flex flex-1 justify-center">
            <nav 
              className="flex items-center space-x-6"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium rounded-full hover:bg-black/90 hover:text-primary transition-all duration-200 interactive"
                  asChild
                >
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  ) : (
                    <Link href={item.href}>
                      {item.name}
                    </Link>
                  )}
                </Button>
              ))}

              {/* Product Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className="text-sm font-medium rounded-full bg-primary/20 cursor-pointer hover:bg-black/90 data-[state=open]:bg-black/90 hover:text-primary data-[state=open]:text-primary"
                      aria-label={`Open ${productMenu.name} menu`}
                    >
                      {productMenu.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-80 p-4 space-y-2 backdrop-blur-xl rounded-xl">
                        {productMenu.items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="block p-3 rounded-xl text-left hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 interactive"
                              aria-label={`Learn more about ${item.name}`}
                            >
                              <div className="font-medium text-foreground mb-1">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* CTA Buttons - Right */}
          <div className="hidden xl:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-primary/10 hover:text-primary transition-all duration-200 interactive"
              asChild
            >
              <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                Sign In
              </a>
            </Button>
            <Button 
              size="sm" 
              className="glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-200 interactive"
              asChild
            >
              <a href="https://app.exit1.dev/" target="_blank" rel="noopener noreferrer">
                Start Free
              </a>
            </Button>
          </div>

          {/* Mobile menu button - Right aligned */}
          <Button
            variant="ghost"
            size="sm"
            className="xl:hidden p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 interactive ml-auto"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </GlassSurface>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="xl:hidden" role="dialog" aria-label="Mobile navigation menu">
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-xl max-h-[calc(100vh-120px)] overflow-hidden">
            <div className="overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
              <div className="p-4 space-y-4">
                {/* Main Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg interactive"
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg interactive"
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>

                {/* Product Menu */}
                <div className="border-t border-primary/20 pt-4">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {productMenu.name}
                  </div>
                  <div className="space-y-1">
                    {productMenu.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg group interactive"
                        onClick={closeMobileMenu}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="border-t border-primary/20 pt-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-200 interactive" 
                    asChild
                  >
                    <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                      Sign In
                    </a>
                  </Button>
                  <Button 
                    className="w-full justify-start glass-primary border backdrop-blur-md hover:scale-105 transition-all duration-200 interactive" 
                    asChild
                  >
                    <a href="https://app.exit1.dev/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                      Start Free
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
