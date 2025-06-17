"use client";
import DownloadButtons from "./DownloadButtons";
import { usePathname } from "next/navigation";

export default function ConditionalDownloadButtons() {
  const pathname = usePathname();
  // Afficher DownloadButtons seulement si on n'est pas sur une page cproject
  if (pathname.includes("/cproject")) return null;
  return <DownloadButtons />;
} 