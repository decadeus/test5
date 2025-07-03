import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/app/providers";
import MainNavBar from "./navbar/mainNavBar";
import { createClient } from "@/utils/supabase/server";
import Foot from "../footer/footer";
import { Kenia, Satisfy, Macondo } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import {getTranslations} from 'next-intl/server';
import ConditionalDownloadButtons from "./components/ConditionalDownloadButtons";
import { LanguageProvider } from "@/app/LanguageContext";
import HreflangTags from "./components/HreflangTags";
import { headers } from 'next/headers';
import Chatbot from "../components/Chatbot";

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

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const f = await getTranslations("SEO");
  
  return {
    title: f("Title"),
    description: f("Description"),
    alternates: {
      canonical: `${defaultUrl}/${locale}`,
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const supabase = createClient();
  const f = await getTranslations("SEO");

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Obtenir le pathname pour les balises hreflang
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '/';
 
  return (
    <html lang={locale}>
      <head>
        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        {/* Préchargement des polices Roboto locales */}
        <link rel="preload" href="/fonts/roboto/roboto-v48-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/roboto/roboto-v48-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/roboto/roboto-v48-latin-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Balises hreflang pour le SEO multilingue */}
        <HreflangTags pathname={pathname} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
        <LanguageProvider initialLanguage={params.locale}>
          <Providers>
            <MainNavBar user={user} />
            <main className="min-h-screen w-full flex flex-col items-center text-black ">
              {children}
              <Analytics />
              <SpeedInsights />
              <Chatbot />
            </main>
            <Foot />
            <ConditionalDownloadButtons />
          </Providers>
        </LanguageProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-ML122J0N9C" />
    </html>
  );
}