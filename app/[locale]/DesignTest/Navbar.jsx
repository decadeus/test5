import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { href: "/fr/DesignTest/Homepage", label: "Accueil" },
    { href: "/fr/DesignTest/List", label: "List" },
  ];

  // Détecte la locale et le chemin après /DesignTest/
  const match = pathname.match(/^\/(fr|en)(\/DesignTest\/.*)$/);
  const currentLocale = match ? match[1] : "fr";
  const currentPath = match ? match[2] : "/DesignTest/Homepage";

  // Dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const locales = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];
  const currentLang = locales.find(l => l.code === currentLocale);
  const otherLangs = locales.filter(l => l.code !== currentLocale);

  const handleLocaleChange = (locale) => {
    setOpen(false);
    if (locale !== currentLocale) {
      router.push(`/${locale}${currentPath}`);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 px-2 py-2 flex gap-6 items-center rounded-full bg-white/30 backdrop-blur shadow-lg w-auto z-50" style={{width: 'fit-content'}}>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-1 rounded-full border font-semibold text-green-700 border-green-700 bg-white/70 hover:bg-green-700 hover:text-white transition select-none"
        >
          <span className="text-xl">{currentLang.flag}</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="absolute left-0 mt-2 w-32 bg-white rounded-xl shadow-lg border z-50 animate-fade-in">
            {otherLangs.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-green-100 rounded-xl text-green-700 text-base"
              >
                <span className="text-xl">{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={
            `font-semibold px-4 py-2 rounded-full transition ` +
            (pathname === link.href
              ? "bg-green-700 text-white"
              : "text-green-700 hover:text-green-900")
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
} 