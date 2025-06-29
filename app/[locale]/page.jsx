"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import Loading from "./loading";
import SubscribeButton from "@/app/[locale]/components/SubscribeButton";
import ApartmentList from "./DesignTest/List/page";

// Import des composants
import IntroSection from "@/app/[locale]/components/home/IntroSection";
import SEO from "@/app/[locale]/components/home/SEO";
import ProjetSection from "@/app/[locale]/components/home/ProjetSection";
import ManageSection from "@/app/[locale]/components/home/ManageSection";
import Magic from "@/app/[locale]/components/home/Magic";
import FAQ from "@/app/[locale]/components/home/FAQ";

export default function Page() {
  return <ApartmentList />;
}
