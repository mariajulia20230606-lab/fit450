import Image from 'next/image'
import { useState } from 'react'
import { Zap } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const [imgOk, setImgOk] = useState(true)
  const sizeClasses = {
    sm: { container: 'h-6 w-6', text: 'text-lg' },
    md: { container: 'h-8 w-8', text: 'text-xl' },
    lg: { container: 'h-12 w-12', text: 'text-2xl' }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {imgOk ? (
        <Image
          src="/zapchicken.svg"
          alt="ZapChicken"
          width={48}
          height={48}
          className={`${sizeClasses[size].container}`}
          priority
          onError={() => setImgOk(false)}
        />
      ) : (
        <Zap className={`${sizeClasses[size].container} text-orange-500`} />
      )}
      <span className={`font-bold text-gray-900 ${sizeClasses[size].text}`}>
        FIT450
      </span>
    </div>
  )
}
