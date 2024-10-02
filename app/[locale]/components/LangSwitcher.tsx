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
   
  ]

  return (
    <div className='flex items-center justify-center z-50'>
      <div className='relative'>
        <Button
          className='text-destructive inline-flex w-full items-center justify-between gap-3 rounded-full'
          size='small'
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => setIsOptionsExpanded(false)}
        >
        
          <FiGlobe color='blue' size={20} />
        </Button>
        {isOptionsExpanded && (
  <div className='absolute right-0 mt-2 w-full origin-top-right rounded-md bg-green-300 shadow-lg z-50 '>
    <div
      className='py-1'
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
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                pathname === `/${lang.code}`
                  ? 'bg-green-200 text-primary hover:bg-gray-200'
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