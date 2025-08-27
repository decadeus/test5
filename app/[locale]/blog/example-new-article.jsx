"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArticleLayout from "../components/ArticleLayout";

export default function ExampleArticle() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "Titre de l'article",
    description: "Description de l'article pour le SEO",
    image: ['https://hoomge.com/image.png'],
    datePublished: '2024-01-01T00:00:00+00:00',
    dateModified: '2024-01-01T00:00:00+00:00',
    author: {
      '@type': 'Person',
      name: 'Johann Debeaumont',
      url: 'https://hoomge.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hoomge',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hoomge.com/favicon.ico'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hoomge.com/${currentLocale}/blog/exemple`
    },
    articleSection: 'Guide',
    keywords: 'mots-clés, séparés, par, virgules',
    wordCount: 1500,
    inLanguage: currentLocale
  };

  return (
    <ArticleLayout
      title="Titre de votre article"
      author="Johann Debeaumont"
      date="2024-01-01"
      readTime="5 min de lecture"
      imageUrl="/image.png"
      imageAlt="Description de l'image"
      jsonLd={jsonLd}
    >
      {/* Badge optionnel */}
      <div>
        <span className="article-badge">
          💡 Exemple
        </span>
      </div>

      {/* Introduction */}
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Introduction de votre article. Cette phrase sera mise en avant visuellement.
      </p>

      {/* Section 1 */}
      <h2>Première section</h2>
      <p>
        Contenu de votre première section. Utilisez les classes CSS définies dans article-styles.css
        pour maintenir la cohérence visuelle.
      </p>

      {/* Boîte d'information grise */}
      <div className="info-box-gray">
        <h4 className="info-box-title">💡 Information importante</h4>
        <p className="info-box-content">
          Utilisez cette boîte pour les informations générales.
        </p>
      </div>

      {/* Boîte d'information rouge pour les avertissements */}
      <div className="info-box-red">
        <h4 className="info-box-title">⚠️ Attention</h4>
        <p className="info-box-content">
          <strong>Important :</strong> Utilisez cette boîte pour les avertissements critiques.
        </p>
      </div>

      {/* Section 2 */}
      <h2>Deuxième section</h2>
      <h3>Sous-section</h3>
      <p>
        Vous pouvez facilement créer des liens internes vers d'autres articles :
        <Link href={`/${currentLocale}/blog/5`} className="internal-link">
          Article sur l'installation en Pologne
        </Link>.
      </p>

      <ul>
        <li>Premier élément de liste</li>
        <li>Deuxième élément de liste</li>
        <li>Troisième élément de liste</li>
      </ul>

      {/* Section avec étapes */}
      <div className="step-container">
        <h3 className="step-title">Étape 1 : Première étape</h3>
        <p>Description de la première étape.</p>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 2 : Deuxième étape</h3>
        <p>Description de la deuxième étape.</p>
      </div>

      {/* Conclusion */}
      <h2>Conclusion</h2>
      <p>
        Conclusion de votre article. N'hésitez pas à ajouter des liens vers d'autres
        articles pertinents pour améliorer le SEO interne.
      </p>
    </ArticleLayout>
  );
}
