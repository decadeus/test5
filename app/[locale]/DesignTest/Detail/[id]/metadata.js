import { createClient } from "@/utils/supabase/server";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const t = await getTranslations('SEO');
  const tProjet = await getTranslations('Projet');
  
  try {
    const { data } = await supabase
      .from("project")
      .select("name, city, des")
      .eq("id", parseInt(params.id))
      .single();

    if (data) {
      const title = data.des || data.name || t("Title");
      const description = data.des || data.name || t("Description");
      
      return {
        title: `${title} - ${data.city || ""}`,
        description: description,
        openGraph: {
          title: title,
          description: description,
          type: 'website',
        },
        twitter: {
          card: 'summary',
          title: title,
          description: description,
        },
      };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
  }

  return {
    title: t("Title"),
    description: t("Description"),
    openGraph: {
      title: t("Title"),
      description: t("Description"),
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: t("Title"),
      description: t("Description"),
    },
  };
} 