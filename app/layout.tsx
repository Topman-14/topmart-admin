import type { Metadata } from "next";
import { syne, montserrat, comfortaa } from "./fonts";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-providers";

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
          <body className={montserrat.className}>
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
