import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:from-purple-700 hover:to-blue-700",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:from-red-700 hover:to-red-800",
        outline:
          "border-2 border-purple-300 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-purple-50 hover:border-purple-500 hover:shadow-xl hover:scale-105 active:scale-95",
        secondary:
          "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:from-gray-300 hover:to-gray-400",
        ghost:
          "hover:bg-purple-100 hover:text-purple-900 hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-800",
        gradient:
          "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:shadow-purple-500/25",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-13 rounded-xl px-8 has-[>svg]:px-7 text-base font-semibold",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
