import React from 'react'
import { clsx } from 'clsx'
import {
  ArrowRight,
  CheckCircle,
  Layers,
  Palette,
  Search,
  User,
  Menu,
  ChevronDown,
  Bell,
  Loader2,
  ChevronRight,
  AlertCircle,
  Info,
  Grid,
  Settings,
} from 'lucide-react'

/**
 * A central collection of icons used throughout the application.  Icons
 * are imported from lucide-react, which provides lightweight SVG icons
 * that tree‐shake well.  To add a new icon, import it above and add
 * it to the Icons object below.
 */
/**
 * A central collection of icons used throughout the application. Icons are
 * imported from lucide-react, which provides lightweight SVG icons that
 * tree‑shake well. To add a new icon, import it above and add it to the
 * Icons object below. The key of each entry becomes the `name` used in
 * IconProps.
 */
export const Icons = {
  arrowRight: ArrowRight,
  checkCircle: CheckCircle,
  layers: Layers,
  palette: Palette,
  search: Search,
  user: User,
  menu: Menu,
  chevronDown: ChevronDown,
  bell: Bell,
  spinner: Loader2,
  chevronRight: ChevronRight,
  alertCircle: AlertCircle,
  info: Info,
  grid: Grid,
  settings: Settings,
} as const

export type IconName = keyof typeof Icons

export interface IconProps {
  /**
   * The name of the icon as defined in the Icons map. If a name that
   * does not exist in the map is provided, the CheckCircle icon will be
   * rendered as a fallback.
   */
  name: IconName
  /**
   * The size of the icon in pixels (defaults to 24). This value is
   * forwarded to the underlying lucide-react component.
   */
  size?: number
  /**
   * Additional CSS classes to apply to the SVG element. Useful for
   * customizing colour or adding layout classes.
   */
  className?: string
  /**
   * Optional stroke width to apply to the icon. The lucide icons default
   * to a stroke width of 1.5; use this prop to override if needed.
   */
  strokeWidth?: number
  /**
   * Whether the icon is purely decorative. When `true`, the icon is
   * hidden from assistive technologies via `aria-hidden`. When `false`, an
   * accessible label must be provided via the `title` prop.
   */
  decorative?: boolean
  /**
   * Accessible title for the icon. Only used when `decorative` is
   * `false`. Provide a short description of what the icon represents.
   */
  title?: string
}

/**
 * Renders an SVG icon from the Icons collection. Icons are rendered with
 * consistent sizing and optional stroke width. The `decorative` prop
 * controls whether the icon is exposed to assistive technologies. When
 * passing `decorative={false}`, you should supply a `title` for screen
 * readers. Unknown names fall back to the CheckCircle icon.
 */
export default function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.75,
  decorative = true,
  title,
}: IconProps) {
  const Component = Icons[name] ?? CheckCircle
  const ariaProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': title ?? name }
  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={clsx('ui-icon', className)}
      {...ariaProps}
    />
  )
}