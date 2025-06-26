import { createClient } from "@/utils/supabase/server";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const t = await getTranslations('SEO');
  const locale = params.locale || 'fr';

  const desColumn = `des_${locale}`;
  const nameColumn = `name_${locale}`;

  // Ici, on prend le premier projet comme exemple pour le SEO général de la page cproject
  const { data } = await supabase
    .from("project")
    .select(`city, des_fr, des_en, des_pl, des_de, des_ru, des_uk, name_fr, name_en, name_pl, name_de, name_ru, name_uk, ${desColumn}, ${nameColumn}`)
    .limit(1)
    .single();

  if (data) {
    const title = data[nameColumn] || data.name_fr || t("Title");
    const description = data[desColumn] || data.des_fr || t("Description");
    console.log('SEO DEBUG CPROJECT', { locale, desColumn, des_fr: data.des_fr, des_en: data.des_en, des_pl: data.des_pl, description });
    return {
      title: `${title}${data.city ? ' - ' + data.city : ''}`,
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

  return {
    title: t("Title"),
    description: t("Description"),
  };
} 