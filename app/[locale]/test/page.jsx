import Image from 'next/image';

export default function Test() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50">   
      {/* Carte 1 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-4">
      <div className="flex justify-center mb-4 text-blue-500 bg-blue-100 rounded-full w-fit p-4 items-center text-center">
          <svg className="h-28 w-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,50 Q50,20 90,50 Q50,80 10,50 Z" fill="#ebf8ff" stroke="currentColor" strokeWidth="3"/>
            <circle cx="50" cy="50" r="15" fill="currentColor"/>
            <circle cx="50" cy="50" r="6" fill="#ebf8ff"/>
          </svg>
        </div>
        <h3 className="text-3xl text-center mb-2 font-extrabold">Visibilité optimisée</h3>
        <ul className="flex flex-col items-start text-sm text-gray-700 space-y-1 text-left w-full font-bold">
          <li>• Référencement de vos projets sur une plateforme ciblée</li>
          <li>• Mise en avant automatique des nouveaux lots</li>
          <li>• Accès rapide à l'essentiel pour vos clients potentiels</li>
        </ul>
      </div>

      {/* Carte 2 - Icône de rapport */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-4">
      <div className="flex justify-center mb-4 text-blue-500 bg-blue-100 rounded-full w-fit p-4 items-center text-center">
          <svg className="h-28 w-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="25" width="60" height="50" rx="5" fill="#f0fff4" stroke="currentColor" strokeWidth="2"/>
            <rect x="30" y="55" width="6" height="15" fill="currentColor"/>
            <rect x="42" y="45" width="6" height="25" fill="currentColor"/>
            <rect x="54" y="50" width="6" height="20" fill="currentColor"/>
            <rect x="66" y="40" width="6" height="30" fill="currentColor"/>
          </svg>
        </div>
        <h3 className="text-3xl text-center mb-2 font-extrabold">Suivi centralisé</h3>
        <ul className="flex flex-col items-start text-sm text-gray-700 space-y-1 text-left w-full font-bold"> 
          <li>• Tableau de bord clair pour suivre chaque projet</li>
          <li>• Historique des biens en vente</li>
          <li>• Gestion des collaborateurs et droits d'accès</li>
        </ul>
      </div>

      {/* Carte 3 - Icône IA corrigée */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-4">
      <div className="flex justify-center mb-4 text-blue-500 bg-blue-100 rounded-full w-fit p-4 items-center text-center">
          <svg className="h-28 w-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            
            <rect x="25" y="30" width="50" height="45" rx="8" ry="8" 
                  fill="currentColor" stroke="currentColor" strokeWidth="2"/>
            
            <circle cx="35" cy="25" r="3" fill="currentColor"/>
            <line x1="35" y1="28" x2="35" y2="30" stroke="currentColor" strokeWidth="2"/>
            <circle cx="65" cy="25" r="3" fill="currentColor"/>
            <line x1="65" y1="28" x2="65" y2="30" stroke="currentColor" strokeWidth="2"/>
            
            <text x="50" y="58" textAnchor="middle" fontFamily="Arial, sans-serif" 
                  fontSize="20" fontWeight="bold" fill="#ffffff">IA</text>
            
            <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7">
              <line x1="15" y1="20" x2="25" y2="35"/>
              <line x1="75" y1="35" x2="85" y2="20"/>
              <line x1="10" y1="50" x2="25" y2="50"/>
              <line x1="75" y1="50" x2="90" y2="50"/>
              <line x1="15" y1="80" x2="25" y2="65"/>
              <line x1="75" y1="65" x2="85" y2="80"/>
              
              <circle cx="15" cy="20" r="2" fill="currentColor"/>
              <circle cx="85" cy="20" r="2" fill="currentColor"/>
              <circle cx="10" cy="50" r="2" fill="currentColor"/>
              <circle cx="90" cy="50" r="2" fill="currentColor"/>
              <circle cx="15" cy="80" r="2" fill="currentColor"/>
              <circle cx="85" cy="80" r="2" fill="currentColor"/>
            </g>
          </svg>
        </div>
        <h3 className="text-3xl text-center mb-2 font-extrabold">Intégration de l'IA</h3>
        <ul className="flex flex-col items-start text-sm text-gray-700 space-y-1 text-left w-full font-bold">
          <li>• Rédaction des textes adaptés aux moteurs de recherche</li>
          <li>• Amélioration du référencement</li>
          <li>• Adapté aux futurs moteurs de recherche de Google</li>
        </ul>
      </div>

      {/* Carte 4 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-4">
        <div className="flex justify-center mb-4 text-blue-500 bg-blue-100 rounded-full w-fit p-4 items-center text-center">
          <svg className="h-28 w-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 C 35 10 20 18 20 25 C 20 40 20 60 50 85 C 80 60 80 40 80 25 C 80 18 65 10 50 10 Z" 
                  fill="currentColor" stroke="currentColor" strokeWidth="2"/>
            
            <rect x="40" y="45" width="20" height="25" rx="2" ry="2" 
                  fill="#2196F3" stroke="#1976D2" strokeWidth="1"/>
            
            <path d="M 43 45 C 43 38 46.5 35 50 35 C 53.5 35 57 38 57 45" 
                  fill="none" stroke="#1976D2" strokeWidth="3" strokeLinecap="round"/>
            
            <circle cx="50" cy="55" r="3" fill="#ffffff"/>
            <rect x="49" y="57" width="2" height="6" fill="#ffffff"/>
            
            <path d="M 35 30 L 40 35 L 48 27" 
                  fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-3xl text-center mb-2 font-extrabold">Contrôle & sécurité</h3>
        <ul className="flex flex-col items-start text-sm text-gray-700 space-y-1 text-left w-full font-bold">
          <li>• Accès sécurisé avec magic link</li>
          <li>• Gestion fine des droits d'accès</li>
          <li>• Données fiables via Supabase</li>
        </ul>
      </div>
    </div>
  );
}