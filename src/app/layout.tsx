import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "CryptoHubs",
  description: "A hub for all your crypto needs",
  keywords: ["crypto tools", "crypto hubs","blockchain", "wallet", "crypto exchange", "crypto news", "crypto market", "analysis", "trading"],
  openGraph: {
    title: "Crypto Hubs - The Ultimate All-in-One Crypto Toolkit",
    description: "Crypto Hubs offers a comprehensive suite of cryptocurrency tools, including batch address queries, mass token transfers, wallet analytics, on-chain data statistics, and market analysis. Supporting multiple blockchain ecosystems.",
    url: "https://cryptohub.lol",
    siteName: "Crypto Hubs",
    type: "website",
    images: [
      {
        url: "https://cryptohub.lol/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crypto Hubs - The Ultimate All-in-One Crypto Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Hubs - The Ultimate All-in-One Crypto Toolkit",
    description: "Crypto Hubs offers a comprehensive suite of cryptocurrency tools, including batch address queries, mass token transfers, wallet analytics, on-chain data statistics, and market analysis. Supporting multiple blockchain ecosystems.",
    images: [
      {
        url: "https://cryptohub.lol/og-image.png",
        width: 1200,
        height: 628,
        alt: "Crypto Hubs - The Ultimate All-in-One Crypto Toolkit",
      },
    ],
  },
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
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TQGDS2SZ');`}
        </script>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQGDS2SZ"
        height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe></noscript>
        <Toaster position="bottom-right" richColors />
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
