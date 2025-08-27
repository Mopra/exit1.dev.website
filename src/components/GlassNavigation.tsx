"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import GlassSurface from './GlassSurface'
import { Home, Monitor, Shield, BarChart3, Bell, Globe, Settings } from 'lucide-react'

const glassNavItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Monitoring", href: "/real-time-monitoring", icon: Monitor },
  { name: "SSL", href: "/ssl-monitoring", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Alerts", href: "/alerting", icon: Bell },
  { name: "Global", href: "/global-monitoring", icon: Globe },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function GlassNavigation() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="fixed top-24 left-4 right-4 z-40 max-w-[1800px] mx-auto">
        <div className="w-full h-[60px] bg-background/80 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-lg">
          <nav className="flex items-center justify-center space-x-1 px-4 w-full h-full">
            {glassNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 rounded-xl hover:bg-white/10 hover:text-primary transition-all duration-200 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-24 left-4 right-4 z-40 max-w-[1800px] mx-auto">
      {/* Background content for glass effect */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-[60px] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl"></div>
        <div className="absolute top-2 left-2 w-20 h-20 bg-primary/30 rounded-full blur-lg"></div>
        <div className="absolute bottom-2 right-2 w-16 h-16 bg-secondary/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-primary/20 rounded-full blur-md"></div>
      </div>
      
      <GlassSurface
        width="100%"
        height={60}
        borderRadius={16}
        brightness={60}
        opacity={0.8}
        blur={8}
        displace={2}
        backgroundOpacity={0.1}
        saturation={1.2}
        distortionScale={-120}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        mixBlendMode="screen"
        className="cursor-pointer"
      >
        <nav className="flex items-center justify-center space-x-1 px-4 w-full">
          {glassNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className="h-10 px-3 rounded-xl hover:bg-white/10 hover:text-primary transition-all duration-200 text-sm font-medium flex items-center gap-2 cursor-pointer"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              </Button>
            )
          })}
        </nav>
      </GlassSurface>
    </div>
  )
}
