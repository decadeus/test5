/**
 * EXEMPLES D'UTILISATION DE L'API ARTICLES HOOMGE
 * Pour votre application mobile
 */

// ============================================
// 1. SERVICE ARTICLES (React Native / Expo)
// ============================================

class HoomgeArticlesAPI {
  constructor() {
    this.baseUrl = 'https://www.hoomge.com/api/articles';
  }

  // Récupérer la liste des articles
  async getArticles(options = {}) {
    const {
      limit = 10,
      offset = 0,
      category = null,
      tag = null,
      search = null,
      includeDrafts = false,
      includeContent = false
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      includeDrafts: includeDrafts.toString(),
      includeContent: includeContent.toString()
    });

    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des articles');
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur API getArticles:', error);
      throw error;
    }
  }

  // Récupérer un article spécifique
  async getArticle(id, includeContent = true) {
    try {
      const params = new URLSearchParams({
        includeContent: includeContent.toString()
      });

      const response = await fetch(`${this.baseUrl}/${id}?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Article non trouvé');
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur API getArticle:', error);
      throw error;
    }
  }

  // Rechercher des articles
  async searchArticles(query, options = {}) {
    const {
      limit = 10,
      category = null,
      tag = null,
      minScore = 1
    } = options;

    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      minScore: minScore.toString()
    });

    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);

    try {
      const response = await fetch(`${this.baseUrl}/search?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la recherche');
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur API searchArticles:', error);
      throw error;
    }
  }

  // Récupérer les catégories et tags
  async getCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/categories`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des catégories');
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur API getCategories:', error);
      throw error;
    }
  }
}

// ============================================
// 2. HOOKS REACT NATIVE
// ============================================

import { useState, useEffect } from 'react';

// Hook pour la liste des articles
export const useArticles = (options = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const api = new HoomgeArticlesAPI();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getArticles(options);
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [JSON.stringify(options)]);

  return {
    articles,
    loading,
    error,
    pagination,
    refetch: fetchArticles
  };
};

// Hook pour un article spécifique
export const useArticle = (articleId) => {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = new HoomgeArticlesAPI();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        setLoading(true);
        setError(null);
        
        const data = await api.getArticle(articleId, true);
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  return {
    article,
    relatedArticles,
    loading,
    error
  };
};

// Hook pour la recherche
export const useArticleSearch = () => {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = new HoomgeArticlesAPI();

  const search = async (query, options = {}) => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.searchArticles(query, options);
      setResults(data.results);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    suggestions,
    loading,
    error,
    search
  };
};

// ============================================
// 3. COMPOSANTS REACT NATIVE EXEMPLES
// ============================================

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

// Composant Liste d'Articles
const ArticlesList = ({ navigation, category = null }) => {
  const { articles, loading, error, pagination } = useArticles({ 
    category,
    limit: 10 
  });

  const renderArticle = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
    >
      <Image 
        source={{ uri: `https://www.hoomge.com${item.imageUrl}` }}
        style={styles.articleImage}
      />
      <View style={styles.articleContent}>
        <Text style={styles.articleCategory}>{item.category}</Text>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <View style={styles.articleMeta}>
          <Text style={styles.articleAuthor}>{item.author}</Text>
          <Text style={styles.articleDate}>{item.date}</Text>
          <Text style={styles.articleReadTime}>{item.readTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text>Chargement des articles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.articlesList}
      showsVerticalScrollIndicator={false}
    />
  );
};

// Composant Détail d'Article
const ArticleDetail = ({ route }) => {
  const { articleId } = route.params;
  const { article, relatedArticles, loading, error } = useArticle(articleId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text>Chargement de l'article...</Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error || 'Article non trouvé'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.articleDetail}>
      <Image 
        source={{ uri: `https://www.hoomge.com${article.imageUrl}` }}
        style={styles.articleDetailImage}
      />
      
      <View style={styles.articleDetailContent}>
        <Text style={styles.articleDetailCategory}>{article.category}</Text>
        <Text style={styles.articleDetailTitle}>{article.title}</Text>
        
        <View style={styles.articleDetailMeta}>
          <Text style={styles.articleDetailAuthor}>{article.author}</Text>
          <Text style={styles.articleDetailDate}>{article.date}</Text>
          <Text style={styles.articleDetailReadTime}>{article.readTime}</Text>
        </View>
        
        <Text style={styles.articleDetailText}>{article.content}</Text>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {article.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Articles similaires</Text>
            {relatedArticles.map((related) => (
              <TouchableOpacity key={related.id} style={styles.relatedArticle}>
                <Text style={styles.relatedArticleTitle}>{related.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// ============================================
// 4. STYLES EXEMPLES
// ============================================

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  
  articlesList: {
    padding: 16
  },
  
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  articleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  
  articleContent: {
    padding: 16
  },
  
  articleCategory: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  
  articleExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  articleAuthor: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500'
  },
  
  articleDate: {
    fontSize: 12,
    color: '#888'
  },
  
  articleReadTime: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500'
  },
  
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center'
  },
  
  // Styles pour le détail
  articleDetail: {
    flex: 1,
    backgroundColor: 'white'
  },
  
  articleDetailImage: {
    width: '100%',
    height: 250
  },
  
  articleDetailContent: {
    padding: 20
  },
  
  articleDetailCategory: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  
  articleDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 16
  },
  
  articleDetailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 20
  },
  
  articleDetailText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24
  },
  
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  
  relatedSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 20
  },
  
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  
  relatedArticle: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  
  relatedArticleTitle: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500'
  }
});

// ============================================
// 5. EXPORT DU SERVICE
// ============================================

export default HoomgeArticlesAPI;
