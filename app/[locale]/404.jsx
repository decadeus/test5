import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
      <h1 className="text-6xl font-extrabold text-green-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page non trouvée</h2>
      <p className="text-gray-600 mb-8">Oups ! La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link href="/" className="px-6 py-3 rounded-full border border-green-700 text-green-700 font-semibold bg-white/70 hover:bg-green-700 hover:text-white transition text-lg">
        Revenir à l'accueil
      </Link>
    </div>
  );
} 