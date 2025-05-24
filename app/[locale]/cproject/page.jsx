import React from "react";
import Projectb from "./projectb";
import Projectc from "./projectc";
import { createClient } from "@/utils/supabase/server";
import Navbar from "./navbar";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex w-full pt-24">
      <Navbar user={user} />
      {/* Tu peux éventuellement afficher les projets ici */}
      {/* <Projectb /> */}
      {/* <Projectc /> */}
    </div>
  );
}
