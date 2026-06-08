"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import GlassSurface from '@/components/GlassSurface'

import { Menu, X, ChevronRight, ArrowRight, Github, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GITHUB_REPO_URL, formatStarCount } from '@/lib/github'

const DISCORD_INVITE_URL = 'https://discord.gg/uZvWbpwJZS'

// Discord's brand glyph — lucide dropped brand icons, so we inline the official mark.
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  )
}

// GitHub star pill — live count is real social proof and nudges a star.
function GitHubStars({ stars, className }: { stars: number | null; className?: string }) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={stars != null ? `Star exit1.dev on GitHub — ${stars} stars` : 'Star exit1.dev on GitHub'}
      className={cn(
        'group inline-flex h-8 items-center gap-1.5 rounded-full border border-white/12 px-2.5 text-white/85 hover:border-white/25 hover:bg-white/5 hover:text-white transition-all duration-200 interactive',
        className
      )}
    >
      <Github className="h-4 w-4" />
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
      {stars != null && (
        <span className="text-xs font-semibold tabular-nums">{formatStarCount(stars)}</span>
      )}
    </a>
  )
}

// Discord community link.
function DiscordLink({ className }: { className?: string }) {
  return (
    <a
      href={DISCORD_INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the exit1.dev Discord community"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/85 hover:border-white/25 hover:bg-white/5 hover:text-brand-discord transition-all duration-200 interactive',
        className
      )}
    >
      <DiscordIcon className="h-4 w-4" />
    </a>
  )
}

const navigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "Why upgrade?", href: "/why-upgrade" },
  { name: "Getting Started", href: "/getting-started" },
  { name: "Docs", href: "https://docs.exit1.dev", external: true }
]

const toolsMenu = {
  name: "Tools",
  items: [
    { name: "SSL Checker", href: "/tools/ssl-checker", description: "Check any site's SSL certificate" },
    { name: "Domain Checker", href: "/tools/domain-expiration-checker", description: "Check any domain's expiry date" },
    { name: "DNS Checker", href: "/tools/dns-checker", description: "Look up all DNS records for any domain" },
    { name: "API Status Checker", href: "/tools/api-status-checker", description: "Check any API endpoint's status & headers" },
    { name: "Ping Test", href: "/tools/ping-test", description: "Test latency to any host" },
    { name: "Redirect Checker", href: "/tools/redirect-checker", description: "Trace HTTP redirect chains for any URL" },
    { name: "Uptime Checker", href: "/tools/uptime-checker", description: "Check if any website is online and healthy" },
    { name: "Live Status", href: "/status", description: "Real-time uptime of popular sites & APIs" },
  ]
}

const companyMenu = {
  name: "Company",
  items: [
    { name: "Blog", href: "/blog", description: "Updates, guides, and insights" },
    { name: "About", href: "/about", description: "Our mission and team" },
    { name: "Community", href: "https://discord.com/invite/uZvWbpwJZS", description: "Join our Discord", external: true }
  ]
}

const featuresMenu = {
  name: "Features",
  sections: [
    {
      title: "Monitoring",
      items: [
        { name: "Uptime Monitoring", href: "/free-uptime-monitor", description: "HTTP, HTTPS, and endpoint checks" },
        { name: "Live Checks", href: "/live-checks", description: "Streamed probes with sub-second charts" },
        { name: "Global Monitoring", href: "/global-monitoring", description: "Worldwide coverage and geo performance" },
        { name: "Domain Intelligence", href: "/domain-intelligence", description: "Automatic domain expiration alerts" },
        { name: "Smart Alerting", href: "/alerting", description: "Webhooks and real-time notifications" },
      ]
    },
    {
      title: "Protocols",
      items: [
        { name: "SSL Monitoring", href: "/ssl-monitoring", description: "Certificate expiration tracking" },
        { name: "ICMP Monitoring", href: "/icmp-monitoring", description: "Ping-based host availability and latency" },
        { name: "WebSocket Monitoring", href: "/websocket-monitoring", description: "WS/WSS handshake and connection checks" },
      ]
    },
    {
      title: "Platform",
      items: [
        { name: "Status Pages", href: "/status-pages", description: "Public status pages for customers" },
        { name: "Analytics & Reports", href: "/analytics", description: "Statistics dashboard and insights" },
        { name: "Logs", href: "/logs", description: "Unlimited retention with search" },
        { name: "API & Webhooks", href: "/api-webhooks", description: "Integrations for automation" },
        { name: "MCP Integration", href: "/mcp", description: "Query monitors from AI assistants" },
        { name: "Status Badges", href: "/badges", description: "Embeddable status, uptime & response badges" },
      ]
    }
  ],
  footerLink: { name: "View all features", href: "/features" }
}

