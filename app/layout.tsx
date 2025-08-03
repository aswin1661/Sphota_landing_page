import './globals.css';

export const metadata = {
  title: 'Sphota',
  description: 'SPHOTA is a 24-hour offline hackathon organized by IEEE SB UCEK and IEEE SB STIST. It brings engineering students from across Kerala for a Celebration of creativity, code, and collaboration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black h-full w-screen">{children}</body>
    </html>
  )
}
