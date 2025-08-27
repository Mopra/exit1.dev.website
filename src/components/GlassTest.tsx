"use client"

import { useEffect, useState } from 'react'
import GlassSurface from './GlassSurface'

export default function GlassTest() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="fixed top-32 left-4 right-4 z-30 max-w-[1800px] mx-auto">
      {/* Background content */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-[200px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-2xl"></div>
        <div className="absolute top-4 left-4 w-32 h-32 bg-red-500/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-blue-500/40 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-green-500/40 rounded-full blur-xl"></div>
      </div>
      
      <GlassSurface
        width={300}
        height={200}
        borderRadius={24}
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
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Glass Surface Test</h2>
          <p className="text-sm text-muted-foreground">Advanced glass effect with distortion</p>
        </div>
      </GlassSurface>
    </div>
  )
}
