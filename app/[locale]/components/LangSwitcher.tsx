'use client'
import { capitalize } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import React, { useState } from 'react'
import { FiGlobe } from 'react-icons/fi'
import Button from './Button'

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string
    code: string
  }
  const pathname = usePathname()
  const urlSegments = useSelectedLayoutSegments()

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)
  const options: Option[] = [
    { country: 'English', code: 'en' },
    { country: 'Français', code: 'fr' },
    { country: 'Polska', code: 'pl' },
    { country: 'Deutsch', code: 'de' },
   
  ]

  return (
    <div className='flex items-center justify-center '>
      <div className='relative'>
        <Button
          className='text-destructive inline-flex w-full items-center justify-between gap-3 rounded-full'
          size='small'
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => setIsOptionsExpanded(false)}
        >
        
        <div className="block lg:hidden">
      {/* Taille d'icône de 20 pour les petites tailles d'écran (non responsive) */}
      <FiGlobe color="white" size={30} />
    </div>
    
    <div className="hidden lg:block">
      {/* Taille d'icône de 30 pour les écrans plus larges (responsive) */}
      <FiGlobe color="white" size={20} />
    </div>
          <p className="text-2xl lg:text-lg">Language</p>
        </Button>
        {isOptionsExpanded && (
  <div className='absolute right-0 mt-2 w-full origin-top-right rounded-md shadow-lg z-50 '>
    <div
      className=''
      role='menu'
      aria-orientation='vertical'
      aria-labelledby='options-menu'
    >
      {options.map(lang => {
        return (
          <Link
            key={lang.code}
            href={`/${lang.code}/${urlSegments.join('/')}`}
          >
            <button
              lang={lang.code}
              onMouseDown={e => {
                e.preventDefault()
              }}
              className={`block w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-300 ${
                pathname === `/${lang.code}`
                  ? 'bg-gray-500 text-white hover:bg-gray-300 hover:text-white'
                  : 'text-secondary'
              }`}
            >
              {capitalize(lang.country)}
            </button>
          </Link>
        )
      })}
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default LangSwitcher