import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const { data, error } = await supabase
    .from('project')
    .select('country, city');

if (error) {
    console.error('Error fetching cities:', error);
}

// Transformer en { France: ["Paris", "Lyon"], ... }
export const countryData = data?.reduce((acc, { country, city }) => {
    if (!acc[country]) {
        acc[country] = [];
    }
    if (!acc[country].includes(city)) {
        acc[country].push(city);
    }
    return acc;
}, {}) || {};

console.log("Exported countryData:", countryData);
