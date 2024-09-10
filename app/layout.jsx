import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "./providers";
import MainNavBar from "@/app/navbar/mainNavBar";
import { createClient } from "@/utils/supabase/server";
import Head from "next/head";
import Link from "next/link";
import Foot from "@/app/footer/footer";
import "@/app/globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Under construction",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: "@/components/Icon2.png",
  },
};

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" className={GeistSans.className}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <body className=" text-foreground bg-gray-800">
        <Providers>
          <MainNavBar user={user}  />
          <main className="min-h-screen flex flex-col items-center text-black">
            {children}
            <SpeedInsights />
          </main>
          <Foot />
        </Providers>
      </body>
    </html>
  );
}
