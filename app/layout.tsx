import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FleteAgro - Plataforma de Logística Agrícola',
  description: 'Conectamos transportistas con productores agrícolas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
