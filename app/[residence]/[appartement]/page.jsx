import { createClient } from "@/utils/supabase/server";

import BackLink from "./usepath";
import Res from "./res";
import Appart from "./appart";

export default async function Page({ params }) {
  const supabase = createClient();
  const value = params.appartement;
  const value2 = params.residence;

  const { data: b, error } = await supabase
    .from("appartement")
    .select("*")
    .eq("id", value)
    .single();

  if (error) {
    console.error("Error fetching appartement:", error);
    return <p>Appartement not found.</p>;
  }

  const { data: a, error: e } = await supabase
    .from("residence")
    .select("*")
    .eq("id", value2)
    .single();

  if (e) {
    console.error("Error fetching residence:", e);
    return <p>residence not found.</p>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col xl:flex-row xl:w-full lg:flex-row md:flex-col sm:flex-col">
        <div className="w-full flex-row w:2/3 xl:w-2/3 lg:w-2/3 md:w-full sm:w-full bg-blue-100">
          <Appart b1={b.title} b1i={b.mainpicUrl} b2={b.b2} t1={b.t1} d1={b.d1} m1={b.maintitle} />
        </div>
        <div className="w-full flex-row w:1/3 xl:w-1/3 lg:w-1/3 md:w-full sm:w-full bg-yellow-700">
          <Res i1={a.city} />
        </div>
      </div>

      <BackLink>Back</BackLink>
    </div>
  );
}

