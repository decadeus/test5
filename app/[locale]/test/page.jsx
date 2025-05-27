import Image from 'next/image';

function Main() {
  const sections = [
    {
      title: "Présentation de l'intelligence du moteur",
      image: "/ia_demo.png",
      text: "Notre moteur analyse et valorise vos projets avec des règles simples et puissantes, tout en restant totalement transparent pour vous."
    },
    {
      title: "Informations de base simplifiées",
      image: "/maininfo.png",
      text: "Ajoutez les informations essentielles de votre projet en quelques clics : nom, ville, société, devise et localisation."
    },
    {
      title: "Saisie assistée des lots",
      image: "/ia_demo.png",
      text: "Ajoutez vos appartements avec précision : typologie, surface, prix, statut. Import possible depuis Excel."
    },
    {
      title: "Une vue claire et graphique de l’offre",
      image: "/list_appart.png",
      text: "Chaque lot est affiché avec ses attributs de manière lisible et esthétique pour vos clients comme pour votre équipe."
    }
  ];

  return (
    <div className="flex flex-col gap-24 px-6 md:px-24 py-12 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 animate-fade-in-up`}
        >
          {/* Texte */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-800">{section.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{section.text}</p>
          </div>

          {/* Image + fond cercle */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative max-w-[500px] aspect-square rounded-full bg-gray-200/30 shadow-lg">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[350px] shadow-lg">
                <Image
                  src={section.image}
                  alt="Illustration"
                  width={300}
                  height={600}
                  className="object-cover w-full h-full rounded-2xl"
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-white rounded-full w-[70%] aspect-square shadow-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Main;
