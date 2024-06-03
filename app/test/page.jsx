
import { createClient } from "@/utils/supabase/server";
import Username from "@/app/test/username";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

 

  return (
    < Username user={user} />
  );
}
