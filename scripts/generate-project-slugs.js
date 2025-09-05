// Script pour générer les slugs pour tous les projets existants
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonctions de slugification (copie de utils/slugify.ts)
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    .replace(/[ąćęłńóśźż]/g, (match) => {
      const map = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
        'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
      };
      return map[match] || match;
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function translateCity(city, locale = 'fr') {
  const cityTranslations = {
    'warszawa': { fr: 'varsovie', en: 'warsaw', pl: 'warszawa', de: 'warschau' },
    'kraków': { fr: 'cracovie', en: 'krakow', pl: 'kraków', de: 'krakau' },
    'gdańsk': { fr: 'gdansk', en: 'gdansk', pl: 'gdańsk', de: 'danzig' },
    'wrocław': { fr: 'wroclaw', en: 'wroclaw', pl: 'wrocław', de: 'breslau' },
    'poznań': { fr: 'poznan', en: 'poznan', pl: 'poznań', de: 'posen' },
    'paris': { fr: 'paris', en: 'paris', pl: 'paryż', de: 'paris' },
    'lyon': { fr: 'lyon', en: 'lyon', pl: 'lyon', de: 'lyon' },
    'marseille': { fr: 'marseille', en: 'marseille', pl: 'marsylia', de: 'marseille' },
    'monaco': { fr: 'monaco', en: 'monaco', pl: 'monako', de: 'monaco' },
  };

  const cityKey = slugify(city);
  const translations = cityTranslations[cityKey];
  
  if (translations && translations[locale]) {
    return translations[locale];
  }
  
  return slugify(city);
}

function generateProjectSlug(city, projectName, locale = 'fr') {
  const translatedCity = translateCity(city, locale);
  const slugifiedProject = slugify(projectName);
  
  return `${translatedCity}_${slugifiedProject}`;
}

async function generateSlugsForAllProjects() {
  console.log('🚀 Génération des slugs pour tous les projets...');

  try {
    // 1. Récupérer tous les projets
    const { data: projects, error } = await supabase
      .from('project')
      .select('id, name, city')
      .order('id');

    if (error) {
      throw error;
    }

    console.log(`📊 ${projects.length} projets trouvés`);

    // 2. Générer les slugs
    const updates = [];
    const slugsUsed = new Set();

    for (const project of projects) {
      if (!project.city || !project.name) {
        console.warn(`⚠️  Projet ${project.id}: ville ou nom manquant`);
        continue;
      }

      // Générer le slug principal (français)
      let baseSlug = generateProjectSlug(project.city, project.name, 'fr');
      
      // Gérer les doublons en ajoutant un suffixe
      let finalSlug = baseSlug;
      let counter = 1;
      
      while (slugsUsed.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      slugsUsed.add(finalSlug);
      
      updates.push({
        id: project.id,
        slug: finalSlug,
        city: project.city,
        name: project.name
      });

      console.log(`✅ ${project.id}: ${project.city} / ${project.name} → ${finalSlug}`);
    }

    // 3. Mettre à jour la base de données (par batch pour éviter les timeouts)
    console.log('\n📝 Mise à jour de la base de données...');
    
    const batchSize = 10;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('project')
          .update({ slug: update.slug })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ Erreur pour le projet ${update.id}:`, updateError);
        }
      }
      
      console.log(`📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(updates.length / batchSize)} traité`);
    }

    console.log(`\n🎉 Génération terminée ! ${updates.length} slugs créés`);
    
    // 4. Vérification
    console.log('\n🔍 Vérification des slugs générés...');
    const { data: verification } = await supabase
      .from('project')
      .select('id, slug')
      .not('slug', 'is', null);
    
    console.log(`✅ ${verification?.length || 0} projets ont maintenant un slug`);

  } catch (error) {
    console.error('❌ Erreur lors de la génération des slugs:', error);
    process.exit(1);
  }
}

// Exécuter le script
generateSlugsForAllProjects();
