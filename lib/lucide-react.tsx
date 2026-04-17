import { forwardRef, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  strokeWidth?: number
}

type IconNode = Array<{
  type: 'path' | 'circle' | 'rect'
  props: Record<string, string | number>
}>

function createIcon(name: string, iconNode: IconNode) {
  return forwardRef<SVGSVGElement, IconProps>(function Icon(
    { className, size = 24, strokeWidth = 2, ...props },
    ref
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        data-icon={name}
        {...props}
      >
        {iconNode.map((node, index) => {
          if (node.type === 'path') {
            return <path key={index} {...node.props} />
          }

          if (node.type === 'circle') {
            return <circle key={index} {...node.props} />
          }

          return <rect key={index} {...node.props} />
        })}
      </svg>
    )
  })
}

export const ArrowRight = createIcon('ArrowRight', [{ type: 'path', props: { d: 'M5 12h14' } }, { type: 'path', props: { d: 'm12 5 7 7-7 7' } }])

export const ArrowDown = createIcon('ArrowDown', [
  { type: 'path', props: { d: 'M12 5v14' } },
  { type: 'path', props: { d: 'm5 12 7 7 7-7' } },
])

export const BarChart2 = createIcon('BarChart2', [
  { type: 'path', props: { d: 'M4 19.5h16' } },
  { type: 'path', props: { d: 'M7 16V10' } },
  { type: 'path', props: { d: 'M12 16V6.5' } },
  { type: 'path', props: { d: 'M17 16v-4' } },
  { type: 'path', props: { d: 'm5.5 8.5 4-3 3 2 5-3' } },
])

export const CheckCircle2 = createIcon('CheckCircle2', [
  { type: 'circle', props: { cx: 12, cy: 12, r: 9 } },
  { type: 'path', props: { d: 'm9 12 2 2 4-4' } },
])

export const Cpu = createIcon('Cpu', [
  { type: 'rect', props: { x: 7.5, y: 7.5, width: 9, height: 9, rx: 1.5 } },
  { type: 'path', props: { d: 'M12 3.5v3' } },
  { type: 'path', props: { d: 'M12 17.5v3' } },
  { type: 'path', props: { d: 'M3.5 12h3' } },
  { type: 'path', props: { d: 'M17.5 12h3' } },
  { type: 'path', props: { d: 'M6 6v0' } },
  { type: 'path', props: { d: 'M18 6v0' } },
  { type: 'path', props: { d: 'M6 18v0' } },
  { type: 'path', props: { d: 'M18 18v0' } },
])

export const Feather = createIcon('Feather', [
  { type: 'path', props: { d: 'M20.24 4.76a6.5 6.5 0 0 0-9.19 0L4 11.81V20h8.19l7.05-7.05a6.5 6.5 0 0 0 0-9.19Z' } },
  { type: 'path', props: { d: 'M16 8 2 22' } },
  { type: 'path', props: { d: 'M17.5 15H9' } },
])

export const FlaskConical = createIcon('FlaskConical', [
  { type: 'path', props: { d: 'M10 3.5h4' } },
  { type: 'path', props: { d: 'M12 3.5v6l5.4 8.3A1.5 1.5 0 0 1 16.1 20H7.9a1.5 1.5 0 0 1-1.3-2.2L12 9.5' } },
  { type: 'path', props: { d: 'M8.5 14h7' } },
])

export const MessageSquare = createIcon('MessageSquare', [
  { type: 'path', props: { d: 'M6.5 7h11A2.5 2.5 0 0 1 20 9.5v5A2.5 2.5 0 0 1 17.5 17H10l-4 3v-3H6.5A2.5 2.5 0 0 1 4 14.5v-5A2.5 2.5 0 0 1 6.5 7Z' } },
  { type: 'path', props: { d: 'M8.5 11.5h7' } },
  { type: 'path', props: { d: 'M8.5 14h4.5' } },
])

export const Settings2 = createIcon('Settings2', [
  { type: 'path', props: { d: 'M20 7h-9' } },
  { type: 'path', props: { d: 'M14 17H5' } },
  { type: 'circle', props: { cx: 8, cy: 7, r: 2 } },
  { type: 'circle', props: { cx: 17, cy: 17, r: 2 } },
  { type: 'path', props: { d: 'M8 5V3' } },
  { type: 'path', props: { d: 'M8 11V9' } },
  { type: 'path', props: { d: 'M17 15v-2' } },
  { type: 'path', props: { d: 'M17 21v-2' } },
])

export const Sparkles = createIcon('Sparkles', [
  { type: 'path', props: { d: 'M12 3l1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z' } },
  { type: 'path', props: { d: 'M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14Z' } },
  { type: 'path', props: { d: 'M19 13l.9 2.1L22 16l-2.1.9L19 19l-.9-2.1L16 16l2.1-.9L19 13Z' } },
])

export const Upload = createIcon('Upload', [
  { type: 'path', props: { d: 'M12 16V5' } },
  { type: 'path', props: { d: 'm7.5 9.5 4.5-4.5 4.5 4.5' } },
  { type: 'path', props: { d: 'M5 18.5h14' } },
])

export const X = createIcon('X', [
  { type: 'path', props: { d: 'M6 6l12 12' } },
  { type: 'path', props: { d: 'M18 6 6 18' } },
])
