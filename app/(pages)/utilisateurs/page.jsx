
import Order from './order';
import { Divider } from '@nextui-org/react';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <div>
        <Order user={user} />
      </div>
      <Divider />
    </>
  );
}
