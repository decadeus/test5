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
    <div className="flex flex-col w-full px-20">
      <div className="flex flex-col xl:flex-row xl:w-full lg:flex-row md:flex-col sm:flex-col">
        <div className="w-full flex-row w:2/3 xl:w-2/3 lg:w-2/3 md:w-full sm:w-full bg-blue-100">
          <Appart
            
            b1i={b.mainpic_url}
            b2i={b.secondpic_url}
            b3i={b.threepic_url}
            b4i={b.forthpic_url}
            b2={b.b2}
            t1={b.t1}
            d1={b.d1}
            m1={b.maintitle}
            price={b.prix}
            desprix={b.desprix}
            bed={b.bed}
            bath={b.bath}
            surface={b.surface}
          />
        </div>
        <div className="w-full flex-row w:1/3 xl:w-1/3 lg:w-1/3 md:w-full sm:w-full ">
          <Res
            mainTitle={a.mainTitle}
            mainpic={a.mainpic_url}
            aut1={a.aut1}
            taut1={a.taut1}
            aut2={a.aut2}
            taut2={a.taut2}
            aut3={a.aut3}
            taut3={a.taut3}
            avan1={a.avan1}
            tavan1={a.tavan1}
            avan2={a.avan2}
            tavan2={a.tavan2}
            avan3={a.avan3}
            tavan3={a.tavan3}
            lata={a.lat}
            lnga={a.lng}
            adresse={a.adresse}
            code_postal={a.codepost}
            city={a.city}
            surface={a.surface}
          
           
          
          />
        </div>
      </div>

      <BackLink>Back</BackLink>
    </div>
  );
}
