"use client"// app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider} from "react-use-cart";
import theme from "./_components/theme";
import Script from "next/script";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@mui/material";
import { WalletProvider } from "./_components/WalletContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react"
import { UserProvider } from "../../utils/UserContext"; // Import the correct provider

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
          <link rel="icon" type="image/png" href="/images/Cart-Logo1.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-VF1MGSRXYC" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VF1MGSRXYC');
          `}
        </Script>
        <title>Cardano Cart</title>
        </head>
        

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SpeedInsights />
      <Analytics/>
          <ThemeProvider theme={theme}>
            <WalletProvider>
            <UserProvider>
              <CartProvider>
              <GoogleTagManager gtmId="GTM-TQF3S6NK" />
                {children}
                
              </CartProvider>
            </UserProvider>
            </WalletProvider>
          </ThemeProvider>
      
      </body>
    </html>
  );
}