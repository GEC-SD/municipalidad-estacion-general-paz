import type { Metadata } from 'next';
import ThemeProvider from '@/providers/ThemeProvider';
import ReduxProvider from '@/providers/ReduxProvider';
import '@/theme/global.css';

export const metadata: Metadata = {
  title: 'Municipalidad General Paz',
  description: 'Sistema de gestión municipal',
  icons: {
    icon: '/logo.webp',
    apple: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
