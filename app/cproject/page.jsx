import React from "react";
import Project from "@/app/cproject/project";
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = createClient()
    const {
        data: { user },
      } = await supabase.auth.getUser()
  return (
    <>
  
      <Project user={user} />
    </>
  );
}
