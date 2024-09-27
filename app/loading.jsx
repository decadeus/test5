export  default function Loading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      {/* Conteneur du spinner */}
      <div className="relative flex items-center justify-center h-52 w-52">
        {/* Texte centré, taille doublée */}
        <span className="absolute text-4xl font-bold text-brown font-satisfy">Hoomge</span>
        {/* Cercle tournant */}
        <div className="animate-spin rounded-full h-full w-full border-t-4 border-b-4 brownborder"></div>
      </div>
    </div>
    );
  };