import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
const geistSans = Geist({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});


export const metadata: Metadata = {
  title: "CryptoHubs",
  description: "A hub for all your crypto needs",
  keywords: ["crypto tools", "crypto hubs","blockchain", "wallet", "crypto exchange", "crypto news", "crypto market", "analysis", "trading"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3198470578962995"/>
      </head>
      <body className={`${geistSans.className} flex flex-col min-h-screen`}>
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
