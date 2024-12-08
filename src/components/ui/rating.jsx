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
          "p-0.5 hover:scale-110 transition-transform bg-transparent hover:bg-transparent",
          "border-none shadow-none focus:outline-none focus:ring-0",
          !readonly && "cursor-pointer"
        )}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            filled ? "fill-foreground text-foreground" : halfFilled ? "fill-foreground/50 text-foreground/50" : "text-muted-foreground/25",
            !readonly && !filled && "hover:fill-foreground/25 hover:text-foreground/25",
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
