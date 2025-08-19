import { classNames } from '../../functions'

interface DotsProps {
  children?: any
  className?: string
}

export default function Dots({ children = <span />, className }: DotsProps) {
  return (
    <span
      // The dots are now created using pseudo-elements directly with Tailwind classes.
      // The content will be '.', '..', '...' through animation.
      className={classNames(
        "after:content-['.'] after:inline-block after:animate-ellipsis after:w-4 after:text-left",
        className
      )}
    >
      {children}
    </span>
  )
}
