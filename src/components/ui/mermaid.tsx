'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
  className?: string
}

export function Mermaid({ chart, className }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    if (elementRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      })
      
      mermaid.render(renderId, chart).then(({ svg }) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = svg
        }
      })
    }
  }, [chart, renderId])

  return <div ref={elementRef} className={className} />
} 