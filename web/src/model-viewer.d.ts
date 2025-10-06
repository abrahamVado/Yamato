import type React from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        ar?: boolean
        autoplay?: boolean
        "auto-rotate"?: boolean
        "camera-controls"?: boolean
        style?: React.CSSProperties
      }
    }
  }
}

export {}
