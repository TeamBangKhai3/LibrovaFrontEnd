import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Rating = React.forwardRef(function Rating(props, ref) {
  const { 
    value = 0,
    count = 5,
    readonly = false,
    className,
    ...rest 
  } = props

  const hearts = Array.from({ length: count }).map((_, index) => {
    const filled = index + 1 <= value
    const halfFilled = !filled && index + 0.5 <= value

    return (
      <Heart
        key={index}
        className={cn(
          "w-5 h-5 transition-colors",
          filled ? "fill-red-500 text-red-500" : halfFilled ? "fill-red-500/50 text-red-500" : "text-gray-300",
          className
        )}
      />
    )
  })

  return (
    <div ref={ref} className="flex gap-0.5" {...rest}>
      {hearts}
    </div>
  )
})
