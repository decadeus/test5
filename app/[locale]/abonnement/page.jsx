import SubscribeForm from '@/app/[locale]/component/SubscribeForm';

export default function AbonnementPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Souscrire à un abonnement</h1>

      <p className="text-gray-700 mb-6">
        Pour publier vos projets immobiliers sur notre plateforme, commencez par créer un compte promoteur
        et choisissez la formule adaptée à vos besoins.
      </p>

      <SubscribeForm />
    </main>
  );
}
