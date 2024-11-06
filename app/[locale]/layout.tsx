import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/app/providers";
import MainNavBar from "./navbar/mainNavBar";
import { createClient } from "@/utils/supabase/server";
import Head from "next/head";
import Foot from "../footer/footer";
import { Kenia, Satisfy, Macondo } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Load Kenia font with specified options
const kenia = Kenia({
  subsets: ["latin"],
  variable: "--font-kenia",
  weight: "400"
});

const satisfy = Satisfy({
  subsets: ["latin"],
  variable: "--font-satisfy",
  weight: "400"
});

const macondo= Macondo({
  subsets: ["latin"],
  variable: "--font-macondo",
  weight: "400"
});


 
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const supabase = createClient();

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  return (
    <html lang={locale}>
      <Head>
        <link rel="icon" href="/favicon.png" /> {/* Ajout de la favicon */}
        <title>Mon Application</title>
      </Head>
      <body>
        <NextIntlClientProvider messages={messages}>
        <Providers>
          {/* Wrap your application in the LanguageProvider */}
            <MainNavBar user={user} />
            <main className="min-h-screen w-full flex flex-col items-center text-black ">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Foot />
          
        </Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-ML122J0N9C" />
    </html>
  );
}