import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {Providers} from "./providers";
import MainNavBar from "@/app/navbar/mainNavBar"
import { createClient } from '@/utils/supabase/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Hoomge",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: "@/components/Icon2.png",
  },
};

export default async function RootLayout({
  children,
}) {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <html lang="en" className={GeistSans.className}>
      <body className=" text-foreground">
      <Providers>
        <MainNavBar user={user}/>
        <main className="min-h-screen flex flex-col items-center text-black">
        
          {children}
        </main>
        <div className="flex w-full bg-slate-500 mt-16 h-16 justify-center items-center">FOOTER</div>
        </Providers>
      </body>
    </html>
  );
}