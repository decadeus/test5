import React from 'react';

interface ProjectContentEnhancerProps {
  project: {
    name: string;
    city: string;
    country: string;
    qty: number;
    des_fr?: string;
    fulldescr_fr?: string;
    coam_fr?: string;
  };
  locale: string;
}

export default function ProjectContentEnhancer({ project, locale }: ProjectContentEnhancerProps) {
  // Générer du contenu unique basé sur les caractéristiques du projet
  const generateUniqueContent = () => {
    const cityInfo = getCityInfo(project.city, project.country);
    const projectSize = getProjectSizeDescription(project.qty);
    const investmentAdvice = getInvestmentAdvice(project.city, project.country);
    
    return {
      cityInfo,
      projectSize,
      investmentAdvice
    };
  };

  const uniqueContent = generateUniqueContent();

  return (
    <div className="space-y-6">
      {/* Contenu sur la ville */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          🏙️ Pourquoi investir à {project.city} ?
        </h3>
        <p className="text-blue-800 leading-relaxed">
          {uniqueContent.cityInfo}
        </p>
      </div>

      {/* Taille du projet */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-green-900 mb-3">
          🏢 Caractéristiques du projet
        </h3>
        <p className="text-green-800 leading-relaxed">
          {uniqueContent.projectSize}
        </p>
      </div>

      {/* Conseils d'investissement */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-3">
          💡 Opportunité d'investissement
        </h3>
        <p className="text-purple-800 leading-relaxed">
          {uniqueContent.investmentAdvice}
        </p>
      </div>

      {/* FAQ spécifique au projet */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ❓ Questions fréquentes sur {project.name}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800">
              Quand sera livré le projet {project.name} ?
            </h4>
            <p className="text-gray-600 mt-1">
              Les délais de livraison varient selon les projets. Contactez directement le promoteur pour connaître le planning précis de {project.name} à {project.city}.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800">
              Quels sont les avantages fiscaux à {project.city} ?
            </h4>
            <p className="text-gray-600 mt-1">
              L'investissement immobilier à {project.city} peut bénéficier de différents dispositifs fiscaux selon votre situation. Consultez un conseiller fiscal pour optimiser votre investissement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonctions utilitaires pour générer du contenu unique
function getCityInfo(city: string, country: string): string {
  const cityData: { [key: string]: string } = {
    'Wittelsheim': `Wittelsheim, située dans le Haut-Rhin en Alsace, bénéficie d'une position stratégique entre Mulhouse et Colmar. Cette commune dynamique de la région Grand Est offre un cadre de vie paisible tout en restant proche des grands axes de communication. L'économie locale est diversifiée avec un tissu industriel développé et une proximité avec la Suisse et l'Allemagne qui en fait un lieu d'investissement attractif.`,
    'Mulhouse': `Mulhouse, deuxième ville d'Alsace, est un centre économique majeur de l'Est de la France. Proche de la frontière suisse et allemande, elle bénéficie d'une situation géographique exceptionnelle. La ville mise sur l'innovation technologique et l'industrie 4.0, créant un environnement favorable aux investissements immobiliers.`,
    'Strasbourg': `Strasbourg, capitale européenne et préfecture du Bas-Rhin, combine patrimoine historique et modernité. Siège du Parlement européen, elle attire de nombreux professionnels internationaux, garantissant une demande locative soutenue et des perspectives de valorisation immobilière intéressantes.`
  };

  return cityData[city] || `${city} en ${country} présente des opportunités d'investissement immobilier intéressantes grâce à sa localisation et son développement économique. Cette ville offre un cadre de vie agréable et des perspectives d'évolution prometteuses pour les investisseurs.`;
}

function getProjectSizeDescription(qty: number): string {
  if (qty <= 10) {
    return `Ce projet intimiste de ${qty} logements privilégie la qualité à la quantité. Cette taille humaine garantit une atmosphère conviviale et un suivi personnalisé, tout en préservant l'exclusivité et la tranquillité des résidents. Les projets de petite taille sont souvent synonymes de finitions soignées et d'attention aux détails.`;
  } else if (qty <= 50) {
    return `Avec ses ${qty} logements, ce projet offre un équilibre parfait entre convivialité et services. Cette taille permet de proposer des équipements communs de qualité tout en maintenant une ambiance de quartier. Les résidences de taille moyenne sont particulièrement appréciées pour leur gestion optimisée et leur potentiel de valorisation.`;
  } else {
    return `Ce grand projet de ${qty} logements s'inscrit dans une démarche de développement urbain d'envergure. Cette ampleur permet de proposer une gamme complète de services et d'équipements, créant un véritable art de vivre. Les grandes résidences offrent souvent des économies d'échelle et une diversité de typologies intéressante pour les investisseurs.`;
  }
}

function getInvestmentAdvice(city: string, country: string): string {
  const advice = [
    `L'investissement immobilier à ${city} présente plusieurs atouts : stabilité du marché local, demande locative soutenue et perspectives de valorisation à moyen terme.`,
    `La proximité avec les centres économiques régionaux renforce l'attractivité de ${city} pour les investisseurs recherchant un rendement locatif stable.`,
    `Les infrastructures de transport et le développement économique de la région font de ${city} un choix judicieux pour un investissement immobilier durable.`,
    `Le marché immobilier de ${city} bénéficie d'un bon équilibre entre offre et demande, créant des conditions favorables à l'investissement locatif.`
  ];

  return advice[Math.floor(Math.random() * advice.length)];
}
