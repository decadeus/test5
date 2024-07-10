'use client'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'

export default function MyPage() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/map'),
    { 
      loading: () => <p>A map is loading...</p>,
      ssr: false
    }
  ), [])

  return (
    <div>
      <Map position={[51.505, -0.09]} zoom={13} />
    </div>
  )
}
