"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Skip to main content link for keyboard navigation
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      Pular para o conteúdo principal
    </a>
  )
}

// Announce route changes to screen readers
export function RouteAnnouncer() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      // Announce page changes to screen readers
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = "Página carregada"
      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [router])

  return null
}
