// utils/countryData.js
import { createClient } from "@/utils/supabase/client";

// Fonction pour récupérer et formater les données depuis Supabase
export default async function fetchCountryData() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('project') // Remplacez par le nom de votre table
        .select('country, city');

    if (error) {
        throw new Error(error.message);
    }

    // Formater les données
    const countryData = data.reduce((acc, { country, city }) => {
        if (!acc[country]) {
            acc[country] = [];
        }
        // Ajoutez la ville uniquement si elle n'est pas déjà présente
        if (!acc[country].includes(city)) {
            acc[country].push(city);
        }
        return acc;
    }, {});

    return countryData;
}
