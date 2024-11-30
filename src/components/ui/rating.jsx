import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Rating = React.forwardRef(function Rating(props, ref) {
  const { 
    value = 0,
    count = 5,
    readonly = false,
    onChange,
    className,
    ...rest 
  } = props

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  const hearts = Array.from({ length: count }).map((_, index) => {
    const rating = index + 1
    const filled = rating <= value
    const halfFilled = !filled && rating - 0.5 <= value

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(rating)}
        disabled={readonly}
        className={cn(
          "p-0.5 hover:scale-110 transition-transform",
          !readonly && "cursor-pointer"
        )}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            filled ? "fill-red-500 text-red-500" : halfFilled ? "fill-red-500/50 text-red-500" : "text-gray-300",
            !readonly && !filled && "hover:fill-red-200 hover:text-red-200",
            className
          )}
        />
      </button>
    )
  })

  return (
    <div ref={ref} className="flex gap-0.5" {...rest}>
      {hearts}
    </div>
  )
})
