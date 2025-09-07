export default function WaveDivider({
  flip = false,
  className = "",
  style,
  height = 200,
  color = "currentColor",
  fade = true,   // soft fade at the bottom edge
  blur = 0,      // px blur on the whole wave
}) {
  return (
    <div
      className={`wave ${flip ? "wave--flipY" : ""} ${className}`}
      style={{
        lineHeight: 0,
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        aria-hidden
        style={{
          display: "block",
          width: "100%",
          height,
          WebkitMaskImage: fade
            ? "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.75) 60%, rgba(0,0,0,0))"
            : undefined,
          maskImage: fade
            ? "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.75) 60%, rgba(0,0,0,0))"
            : undefined,
        }}
      >
        <path d="M0,48 C240,176 480,192 720,128 C960,64 1200,48 1440,112 L1440,240 L0,240 Z" fill={color} opacity="0.12"/>
        <path d="M0,112 C240,240 480,160 720,128 C960,96 1200,160 1440,192 L1440,240 L0,240 Z" fill={color} opacity="0.20"/>
        <path d="M0,176 C240,192 480,128 720,144 C960,160 1200,224 1440,208 L1440,240 L0,240 Z" fill={color}/>
      </svg>
    </div>
  );
}
