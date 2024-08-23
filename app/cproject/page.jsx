import React from "react";
import Projectb from "@/app/cproject/projectb";
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = createClient()
    const {
        data: { user },
      } = await supabase.auth.getUser()
  return (
    <div className="w-full bg-black">
  
  
      <Projectb user={user} />
    </div>
  );
}
