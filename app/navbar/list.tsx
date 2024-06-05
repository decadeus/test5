export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "La résidence",
      href: "/",
    },
   
    {
      label: "Dashboard",
      href: "/",
    },
 
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export type NavConfigProprio = typeof navConfigProprio;

export const navConfigProprio = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/proprio",
    },
    {
      label: "Profils",
      href: "/proprio/profil",
    },
    {
      label: "Votre annonce",
      href: "/proprio/annonce",
    },
    {
      label: "Questionnaire",
      href: "/proprio/poll",
    },
  ],

};

export type NavConfigNotUser = typeof navConfigNotUser;

export const navConfigNotUser = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/proprio",
    },
    {
      label: "Profils",
      href: "/proprio/profil",
    },
    {
      label: "Votre annonce",
      href: "/proprio/annonce",
    },
    {
      label: "Questionnaire",
      href: "/proprio/poll",
    },
  ],

};