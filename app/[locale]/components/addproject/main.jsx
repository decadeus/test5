import Image from "next/image";

function Main() {
  return (
    <div className="flex-col flex gap-6 sm:gap-10">
     
      <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Partie gauche : cercle + rectangle */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="bg-gray-200/25 rounded-full w-[280px] sm:w-[350px] md:w-full max-w-[500px] aspect-square shadow-2xl relative">
            {/* Rectangle rose, centré par rapport au cercle gris */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] sm:w-[400px] md:w-[600px] shadow-2xl">
              <Image
                src="/maininfo.png"
                alt="Interface principale"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
                priority
              />
            </div>

            {/* Cercle blanc décalé */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
          </div>
        </div>

        {/* Partie droite : texte */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
            Ajoutez votre projet simplement
          </h1>
          <p className="text-base sm:text-lg pt-6 sm:pt-8 md:pt-10 max-w-2xl mx-auto md:mx-0">
            Créez un nouveau projet immobilier en quelques clics. Renseignez les informations
            essentielles : nom, ville, société, devise, localisation. Tout est rapide, clair et modifiable à tout moment.
          </p>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Partie droite : texte */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
            Collaboration facilitée
          </h1>
          <p className="text-base sm:text-lg pt-6 sm:pt-8 md:pt-10 max-w-2xl mx-auto md:mx-0">
            Ajoutez des collaborateurs, définissez leurs accès, et suivez ensemble l'évolution
            des ventes. Chacun voit uniquement ce que vous lui partagez.
          </p>
        </div>

        {/* Partie gauche : cercle + rectangle */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="bg-gray-200/25 rounded-full w-[280px] sm:w-[350px] md:w-full max-w-[500px] aspect-square shadow-2xl relative">
            {/* Rectangle rose, centré par rapport au cercle gris */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[200px] sm:w-[280px] md:w-[350px] shadow-2xl">
              <Image
                src="/ia_demo.png"
                alt="Interface de collaboration"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>

            {/* Cercle blanc décalé */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Partie gauche : cercle + rectangle */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="bg-gray-200/25 rounded-full w-[280px] sm:w-[350px] md:w-full max-w-[500px] aspect-square shadow-2xl relative">
            {/* Rectangle rose, centré par rapport au cercle gris */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] sm:w-[400px] md:w-[650px] shadow-2xl">
              <Image
                src="/list_appart.png"
                alt="Liste des appartements"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>

            {/* Cercle blanc décalé */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
          </div>
        </div>

        {/* Partie droite : texte */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
            Saisie des lots via une interface dédiée
          </h1>
          <p className="text-base sm:text-lg pt-6 sm:pt-8 md:pt-10 max-w-2xl mx-auto md:mx-0">
            Renseignez les appartements à vendre directement dans un tableau simple à utiliser.
            Typologie, surface, prix, orientation, statut : tout se fait en ligne, sans fichier externe.
          </p>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-24 flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Partie droite : texte */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
            Générez vos textes automatiquement
          </h1>
          <p className="text-base sm:text-lg pt-6 sm:pt-8 md:pt-10 max-w-2xl mx-auto md:mx-0">
            Grâce à l'IA intégrée, rédigez des textes de présentation optimisés pour les moteurs de recherche.
            Vous partez d'une base cohérente, que vous pouvez ajuster selon votre ton.
          </p>
        </div>

        {/* Partie gauche : cercle + rectangle */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="bg-gray-200/25 rounded-full w-[280px] sm:w-[350px] md:w-full max-w-[500px] aspect-square shadow-2xl relative">
            {/* Rectangle rose, centré par rapport au cercle gris */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[200px] sm:w-[280px] md:w-[350px] shadow-2xl">
              <Image
                src="/ia_demo.png"
                alt="Démonstration IA"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>

            {/* Cercle blanc décalé */}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
