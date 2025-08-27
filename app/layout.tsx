import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "E-commerce Platform",
  description: "Modern Brazilian e-commerce platform with real-time order tracking",
  generator: "v0.app",
  keywords: ["e-commerce", "loja online", "pedidos", "brasil"],
  authors: [{ name: "E-commerce Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
