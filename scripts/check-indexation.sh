#!/bin/bash
# Script pour vérifier rapidement les pages indexées

echo "=== VERIFICATION DES SITEMAPS ==="
echo "Sitemap principal:"
curl -s "https://www.hoomge.com/sitemap.xml" | grep -o "https://[^<]*" | wc -l
echo "URLs dans sitemap français:"
curl -s "https://www.hoomge.com/sitemap_fr.xml" | grep -o "<loc>https://[^<]*" | wc -l
echo "URLs dans sitemap anglais:"
curl -s "https://www.hoomge.com/sitemap_en.xml" | grep -o "<loc>https://[^<]*" | wc -l

echo ""
echo "=== TEST INDEXATION GOOGLE ==="
echo "Pages visibles avec site:hoomge.com (approximatif):"
echo "Allez sur: https://www.google.com/search?q=site:hoomge.com"

