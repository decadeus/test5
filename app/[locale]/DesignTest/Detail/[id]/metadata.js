import { createClient } from "@/utils/supabase/server";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const t = await getTranslations('SEO');
  const locale = params.locale || 'fr'; // 'fr', 'en', 'pl', etc.

  // Colonnes à sélectionner dynamiquement
  const desColumn = `des_${locale}`;
  const nameColumn = `name_${locale}`;

  try {
    // 1. Sélectionner les colonnes traduites spécifiques ET les colonnes par défaut
    const { data } = await supabase
      .from("project")
      .select(`city, des, des_fr, name, name_fr, ${desColumn}, ${nameColumn}`)
      .eq("id", parseInt(params.id))
      .single();

    if (data) {
      // 2. Logique de fallback pour le titre et la description
      // Priorité 1: Contenu traduit (ex: name_en, des_pl)
      // Priorité 2: Contenu par défaut non-traduit (name, des)
      // Priorité 3: Traduction statique du fichier .json (t("Title"))
      const title = data[nameColumn] || data.name_fr || data.name || t("Title");
      const description = data[desColumn] || data.des_fr || data.des || t("Description");
      console.log('SEO DEBUG', { locale, desColumn, des_pl: data.des_pl, des_fr: data.des_fr, des: data.des, description });
      
      return {
        title: `${title} - ${data.city || ""}`,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
        },
        twitter: {
          card: 'summary',
          title,
          description,
        },
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
  }

  // Fallback ultime si le projet n'est pas trouvé ou en cas d'erreur
  return {
    title: t("Title"),
    description: t("Description"),
  };
} 