import Image from 'next/image'

function Main() {
  return (
    <div className='flex-col flex gap-10'>
      <div className="mt-24 mb-24 flex flex-col md:flex-row gap-16 items-center px-6 md:px-24">
        {/* Partie droite : texte */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="font-extrabold text-4xl md:text-5xl">Ceci est un titre</h1>
        <p className="text-lg pt-10">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus illum ea fugiat enim sit ipsam,
          nulla placeat beatae dolores praesentium ab quod, nisi molestias sint rerum soluta optio voluptates aut!
        </p>
      </div>
      
      {/* Partie gauche : cercle + rectangle */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="bg-gray-200/25 rounded-full w-full max-w-[500px] aspect-square shadow-2xl relative">
          
          {/* Rectangle rose, centré par rapport au cercle gris */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[350px] shadow-2xl">
          <Image
                src="/ia_demo.png"
                alt="Ma belle image"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
          </div>

          {/* Cercle blanc décalé */}
          <div className="absolute bottom-6 right-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
        </div>
      </div>

    
    </div>
    <div className="mt-24 mb-24 flex flex-col md:flex-row gap-16 items-center px-6 md:px-24">
      
      {/* Partie gauche : cercle + rectangle */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="bg-gray-200/25 rounded-full w-full max-w-[500px] aspect-square shadow-2xl relative">
          
          {/* Rectangle rose, centré par rapport au cercle gris */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[600px] shadow-2xl">
          <Image
                src="/maininfo.png"
                alt="Ma belle image"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
          </div>

          {/* Cercle blanc décalé */}
          <div className="absolute bottom-6 left-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
        </div>
      </div>

      {/* Partie droite : texte */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="font-extrabold text-4xl md:text-5xl">Ceci est un titre</h1>
        <p className="text-lg pt-10">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus illum ea fugiat enim sit ipsam,
          nulla placeat beatae dolores praesentium ab quod, nisi molestias sint rerum soluta optio voluptates aut!
        </p>
      </div>
    </div>
    <div className="mt-24 mb-24 flex flex-col md:flex-row gap-16 items-center px-6 md:px-24">
        {/* Partie droite : texte */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="font-extrabold text-4xl md:text-5xl">Ceci est un titre</h1>
        <p className="text-lg pt-10">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus illum ea fugiat enim sit ipsam,
          nulla placeat beatae dolores praesentium ab quod, nisi molestias sint rerum soluta optio voluptates aut!
        </p>
      </div>
      
      {/* Partie gauche : cercle + rectangle */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="bg-gray-200/25 rounded-full w-full max-w-[500px] aspect-square shadow-2xl relative">
          
          {/* Rectangle rose, centré par rapport au cercle gris */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[350px] shadow-2xl">
          <Image
                src="/ia_demo.png"
                alt="Ma belle image"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
          </div>

          {/* Cercle blanc décalé */}
          <div className="absolute top-6 left-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
        </div>
      </div>

    
    </div>
    <div className="mt-24 mb-24 flex flex-col md:flex-row gap-16 items-center px-6 md:px-24">
      
      {/* Partie gauche : cercle + rectangle */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="bg-gray-200/25 rounded-full w-full max-w-[500px] aspect-square shadow-2xl relative">
          
          {/* Rectangle rose, centré par rapport au cercle gris */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[650px] shadow-2xl">
          <Image
                src="/list_appart.png"
                alt="Ma belle image"
                width={300}
                height={600}
                className="object-cover w-full h-full rounded-2xl"
              />
          </div>

          {/* Cercle blanc décalé */}
          <div className="absolute top-6 right-6 bg-white rounded-full w-[70%] aspect-square shadow-xl"></div>
        </div>
      </div>

      {/* Partie droite : texte */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="font-extrabold text-4xl md:text-5xl">Ceci est un titre</h1>
        <p className="text-lg pt-10">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus illum ea fugiat enim sit ipsam,
          nulla placeat beatae dolores praesentium ab quod, nisi molestias sint rerum soluta optio voluptates aut!
        </p>
      </div>
    </div>
    </div>
  );
}

export default Main;
