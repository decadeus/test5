"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Slider, Dialog } from '@mui/material';
import { useTranslations } from "next-intl";
import { useDebounce } from 'use-debounce';
import { useSwipeable } from 'react-swipeable';
import { useRouter, useParams } from 'next/navigation';

import React from "react";
import { createClient } from "@/utils/supabase/client";
import GoogleMapComponent from "@/components/GoogleMap";

// Fonction utilitaire pour formater le prix
function formatPrice(price) {
  if (typeof price === "number") return price.toLocaleString("fr-FR") + " €";
  const num = Number(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("fr-FR") + " €";
}

// Fonction utilitaire pour récupérer la première image d'un projet
async function getFirstProjectImageUrl(supabase, projectId) {
  const { data, error } = await supabase
    .storage
    .from('project')
    .list(`${projectId}/`, { limit: 1, offset: 0 });
  if (error || !data || data.length === 0) return null;
  // Prend la première image trouvée
  const file = data[0];
  return supabase.storage.from('project').getPublicUrl(`${projectId}/${file.name}`).data.publicUrl;
}

// Fonction utilitaire pour récupérer toutes les images image1- à image5- d'un projet
async function getProjectImages(supabase, projectId) {
  const { data, error } = await supabase
    .storage
    .from('project')
    .list(`${projectId}/`, { limit: 20, offset: 0 });
  if (error || !data) return [];
  // Filtre les images image1- à image5-
  const wanted = ['image1-', 'image2-', 'image3-', 'image4-', 'image5-'];
  return data
    .filter(file => wanted.some(prefix => file.name.startsWith(prefix)))
    .map(file =>
      supabase.storage.from('project').getPublicUrl(`${projectId}/${file.name}`).data.publicUrl
    );
}

// Ajout du composant ApartmentCard pour corriger l'erreur de hooks
function ApartmentCard({
  apt,
  projectImages,
  currentImageIndexes,
  handleNextImage,
  handlePrevImage,
  isChangingImage,
  setIsChangingImage,
  highlight,
  debouncedSearchTerm,
  filterProjectListByRange,
  formatPrice,
  t,
  showAllLots,
  setShowAllLots,
  locale,
  tGlobal,
  showLotsTable
}) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(apt.id, (projectImages[apt.id]||[]).length),
    onSwipedRight: () => handlePrevImage(apt.id, (projectImages[apt.id]||[]).length),
  });
  return (
    <div
      key={apt.id}
      className="bg-white/90 border border-gray-200 text-gray-900 shadow-sm rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative group card fade-in min-w-[340px] max-w-sm w-full p-0"
      style={{ minHeight: 220 }}
    >
      {/* Badges en haut */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="bg-green-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
          {filterProjectListByRange(apt.projectlist).length} {tGlobal(filterProjectListByRange(apt.projectlist).length > 1 ? 'Appartements' : 'Appartement')}
        </span>
        <div className="flex gap-1">
          {apt.projectlist.some(lot => !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false') && (
            <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-2 py-0.5 text-[10px] font-bold">🌸 {t("jardin")}</span>
          )}
          {apt.projectlist.some(lot => !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false') && (
            <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-2 py-0.5 text-[10px] font-bold">🏙️ {t("rooftop")}</span>
          )}
        </div>
      </div>
      <div className="relative overflow-hidden">
        <img
          src={(projectImages[apt.id] && projectImages[apt.id].length > 0 ? projectImages[apt.id] : ["/components/image/placeholder.jpg"])[currentImageIndexes[apt.id] || 0]}
          alt={apt.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 img-fade"
        />
      </div>
      {/* Ligne nom projet à gauche, promoteur à droite */}
      <div className="flex flex-row items-center justify-between px-4 pt-2 pb-1">
        <span className="text-base font-bold text-gray-900 truncate text-left max-w-[60%]">{highlight(apt.title, debouncedSearchTerm)}</span>
        <span className="text-xs text-gray-500 font-medium text-right truncate max-w-[38%]">by {apt.compagny && apt.compagny !== 'null' ? apt.compagny : '-'}</span>
      </div>
      {/* Bouton détail discret en bas à droite */}
      <div className="flex justify-end px-4 pb-2">
        <Link href={`/${locale}/DesignTest/Detail/${apt.id}`} className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-3 py-1 transition-all duration-200 text-xs font-semibold border border-green-200">
          {t('Voir le détail')}
          <PlusIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// Fonction utilitaire pour regrouper les projets par ville
function groupByCity(apartments) {
  return apartments.reduce((acc, apt) => {
    if (!acc[apt.city]) acc[apt.city] = [];
    acc[apt.city].push(apt);
    return acc;
  }, {});
}

export default function ApartmentList() {
  const supabase = createClient();
  const t = useTranslations("Filtre");
  const tGlobal = useTranslations(); // namespace global pour Appartements
  const [isHydrated, setIsHydrated] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [selectedCity, setSelectedCity] = useState(t("Tous"));
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([100000, 5000000]);
  const [bedRange, setBedRange] = useState([1, 5]);
  const [surfaceRange, setSurfaceRange] = useState([10, 200]);
  const [onlyGarden, setOnlyGarden] = useState(false);
  const [onlyRooftop, setOnlyRooftop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showAllLots, setShowAllLots] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState({});
  const [viewMode, setViewMode] = useState('list');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'fr';
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // Hydratation côté client : synchronise les filtres avec localStorage si dispo
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      setSelectedCity(localStorage.getItem('selectedCity') || t("Tous"));
      setSearchTerm(localStorage.getItem('searchTerm') || "");
      const price = localStorage.getItem('priceRange');
      setPriceRange(price ? JSON.parse(price) : [100000, 5000000]);
      const bed = localStorage.getItem('bedRange');
      setBedRange(bed ? JSON.parse(bed) : [1, 5]);
      const surface = localStorage.getItem('surfaceRange');
      setSurfaceRange(surface ? JSON.parse(surface) : [10, 200]);
      setOnlyGarden(localStorage.getItem('onlyGarden') === 'true');
      setOnlyRooftop(localStorage.getItem('onlyRooftop') === 'true');
    }
  }, []);

  // Sauvegarder les filtres dans le localStorage quand ils changent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCity', selectedCity);
      localStorage.setItem('searchTerm', searchTerm);
      localStorage.setItem('priceRange', JSON.stringify(priceRange));
      localStorage.setItem('bedRange', JSON.stringify(bedRange));
      localStorage.setItem('surfaceRange', JSON.stringify(surfaceRange));
      localStorage.setItem('onlyGarden', onlyGarden);
      localStorage.setItem('onlyRooftop', onlyRooftop);
    }
  }, [selectedCity, searchTerm, priceRange, bedRange, surfaceRange, onlyGarden, onlyRooftop]);

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedCity(t("Tous"));
    setSearchTerm("");
    setPriceRange([100000, 5000000]);
    setBedRange([1, 5]);
    setSurfaceRange([10, 200]);
    setOnlyGarden(false);
    setOnlyRooftop(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedCity');
      localStorage.removeItem('searchTerm');
      localStorage.removeItem('priceRange');
      localStorage.removeItem('bedRange');
      localStorage.removeItem('surfaceRange');
      localStorage.removeItem('onlyGarden');
      localStorage.removeItem('onlyRooftop');
    }
  };

  // Fonction pour formater le prix en euros
  const formatPriceForDisplay = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleNextImage = (aptId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (aptId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Fonction pour obtenir le min/max des prix, des chambres et de la surface
  const getMinMaxValues = () => {
    let minPrice = Infinity, maxPrice = -Infinity;
    let minBed = Infinity, maxBed = -Infinity;
    let minSurface = Infinity, maxSurface = -Infinity;
    apartments.forEach(apt => {
      apt.projectlist?.forEach(lot => {
        const price = parseFloat(lot.price);
        const bed = parseInt(lot.bed);
        const surface = parseFloat(lot.surface);
        if (!isNaN(price)) {
          minPrice = Math.min(minPrice, price);
          maxPrice = Math.max(maxPrice, price);
        }
        if (!isNaN(bed)) {
          minBed = Math.min(minBed, bed);
          maxBed = Math.max(maxBed, bed);
        }
        if (!isNaN(surface)) {
          minSurface = Math.min(minSurface, surface);
          maxSurface = Math.max(maxSurface, surface);
        }
      });
    });
    return {
      minPrice: minPrice === Infinity ? 100000 : minPrice,
      maxPrice: maxPrice === -Infinity ? 5000000 : maxPrice,
      minBed: minBed === Infinity ? 1 : minBed,
      maxBed: maxBed === -Infinity ? 5 : maxBed,
      minSurface: minSurface === Infinity ? 10 : minSurface,
      maxSurface: maxSurface === -Infinity ? 200 : maxSurface
    };
  };

  // Optimisation : mémoriser les min/max avec useMemo
  const minMaxValues = useMemo(() => getMinMaxValues(), [apartments]);

  // Initialiser les valeurs min/max basées sur les données réelles
  useEffect(() => {
    if (apartments.length > 0) {
      const { minPrice, maxPrice, minBed, maxBed, minSurface, maxSurface } = getMinMaxValues();
      // Ne mettre à jour que si les valeurs n'ont pas été sauvegardées dans le localStorage
      if (typeof window !== 'undefined' && !localStorage.getItem('priceRange')) {
        const priceRangeVal = maxPrice - minPrice;
        const startPrice = Math.round(minPrice + priceRangeVal * 0.1);
        const endPrice = Math.round(minPrice + priceRangeVal * 0.9);
        setPriceRange([startPrice, endPrice]);
      }
      if (typeof window !== 'undefined' && !localStorage.getItem('bedRange')) {
        setBedRange([minBed, maxBed]);
      }
      if (typeof window !== 'undefined' && !localStorage.getItem('surfaceRange')) {
        setSurfaceRange([minSurface, maxSurface]);
      }
    }
  }, [apartments]);

  // Fonction pour vérifier si un projet a des lots dans la gamme de prix ET de chambres
  const hasProjectListInRange = (project) => {
    if (!project.projectlist || project.projectlist.length === 0) return false;
    return project.projectlist.some(lot => {
      const lotPrice = parseFloat(lot.price);
      const lotBed = parseInt(lot.bed);
      const lotSurface = parseFloat(lot.surface);
      const hasGarden = !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false';
      const hasRooftop = !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false';
      return (
        lotPrice >= priceRange[0] && lotPrice <= priceRange[1] &&
        lotBed >= bedRange[0] && lotBed <= bedRange[1] &&
        lotSurface >= surfaceRange[0] && lotSurface <= surfaceRange[1] &&
        (!onlyGarden || hasGarden) &&
        (!onlyRooftop || hasRooftop)
      );
    });
  };

  // Fonction pour filtrer les lots d'un projet selon la gamme de prix ET de chambres
  const filterProjectListByRange = (projectlist) => {
    if (!projectlist) return [];
    return projectlist.filter(lot => {
      const lotPrice = parseFloat(lot.price);
      const lotBed = parseInt(lot.bed);
      const lotSurface = parseFloat(lot.surface);
      const hasGarden = !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false';
      const hasRooftop = !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false';
      return (
        lotPrice >= priceRange[0] && lotPrice <= priceRange[1] &&
        lotBed >= bedRange[0] && lotBed <= bedRange[1] &&
        lotSurface >= surfaceRange[0] && lotSurface <= surfaceRange[1] &&
        (!onlyGarden || hasGarden) &&
        (!onlyRooftop || hasRooftop)
      );
    });
  };

  const filteredApartments = apartments.filter((a) => {
    const matchesCity = selectedCity === t("Tous") || a.city === selectedCity;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRange = hasProjectListInRange(a);
    return matchesCity && matchesSearch && matchesRange;
  });

  // Pour la carte : on veut tous les projets de la ville sélectionnée, sans filtrer sur les lots
  const apartmentsForMap = apartments.filter(a => selectedCity === t('Tous') || a.city === selectedCity);

  useEffect(() => {
    const fetchProjects = async () => {
      setError(null);
      try {
        // Récupère les projets
        const { data: projects, error: errorProjects } = await supabase
          .from("project")
          .select("id, name, compagny, country, city, lat, lng");

        // Récupère les projectlists
        const { data: projectlists, error: errorProjectlists } = await supabase
          .from("projectlist")
          .select("ide, ref, bed, floor, price, surface, garden, rooftop, des");

        if (errorProjects || errorProjectlists) {
          setError(errorProjects || errorProjectlists);
          return;
        }

        // Associe les projectlists à leur projet parent
        const apartmentsWithList = (projects || []).map((item) => ({
          id: item.id,
          title: item.name,
          summary: item.compagny,
          price: item.country,
          city: item.city,
          imageUrl: "/images/placeholder.jpg",
          projectlist: (projectlists || []).filter((pl) => pl.ide === item.id),
          lat: item.lat,
          lng: item.lng,
        }));

        setApartments(apartmentsWithList);

        // Récupère toutes les images image1- à image5- pour chaque projet
        const imagesObj = {};
        await Promise.all(
          apartmentsWithList.map(async (apt) => {
            const urls = await getProjectImages(supabase, apt.id);
            if (urls.length > 0) imagesObj[apt.id] = urls;
          })
        );
        setProjectImages(imagesObj);
      } catch (e) {
        setError(e.message || 'Erreur inconnue');
      }
    };
    fetchProjects();
  }, []);

  // Highlight du texte recherché
  function highlight(text, term) {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <mark key={i} className="bg-yellow-200">{part}</mark>
        : part
    );
  }

  // Pagination des résultats filtrés
  const paginatedApartments = filteredApartments.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const pageCount = Math.ceil(filteredApartments.length / itemsPerPage);

  if (!isHydrated) return null;
  return (
    <>
      <div className="bg-green-100/10 min-h-screen w-full">
        {/* Bouton Filtres mobile centré uniquement */}
        <div className="block sm:hidden w-full flex justify-center px-4 pt-3">
          <button
            className="bg-green-600 text-white font-bold rounded-full py-1 text-base shadow border-2 border-black h-10 w-2/3 max-w-xs mt-2"
            style={{ minHeight: 36 }}
            onClick={() => setShowFilters(true)}
            aria-pressed={showFilters}
          >
            {t("Filtre")}
          </button>
        </div>
        {/* Modal Filtres mobile */}
        <Dialog open={showFilters} onClose={() => setShowFilters(false)} fullWidth maxWidth="sm" PaperProps={{
          style: { borderRadius: 24, padding: 0, background: 'white', minHeight: 'auto' }
        }}>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">{t("Filtre")}</span>
              <button onClick={() => setShowFilters(false)} className="text-green-600 font-bold text-lg">✕</button>
            </div>
            {/* Filtres ville + recherche */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 whitespace-nowrap overflow-x-auto pb-2 w-full">
                {[
                  t("Tous"),
                  ...[...new Set(apartments.map((a) => a.city))].sort(),
                ].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    aria-pressed={selectedCity === city}
                    className={`h-10 px-3 border-2 border-black rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                      selectedCity === city
                        ? "bg-green-600 text-white"
                        : "bg-white text-black hover:bg-green-600 hover:text-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("Rechercher:")}
                className="h-10 w-full pl-3 text-left border-2 border-black rounded-full text-sm font-semibold text-gray-500 placeholder:text-black/50 placeholder:font-semibold"
              />
            </div>
            {/* Sliders */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Prix")}</span>
                  <span className="text-xs font-semibold text-black">
                    {formatPriceForDisplay(priceRange[0])} - {formatPriceForDisplay(priceRange[1])}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v)}
                  valueLabelDisplay="off"
                  min={minMaxValues.minPrice}
                  max={minMaxValues.maxPrice}
                  step={10000}
                  sx={{
                    color: '#16a34a',
                    height: 4,
                    px: 1,
                    borderRadius: '9999px',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#16a34a',
                      border: '2.5px solid #111',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: '#16a34a',
                      height: 4,
                      borderRadius: '9999px',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'white',
                      border: '2px solid #111',
                      opacity: 1,
                      height: 4,
                      borderRadius: '9999px',
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Chambres")}</span>
                  <span className="text-xs font-semibold text-black">
                    {bedRange[0]} - {bedRange[1]}
                  </span>
                </div>
                <Slider
                  value={bedRange}
                  onChange={(_, v) => setBedRange(v)}
                  valueLabelDisplay="off"
                  min={minMaxValues.minBed}
                  max={minMaxValues.maxBed}
                  step={1}
                  sx={{
                    color: '#16a34a',
                    height: 4,
                    px: 1,
                    borderRadius: '9999px',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#16a34a',
                      border: '2.5px solid #111',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: '#16a34a',
                      height: 4,
                      borderRadius: '9999px',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'white',
                      border: '2px solid #111',
                      opacity: 1,
                      height: 4,
                      borderRadius: '9999px',
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Surface")}</span>
                  <span className="text-xs font-semibold text-black">
                    {surfaceRange[0]} - {surfaceRange[1]}
                  </span>
                </div>
                <Slider
                  value={surfaceRange}
                  onChange={(_, v) => setSurfaceRange(v)}
                  valueLabelDisplay="off"
                  min={minMaxValues.minSurface}
                  max={minMaxValues.maxSurface}
                  step={1}
                  sx={{
                    color: '#16a34a',
                    height: 4,
                    px: 1,
                    borderRadius: '9999px',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#16a34a',
                      border: '2.5px solid #111',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: '#16a34a',
                      height: 4,
                      borderRadius: '9999px',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'white',
                      border: '2px solid #111',
                      opacity: 1,
                      height: 4,
                      borderRadius: '9999px',
                    },
                  }}
                />
              </div>
            </div>
            {/* Filtres Jardin et Rooftop (desktop, en ligne sous les sliders, unique) */}
            <div className="flex flex-row gap-4 justify-center items-center mt-4 w-full">
              <button
                onClick={() => setOnlyGarden((v) => !v)}
                aria-pressed={onlyGarden}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("AvecJardin")}</span>
                <span>🌸</span>
              </button>
              <button
                onClick={() => setOnlyRooftop((v) => !v)}
                aria-pressed={onlyRooftop}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${onlyRooftop ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("Rooftop")}</span>
                <span>🏙️</span>
              </button>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border-2 border-red-500 font-semibold transition-colors duration-200 w-full text-sm bg-white text-red-500 hover:bg-red-500 hover:text-white"
            >
              <span>{t("Réinitialiser les filtres")}</span>
              <span>🔄</span>
            </button>
          </div>
        </Dialog>
        {/* Filtres inline desktop */}
        <div
          className="hidden sm:block w-full h-[400px] bg-cover bg-center mb-8 shadow-md relative"
          style={{ backgroundImage: 'url(/newheader.png)' }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10 z-0"></div>
          <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center gap-4 w-full z-10 lg:mt-0 mt-10">
            <div className="hidden sm:block w-fit px-4 mb-4 overflow-x-auto mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <div className="flex gap-3 whitespace-nowrap overflow-x-auto pb-2 w-full sm:w-auto">
                  {[
                    t("Tous"),
                    ...[...new Set(apartments.map((a) => a.city))].sort(),
                  ].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      aria-pressed={selectedCity === city}
                      className={`h-10 sm:h-12 px-3 sm:px-6 border-2 border-black rounded-full text-sm sm:text-lg font-semibold transition-colors duration-200 whitespace-nowrap ${
                        selectedCity === city
                          ? "bg-green-600 text-white"
                          : "bg-white text-black hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("Rechercher:")}
                  className="h-10 sm:h-12 w-full sm:w-96 ml-0 sm:ml-8 pl-3 sm:pl-4 text-left border-2 border-black rounded-full text-sm sm:text-lg font-semibold text-gray-500 placeholder:text-black/50 placeholder:font-semibold"
                />
              </div>
            </div>
            {/* Sliders en colonne sur mobile, en ligne sur desktop */}
            <div className="hidden sm:flex flex-col gap-4 justify-center items-center w-full max-w-5xl mx-auto px-4 mb-6">
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-16 justify-center items-stretch max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 flex-1">
                  {/* Price Slider */}
                  <div className="flex flex-col items-center w-full sm:w-80">
                    <div className="w-full bg-white/90 p-1.5 sm:p-2 shadow-lg px-3 sm:px-4 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-semibold">{t("Prix")}</span>
                      <span className="text-xs sm:text-sm font-semibold text-black">
                        {formatPriceForDisplay(priceRange[0])} - {formatPriceForDisplay(priceRange[1])}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onChange={(_, v) => setPriceRange(v)}
                      valueLabelDisplay="off"
                      min={minMaxValues.minPrice}
                      max={minMaxValues.maxPrice}
                      step={10000}
                      sx={{
                        color: '#16a34a',
                        height: { xs: 4, sm: 8 },
                        px: 1,
                        borderRadius: '9999px',
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        '& .MuiSlider-thumb': {
                          width: { xs: 16, sm: 24 },
                          height: { xs: 16, sm: 24 },
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          border: '2.5px solid #111',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                        },
                        '& .MuiSlider-track': {
                          border: 'none',
                          background: '#16a34a',
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'white',
                          border: '2px solid #111',
                          opacity: 1,
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                      }}
                    />
                  </div>
                  {/* Bed Slider */}
                  <div className="flex flex-col items-center w-full sm:w-56">
                    <div className="w-full bg-white/90 p-1.5 sm:p-2 shadow-lg px-3 sm:px-4 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-semibold">{t("Chambres")}</span>
                      <span className="text-xs sm:text-sm font-semibold text-black">
                        {bedRange[0]} - {bedRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={bedRange}
                      onChange={(_, v) => setBedRange(v)}
                      valueLabelDisplay="off"
                      min={minMaxValues.minBed}
                      max={minMaxValues.maxBed}
                      step={1}
                      sx={{
                        color: '#16a34a',
                        height: { xs: 4, sm: 8 },
                        px: 1,
                        borderRadius: '9999px',
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        '& .MuiSlider-thumb': {
                          width: { xs: 16, sm: 24 },
                          height: { xs: 16, sm: 24 },
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          border: '2.5px solid #111',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                        },
                        '& .MuiSlider-track': {
                          border: 'none',
                          background: '#16a34a',
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'white',
                          border: '2px solid #111',
                          opacity: 1,
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                      }}
                    />
                  </div>
                  {/* Surface Slider */}
                  <div className="flex flex-col items-center w-full sm:w-64">
                    <div className="w-full bg-white/90 p-1.5 sm:p-2 shadow-lg px-3 sm:px-4 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-semibold">{t("Surface")}</span>
                      <span className="text-xs sm:text-sm font-semibold text-black">
                        {surfaceRange[0]} - {surfaceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={surfaceRange}
                      onChange={(_, v) => setSurfaceRange(v)}
                      valueLabelDisplay="off"
                      min={minMaxValues.minSurface}
                      max={minMaxValues.maxSurface}
                      step={1}
                      sx={{
                        color: '#16a34a',
                        height: { xs: 4, sm: 8 },
                        px: 1,
                        borderRadius: '9999px',
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        '& .MuiSlider-thumb': {
                          width: { xs: 16, sm: 24 },
                          height: { xs: 16, sm: 24 },
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          border: '2.5px solid #111',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
                        },
                        '& .MuiSlider-track': {
                          border: 'none',
                          background: '#16a34a',
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'white',
                          border: '2px solid #111',
                          opacity: 1,
                          height: { xs: 4, sm: 8 },
                          borderRadius: '9999px',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Filtres Jardin et Rooftop (desktop, en ligne sous les sliders, unique) */}
              <div className="flex flex-row gap-4 justify-center items-center mt-4 w-full">
                <button
                  onClick={() => setOnlyGarden((v) => !v)}
                  aria-pressed={onlyGarden}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
                >
                  <span>{t("AvecJardin")}</span>
                  <span>🌸</span>
                </button>
                <button
                  onClick={() => setOnlyRooftop((v) => !v)}
                  aria-pressed={onlyRooftop}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${onlyRooftop ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
                >
                  <span>{t("Rooftop")}</span>
                  <span>🏙️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8 mt-4">
          <div className="bg-white rounded-full p-1 shadow-lg border-2 border-gray-200 flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Vue Liste
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                viewMode === 'map'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              🗺️ Vue Carte
            </button>
          </div>
        </div>

        {/* Sticky filters desktop */}
        <div className="sticky top-0 z-20 bg-white/90 shadow-md py-2 fade-in">
          {/* Filtres actifs (chips) */}
          {/* ... */}
        </div>

        {/* Loader animé */}
        {apartments.length === 0 && !error && (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
          </div>
        )}
        {/* Message d'erreur */}
        {error && (
          <div className="text-center text-red-600 font-semibold my-4">
            {t('Erreur de chargement.')} <button onClick={() => window.location.reload()} className="underline">{t('Réessayer')}</button>
          </div>
        )}

        {/* Grille des appartements avec animation d'apparition - remplacée par slider par ville */}
        {viewMode === 'list' ? (
          <div className="flex flex-col gap-8 fade-in max-w-7xl mx-auto">
            {(() => {
              // On groupe les appartements filtrés par ville
              const grouped = groupByCity(filteredApartments);
              const cityNames = Object.keys(grouped).sort();
              if (cityNames.length === 0) {
                return (
                  <p className="text-center text-gray-500 col-span-full">
                    {t("Aucun résultat")}
                  </p>
                );
              }
              return cityNames.map(city => (
                <div key={city} className="bg-white rounded-3xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-black">{city}</span>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-white">
                    <div className="flex flex-row gap-12 min-w-[340px]">
                      {grouped[city].map(apt => (
                        <div key={apt.id} className="min-w-[320px] max-w-xs w-full">
                          <ApartmentCard
                            apt={apt}
                            projectImages={projectImages}
                            currentImageIndexes={currentImageIndexes}
                            handleNextImage={handleNextImage}
                            handlePrevImage={handlePrevImage}
                            isChangingImage={isChangingImage}
                            setIsChangingImage={setIsChangingImage}
                            highlight={highlight}
                            debouncedSearchTerm={debouncedSearchTerm}
                            filterProjectListByRange={filterProjectListByRange}
                            formatPrice={formatPrice}
                            t={t}
                            showAllLots={showAllLots}
                            setShowAllLots={setShowAllLots}
                            locale={locale}
                            tGlobal={tGlobal}
                            showLotsTable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto my-12">
            <GoogleMapComponent
              apartments={apartmentsForMap}
              projectImages={projectImages}
              currentImageIndexes={currentImageIndexes}
              locale={locale}
            />
          </div>
        )}

        {/* Bouton flottant filtres mobile */}
        <button
          className="fixed bottom-6  right-6 bg-green-600 text-white rounded-full shadow-lg p-4 z-50 block sm:hidden focus:outline-green-600"
          onClick={() => setShowFilters(true)}
          aria-label={t('Ouvrir les filtres')}
          tabIndex={0}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </button>
      </div>

      {/* Styles pour focus visible, fade-in, img-fade */}
      <style jsx global>{`
        button:focus, a:focus {
          outline: 2px solid #16a34a;
          outline-offset: 2px;
        }
        .fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
        .img-fade {
          transition: opacity 0.4s;
        }
        .img-fade.opacity-0 {
          opacity: 0;
        }
        .img-fade.opacity-100 {
          opacity: 1;
        }
      `}</style>
    </>
  );
}