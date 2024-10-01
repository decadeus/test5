// RootLayout.js
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans"; // Ensure you're using this font where necessary
import "./globals.css";
import { Providers } from "./providers";
import MainNavBar from "@/app/navbar/mainNavBar";
import { createClient } from "@/utils/supabase/server";
import Head from "next/head";
import Foot from "@/app/footer/footer";
import { Kenia, Satisfy, Macondo } from "next/font/google";
import { LanguageProvider } from "@/app/LanguageContext"; // Import your LanguageProvider

// Default URL based on the environment
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

// Metadata for the application
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Under construction",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: "@/components/Icon2.png",
  },
};

// Main root layout component
export default async function RootLayout({ children }) {
  const supabase = createClient();

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${kenia.variable}`}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        {/* Additional head tags can be added here */}
      </Head>
      <body className="text-foreground bgfull w-full overflow-x-hidden">
        <Providers>
          <LanguageProvider> {/* Wrap your application in the LanguageProvider */}
            <MainNavBar user={user} />
            <main className="min-h-screen w-full flex flex-col items-center text-black ">
              {children}
              <SpeedInsights />
            </main>
            <Foot />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}