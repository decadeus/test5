# Guide de Style pour les Articles de Blog

## Vue d'ensemble

Ce système de styles garantit une cohérence visuelle entre tous les articles de blog et simplifie la création de nouveaux articles.

## Structure

### 1. Fichiers de style
- `article-styles.css` : Classes CSS communes pour tous les articles
- `ArticleLayout.jsx` : Composant layout réutilisable

### 2. Composants utilitaires
- `BackToBlog.jsx` : Lien de retour vers la liste des articles

## Utilisation

### Pour créer un nouvel article

1. **Importez le layout** :
```jsx
import ArticleLayout from "../components/ArticleLayout";
```

2. **Utilisez le composant ArticleLayout** :
```jsx
<ArticleLayout
  title="Titre de votre article"
  author="Johann Debeaumont"
  date="2024-01-01"
  readTime="5 min de lecture"
  imageUrl="/image.png"
  imageAlt="Description de l'image"
  jsonLd={jsonLd}
>
  {/* Contenu de votre article */}
</ArticleLayout>
```

### Classes CSS disponibles

#### Structure principale
- `.article-container` : Conteneur principal (min-height, background, padding)
- `.article-content` : Conteneur du contenu (max-width, centrage)
- `.article-header` : En-tête de l'article
- `.article-body` : Corps de l'article

#### Titres
- `.article-title` : Titre principal (H1)
- Les H2, H3, H4 ont des styles automatiques dans `.article-body`

#### Métadonnées
- `.article-meta` : Conteneur des métadonnées (auteur, date, temps de lecture)
- `.article-meta-item` : Élément individuel de métadonnée

#### Boîtes d'information
- `.info-box-gray` : Boîte d'information générale (grise)
- `.info-box-red` : Boîte d'avertissement (rouge)
- `.info-box-title` : Titre des boîtes d'information
- `.info-box-content` : Contenu des boîtes d'information
- `.info-sub-box` : Sous-boîte à l'intérieur d'une boîte d'information

#### Étapes et sections
- `.step-container` : Conteneur pour une étape
- `.step-title` : Titre d'une étape

#### Liens et éléments spéciaux
- `.internal-link` : Liens internes vers d'autres articles
- `.diagram-container` : Conteneur pour diagrammes

## Exemple complet

Voir `example-new-article.jsx` pour un exemple complet d'utilisation.

## Avantages

1. **Cohérence** : Tous les articles ont le même style de base
2. **Maintenance** : Modifications centralisées dans `article-styles.css`
3. **Simplicité** : Plus besoin de répéter le code de layout
4. **SEO** : Gestion automatique des données structurées JSON-LD
5. **Responsive** : Styles adaptatifs pour mobile inclus

## Migration des articles existants

Pour migrer un article existant :

1. Remplacez le layout manuel par `ArticleLayout`
2. Remplacez les classes inline par les classes CSS définies
3. Utilisez les boîtes d'information standardisées
4. Testez le responsive

## Palette de couleurs standardisée

- **Gris** : Information générale (`.info-box-gray`)
- **Rouge** : Avertissements critiques (`.info-box-red`)
- **Bleu** : Liens et éléments interactifs (`.internal-link`)

Cette approche limite le nombre de couleurs et améliore la lisibilité.
