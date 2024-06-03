import { createClient } from "@/utils/supabase/client"; // Ensure the correct path to your Supabase client
import Link from "next/link";
import Image from "next/image";
import b from "@/components/b.png";


export default async function MainNavBar({ user }) {
  const supabase = createClient();
  const siteConfig = {
    navItems: [
      {
        label: "La résidence",
        href: "/",
      },
      {
        label: "Dashboard",
        href: "/",
      },
      {
        label: "Dashboarde",
        href: "/",
      },
      {
        label: "Dashboardr",
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
    ],
  };

  // Fetch user profile data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("pic_profil, website, username") // Adjust the fields as necessary
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return <div>Error loading profile</div>; // Or handle the error as needed
  }

  return (
    <div className="w-full bg-gray-100 px-10 py-4 flex justify-between items-center">
      <div className="w-12 h-12">
        <Image src={b} width={50} height={50} alt="Logo" />
      </div>
      <div className="flex text-center justify-center items-center">
        {profile.username === "user" ? (
          <ul className="flex gap-4 font-bold">
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : profile.username === "test" ? (
          <ul className="hidden lg:flex gap-4 justify-start">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>Rien</div>
        )}
      </div>
      <div>
        {user ? (
          <div className="flex gap-2 items-center">
            <div className="flex flex-col text-center">
              <div>{profile.username}</div>
              <div>{user.email}</div>
            </div>
         
          </div>
        ) : (
          <p>No user data</p>
        )}
      </div>
    </div>
  );
}