export default function Header({ githubStars }: { githubStars: number | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header 
      className="fixed top-4 left-4 right-4 z-50 transition-all duration-500"
      role="banner"
    >
      <div
        className={cn(
          "rounded-2xl transition-shadow duration-500 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]",
          isScrolled && "shadow-[0_18px_60px_-12px_rgba(0,0,0,0.75)]"
        )}
      >
        <GlassSurface
          width="100%"
          height={56}
          borderRadius={16}
          brightness={60}
          opacity={0.8}
          blur={8}
          displace={2}
          backgroundOpacity={0.94}
          saturation={1.2}
          distortionScale={-120}
          redOffset={5}
          greenOffset={15}
          blueOffset={25}
          mixBlendMode="screen"
          surfaceTint="oklch(0.155 0.014 285)"
          className="cursor-pointer"
          allowOverflow={true}
      >
        <div className="flex items-center h-14 px-4 sm:px-6 w-full">
          {/* Logo - Left */}
          <Link 
            href="/" 
            className="flex items-center text-white hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg interactive"
            aria-label="Go to homepage"
          >
            <Image 
              src="/e_.svg" 
              alt="Exit1.dev logo" 
              width={24}
              height={24}
              className="h-6 w-6 mr-2"
            />
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
                  className="text-sm font-medium text-white rounded-full hover:bg-background/90 hover:text-primary transition-all duration-200 interactive"
                  asChild
                >
                  {'external' in item && item.external ? (
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

              {/* Dropdown Menus — single NavigationMenu root for instant transitions */}
              <NavigationMenu delayDuration={0} viewport={false}>
                <NavigationMenuList className="gap-0">
                  {/* Features Mega Menu */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className="text-sm font-medium text-white rounded-full cursor-pointer bg-transparent hover:bg-background/90 data-[state=open]:bg-background/90 hover:text-primary data-[state=open]:text-primary"
                      aria-label={`Open ${featuresMenu.name} menu`}
                    >
                      {featuresMenu.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-1/2 -translate-x-1/2 border border-white/10 bg-[#0F0F15] text-white shadow-2xl rounded-xl">
                      <div className="grid grid-cols-3 gap-6 p-6 w-[calc(100vw-3rem)] max-w-[680px]">
                        {featuresMenu.sections.map((section) => (
                          <div key={section.title}>
                            <div className="text-xs font-semibold text-white/55 uppercase tracking-wide mb-3 px-3">
                              {section.title}
                            </div>
                            <div className="space-y-1">
                              {section.items.map((item) => (
                                <NavigationMenuLink key={item.href} asChild>
                                  <Link
                                    href={item.href}
                                    className="block p-3 rounded-xl text-left hover:bg-white/8 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 interactive"
                                    aria-label={`Learn more about ${item.name}`}
                                  >
                                    <div className="font-medium text-white text-sm">{item.name}</div>
                                    <div className="text-xs text-white/65 mt-0.5">{item.description}</div>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 px-6 py-3">
                        <Link
                          href={featuresMenu.footerLink.href}
                          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-primary transition-colors interactive"
                        >
                          {featuresMenu.footerLink.name}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Tools Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className="text-sm font-medium text-white rounded-full cursor-pointer bg-transparent hover:bg-background/90 data-[state=open]:bg-background/90 hover:text-primary data-[state=open]:text-primary"
                      aria-label={`Open ${toolsMenu.name} menu`}
                    >
                      {toolsMenu.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-1/2 -translate-x-1/2 border border-white/10 bg-[#0F0F15] text-white shadow-2xl rounded-xl">
                      <div className="w-64 p-3">
                        {toolsMenu.items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="block p-3 rounded-xl text-left hover:bg-white/8 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 interactive"
                              aria-label={item.name}
                            >
                              <div className="font-medium text-white text-sm">{item.name}</div>
                              <div className="text-xs text-white/65 mt-0.5">{item.description}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Company Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className="text-sm font-medium text-white rounded-full cursor-pointer bg-transparent hover:bg-background/90 data-[state=open]:bg-background/90 hover:text-primary data-[state=open]:text-primary"
                      aria-label={`Open ${companyMenu.name} menu`}
                    >
                      {companyMenu.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-1/2 -translate-x-1/2 border border-white/10 bg-[#0F0F15] text-white shadow-2xl rounded-xl">
                      <div className="w-64 p-3">
                        {companyMenu.items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-xl text-left hover:bg-white/8 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 interactive"
                                aria-label={item.name}
                              >
                                <div className="font-medium text-white text-sm">{item.name}</div>
                                <div className="text-xs text-white/65 mt-0.5">{item.description}</div>
                              </a>
                            ) : (
                              <Link
                                href={item.href}
                                className="block p-3 rounded-xl text-left hover:bg-white/8 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 interactive"
                                aria-label={item.name}
                              >
                                <div className="font-medium text-white text-sm">{item.name}</div>
                                <div className="text-xs text-white/65 mt-0.5">{item.description}</div>
                              </Link>
                            )}
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
            <GitHubStars stars={githubStars} />
            <DiscordLink />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-primary/10 hover:text-primary transition-all duration-200 interactive"
              asChild
            >
              <a href="https://app.exit1.dev" target="_blank" rel="noopener noreferrer">
                Sign In
              </a>
            </Button>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/90 hover:scale-105 transition-all duration-200 interactive"
              asChild
            >
              <a href="https://app.exit1.dev/" target="_blank" rel="noopener noreferrer">
                Start Free
              </a>
            </Button>
          </div>

          {/* Mobile: social + menu button - Right aligned */}
          <div className="flex xl:hidden items-center gap-1.5 ml-auto">
            <GitHubStars stars={githubStars} />
            <DiscordLink />
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-white rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 interactive"
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
        </div>
      </GlassSurface>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="xl:hidden" role="dialog" aria-label="Mobile navigation menu">
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">
            <div>
              <div className="p-4 space-y-4">
                {/* CTA Buttons - Mobile Top */}
                <div className="space-y-2 pb-4 border-b border-primary/20">
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
                    className="w-full justify-start bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/90 hover:scale-105 transition-all duration-200 interactive" 
                    asChild
                  >
                    <a href="https://app.exit1.dev/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                      Start Free
                    </a>
                  </Button>
                </div>

                {/* Main Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    'external' in item && item.external ? (
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

                {/* Features Menu */}
                {featuresMenu.sections.map((section) => (
                  <div key={section.title} className="border-t border-primary/20 pt-4">
                    <div className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {section.title}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
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
                ))}
                {/* View all features - mobile */}
                <div className="border-t border-primary/20 pt-3">
                  <Link
                    href={featuresMenu.footerLink.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors interactive"
                    onClick={closeMobileMenu}
                  >
                    {featuresMenu.footerLink.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Tools Menu */}
                <div className="border-t border-primary/20 pt-4">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {toolsMenu.name}
                  </div>
                  <div className="space-y-1">
                    {toolsMenu.items.map((item) => (
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

                {/* Company Menu */}
                <div className="border-t border-primary/20 pt-4">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {companyMenu.name}
                  </div>
                  <div className="space-y-1">
                    {companyMenu.items.map((item) => (
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>
                      ) : (
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
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
