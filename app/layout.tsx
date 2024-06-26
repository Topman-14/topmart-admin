import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-providers";

const comfortaa = Comfortaa({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce Admin Dashboard",
  description: "Ecommerce Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
          <body className={comfortaa.className}>
            <ThemeProvider 
                attribute="class"
                defaultTheme="system"
                enableSystem>
                  <ToastProvider />
                  <ModalProvider />
                  {children}
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
