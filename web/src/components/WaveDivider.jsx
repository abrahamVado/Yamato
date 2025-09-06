export default function WaveDivider({ flip=false, className="", style }) {
  return (
    <div className={`wave ${flip ? "wave--flipY": ""} ${className}`} style={style}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,24 C240,88 480,96 720,64 C960,32 1200,24 1440,56 L1440,120 L0,120 Z" fill="currentColor" opacity="0.12"/>
        <path d="M0,56 C240,120 480,80 720,64 C960,48 1200,80 1440,96 L1440,120 L0,120 Z" fill="currentColor" opacity="0.2"/>
        <path d="M0,88 C240,96 480,64 720,72 C960,80 1200,112 1440,104 L1440,120 L0,120 Z" fill="currentColor"/>
      </svg>
    </div>
  );
}
