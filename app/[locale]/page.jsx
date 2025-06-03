"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import Loading from "./loading";
import BouncingShapesSection from "@/app/[locale]/components/landingPage/BouncingBackground";
import SubscribeButton from "@/app/[locale]/components/landingPage/SubscribeButton";
import Promoteur from "@/app/[locale]/components/landingPage/promoteurIcone";
import IntroSection from "@/app/[locale]/components/landingPage/IntroSection";
import ScrollProjectList from "@/app/[locale]/components/landingPage/ScrollProjectList";
import ScrollingText from "@/app/[locale]/components/landingPage/ScrollingText";
import Interet from "@/app/[locale]/components/landingPage/Interet";

export default function LocaleHome() {
  return <div>Bienvenue sur la page d'accueil locale.</div>;
}
