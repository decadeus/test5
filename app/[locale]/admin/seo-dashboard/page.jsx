"use client";
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SEODashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/seo-monitoring');
      const data = await response.json();
      setStats(data.stats || []);
    } catch (error) {
      console.error('Erreur fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/seo-monitoring', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        await fetchStats(); // Recharger les données
      }
    } catch (error) {
      console.error('Erreur update stats:', error);
    } finally {
      setUpdating(false);
    }
  };

  const chartData = {
    labels: stats.slice(-14).map(stat => 
      new Date(stat.created_at).toLocaleDateString('fr-FR')
    ),
    datasets: [
      {
        label: 'URLs dans sitemaps',
        data: stats.slice(-14).map(stat => stat.sitemap_urls),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Pages indexées Google',
        data: stats.slice(-14).map(stat => stat.google_indexed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Pages visibles (site:)',
        data: stats.slice(-14).map(stat => stat.google_visible),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution de l\'indexation SEO',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const latest = stats[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard SEO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard SEO</h1>
          <p className="mt-2 text-gray-600">Monitoring de l'indexation Google</p>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={updateStats}
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {updating ? 'Mise à jour...' : '🔄 Actualiser les données'}
          </button>
        </div>

        {/* Stats Cards */}
        {latest && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">URLs Sitemaps</p>
                  <p className="text-2xl font-bold text-gray-900">{latest.sitemap_urls}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pages Indexées</p>
                  <p className="text-2xl font-bold text-gray-900">{latest.google_indexed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">👁️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pages Visibles</p>
                  <p className="text-2xl font-bold text-gray-900">{latest.google_visible}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Taux Visibilité</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latest.google_indexed > 0 ? Math.round((latest.google_visible / latest.google_indexed) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {stats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Errors */}
        {latest?.errors && latest.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-4">⚠️ Erreurs détectées</h3>
            <ul className="space-y-2">
              {latest.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Google Search Console</div>
              <div className="text-sm text-gray-500">Voir les détails d'indexation</div>
            </a>
            
            <a
              href="https://www.google.com/search?q=site:hoomge.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Test site:hoomge.com</div>
              <div className="text-sm text-gray-500">Vérifier les pages visibles</div>
            </a>
            
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Sitemap principal</div>
              <div className="text-sm text-gray-500">Vérifier le sitemap</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
