"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function BackToBlog() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  return (
    <Link
      href={`/${currentLocale}/blog`}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
    >
      <FaArrowLeft className="mr-2" />
      Retour au Blog
    </Link>
  );
}