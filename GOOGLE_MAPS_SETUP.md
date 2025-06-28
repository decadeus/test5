# Configuration Google Maps

## Étape 1 : Obtenir une clé API Google Maps

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Maps JavaScript
4. Créez des identifiants (clé API)
5. Copiez votre clé API

## Étape 2 : Configurer la clé API

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_api_ici
```

## Étape 3 : Restreindre la clé API (Recommandé)

Dans Google Cloud Console, restreignez votre clé API :
- Limitez-la aux domaines de votre site
- Activez uniquement l'API Maps JavaScript

## Étape 4 : Tester

Redémarrez votre serveur de développement et testez la fonctionnalité de carte.

## Notes importantes

- La clé API est exposée côté client (NEXT_PUBLIC_)
- Assurez-vous de restreindre la clé API pour éviter l'abus
- Pour la production, utilisez des restrictions de domaine strictes 