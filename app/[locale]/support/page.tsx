import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support - Hoomge',
  description: 'Centre d\'aide et support pour l\'application Hoomge. Contactez notre équipe et trouvez des réponses à vos questions.',
  keywords: 'support, aide, contact, hoomge, application, immobilier',
  openGraph: {
    title: 'Support - Hoomge',
    description: 'Centre d\'aide et support pour l\'application Hoomge',
    type: 'website',
  },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 md:p-12 text-center rounded-xl mb-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Support Hoomge
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Nous sommes là pour vous aider
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
            📞 Contactez-nous
          </h2>
          <p className="text-gray-700 mb-6">
            Pour toute question concernant l'application Hoomge, n'hésitez pas à nous contacter :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">📧 Email</h3>
              <a 
                href="mailto:support@hoomge.com" 
                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
              >
                support@hoomge.com
              </a>
              <p className="text-gray-600 mt-2">Réponse sous 24h</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">🌐 Site Web</h3>
              <a 
                href="https://www.hoomge.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
              >
                www.hoomge.com
              </a>
              <p className="text-gray-600 mt-2">Découvrez nos projets</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">📱 Application</h3>
              <p className="text-gray-700">Version iOS disponible</p>
              <p className="text-gray-600 mt-2">Téléchargez sur l'App Store</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
            ❓ Questions Fréquentes
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Comment utiliser l'application Hoomge ?
              </h3>
              <p className="text-gray-700">
                L'application Hoomge vous permet de découvrir des projets immobiliers près de chez vous. 
                Utilisez la carte pour explorer les projets disponibles et consultez les détails de chaque projet.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Comment signaler un problème technique ?
              </h3>
              <p className="text-gray-700">
                Envoyez-nous un email à support@hoomge.com en décrivant le problème rencontré. 
                N'oubliez pas de préciser votre modèle d'iPhone et la version de l'application.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                L'application est-elle gratuite ?
              </h3>
              <p className="text-gray-700">
                Oui, l'application Hoomge est entièrement gratuite. Vous pouvez consulter tous les projets 
                immobiliers sans aucun frais.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Comment mettre à jour l'application ?
              </h3>
              <p className="text-gray-700">
                Les mises à jour sont disponibles automatiquement via l'App Store. 
                Assurez-vous d'avoir activé les mises à jour automatiques dans vos réglages.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
            🔒 Confidentialité et Données
          </h2>
          <p className="text-gray-700">
            Nous respectons votre vie privée. Consultez notre{' '}
            <Link 
              href="/fr/GDPR" 
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
            >
              politique de confidentialité
            </Link>{' '}
            pour en savoir plus sur la façon dont nous traitons vos données personnelles.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
            🚀 Fonctionnalités de l'Application
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <span className="mr-3">🗺️</span>
              Carte interactive des projets immobiliers
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-3">📍</span>
              Géolocalisation pour trouver les projets près de vous
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-3">📖</span>
              Blog avec les dernières actualités immobilières
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-3">🔍</span>
              Recherche avancée de projets
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-3">📱</span>
              Interface optimisée pour mobile
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600">
          <p className="mb-2">&copy; 2024 Hoomge. Tous droits réservés.</p>
          <p className="text-sm">
            Cette page de support est dédiée aux utilisateurs de l'application mobile Hoomge.
          </p>
        </div>
      </div>
    </div>
  );
}
