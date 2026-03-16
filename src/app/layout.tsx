
import type { Metadata } from "next";
import { AppHeader } from "@/components/app/header";
import { AppFooter } from "@/components/app/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clothiva",
  description: "Modern and elegant clothing store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>
            <FirebaseClientProvider>
              <AuthProvider>
                <CartProvider>
                  <div className="flex min-h-screen flex-col">
                    <AppHeader />
                    <main className="flex-1">{children}</main>
                    <AppFooter />
                  </div>
                  <Toaster />
                </CartProvider>
              </AuthProvider>
            </FirebaseClientProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
