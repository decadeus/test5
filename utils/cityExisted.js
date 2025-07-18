import { createClient } from "@/utils/supabase/client";


const supabase = createClient();

export const countryData = (async () => {
    const { data, error } = await supabase.from('project').select('country, city');
    
    if (error) {
        return {};
    }

    return data.reduce((acc, { country, city }) => {
        if (!acc[country]) {
            acc[country] = [];
        }
        if (!acc[country].includes(city)) {
            acc[country].push(city);
        }
        return acc;
    }, {});
})();
