import Image from "next/legacy/image";

export default function Interet() {
  return (
    <section
      className="relative py-16 text-black w-full"
      style={{ backgroundColor: "#e8e9eb" }}
    >
      <div className="grid md:grid-cols-2 gap-12 items-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 sm:py-16 md:py-20 lg:py-24">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Concentrez-vous sur vos projets, on s’occupe du reste
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            Hoomge a été conçue avec un objectif clair :
            <strong> mettre en valeur vos projets immobiliers sur Google</strong>
            grâce à une structure optimisée pour le SEO.
            <br />
            <br />
            Chaque projet est
            <strong> géré directement par le promoteur ou son agence</strong>,
            pour garantir des informations toujours à jour et pertinentes.
            <br />
            <br />
            Plus besoin de manipuler des CMS complexes : vous vous concentrez
            sur les projets,
            <strong> nous nous occupons de la visibilité</strong>.
          </p>
        </div>

        <div className="w-full h-48 sm:h-64 md:h-80 relative rounded-2xl overflow-hidden border border-white/20">
          <Image
            src="/Land.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
            quality={50}
            className="object-center"
          />
        </div>
      </div>
    </section>
  );
}
