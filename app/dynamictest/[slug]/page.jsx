export default function DynamicTestPage({ params }) {
  return (
    <div>
      <h1>Page dynamique: {params.slug}</h1>
      <p>Cette page teste les métadonnées dynamiques avec le paramètre: {params.slug}</p>
      <p>Paramètres complets: {JSON.stringify(params)}</p>
    </div>
  );
} 