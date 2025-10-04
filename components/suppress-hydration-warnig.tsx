"use client"

import { useEffect } from 'react'

export default function SuppressHydrationWarning() {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const suppressHydrationWarnings = () => {
      const elements = document.querySelectorAll('[fdprocessedid]')
      elements.forEach(element => {
        element.removeAttribute('fdprocessedid')
      })
    }

    // Run immediately and on any DOM changes
    suppressHydrationWarnings()
    
    const observer = new MutationObserver(suppressHydrationWarnings)
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['fdprocessedid']
    })

    return () => observer.disconnect()
  }, [])

  return null
}