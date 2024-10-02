import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  className,
  ...props
}) => {
  const sizeStyles = {
    small: 'px-2 py-2 text-sm',
    medium: 'px-4 py-2 text-base font-semibold',
    large: 'px-6 py-3 text-lg font-semibold'
  }

  const baseStyles = `bg-red-300 rounded focus:outline-none focus:shadow-outline ${rounded ? 'rounded-full' : ''}`
  const variantStyles = {
    primary: 'bg-button text-button-text',
    secondary: 'bg-button-secondary text-secondary ring-secondary ring-2'
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  )
}

export default Button
