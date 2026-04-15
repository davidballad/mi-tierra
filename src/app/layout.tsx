/**
 * Root layout — loads fonts, provides auth context, and mounts the auth flow manager.
 */

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthFlowProvider } from "@/contexts/AuthFlowContext";
import { CartProvider } from "@/contexts/CartContext";
import AuthFlowManager from "@/components/auth/AuthFlowManager";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mi Tierra | Mercado Artesanal Ecuatoriano",
  description:
    "Descubre y compra artesanías auténticas de los mejores artesanos del Ecuador. Textiles, cerámica, joyería en plata, y mucho más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <AuthFlowProvider>
          <CartProvider>
            {children}
            <AuthFlowManager />
          </CartProvider>
        </AuthFlowProvider>
      </body>
    </html>
  );
}
