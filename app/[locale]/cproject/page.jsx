import React from "react";
import Projectb from "./projectb";
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = createClient()
    const {
        data: { user },
      } = await supabase.auth.getUser()
  return (
    <div className="w-full bg-white">
  
  
      <Projectb user={user} />
    </div>
  );
}
