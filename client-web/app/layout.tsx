import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { AppWrapper } from '@/providers/app-wrapper';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/providers/theme-providers';


export const metadata: Metadata = {
  title: {
    template: '%s · Your Project',
    default: 'Get started now',
  },
  description: 'Your Project Description',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className="max-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-center" richColors />
        <AppWrapper>
          {children}

        </AppWrapper>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;