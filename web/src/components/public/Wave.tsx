type WaveProps = {
  height?: number
  colors?: string[]
  className?: string
}

export default function ElaborateWave({ height = 300, colors = [], className = '' }: WaveProps) {
  const fill = (index: number) => colors[index] || colors[colors.length - 1] || '#000'

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deepest layer */}
        <path
          fill={fill(0)}
          fillOpacity="1"
          d="M0,220 C200,150 400,250 600,200 C800,150 1000,260 1200,180 C1300,160 1400,190 1440,180 L1440,320 L0,320 Z"
        />
        {/* Layer 2 */}
        <path
          fill={fill(1)}
          fillOpacity="0.8"
          d="M0,240 C180,160 390,270 620,190 C820,120 1040,240 1240,160 C1350,130 1440,160 1440,160 L1440,320 L0,320 Z"
        />
        {/* Layer 3 */}
        <path
          fill={fill(2)}
          fillOpacity="0.6"
          d="M0,260 C160,170 360,290 640,180 C880,100 1100,210 1320,150 C1380,130 1440,150 1440,150 L1440,320 L0,320 Z"
        />
        {/* Layer 4 */}
        <path
          fill={fill(3)}
          fillOpacity="0.5"
          d="M0,280 C140,180 380,280 660,160 C900,80 1160,200 1360,130 C1400,120 1440,140 1440,140 L1440,320 L0,320 Z"
        />
        {/* Front mist layer */}
        <path
          fill={fill(4)}
          fillOpacity="0.35"
          d="M0,300 C120,200 420,270 700,150 C960,60 1200,180 1440,120 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  )
}
