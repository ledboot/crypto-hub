import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { MainNav } from "@/components/main-nav";
const geistSans = Geist({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Crypto Hub",
  description: "A hub for all your crypto needs",
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
      <body className={geistSans.className}>
        <MainNav />
      <div className="container mx-auto py-20 mt-10">
        {children}
      </div>
      </body>
    </html>
  );
}
