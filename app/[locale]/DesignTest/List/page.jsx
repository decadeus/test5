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
  tGlobal
}) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(apt.id, (projectImages[apt.id]||[]).length),
    onSwipedRight: () => handlePrevImage(apt.id, (projectImages[apt.id]||[]).length),
  });
  return (
    <div
      key={apt.id}
      className="bg-white/80 backdrop-blur-sm border-1 border-white text-gray-900 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group card fade-in"
    >
      {/* Badge nombre de lots */}
      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow z-30">
        {filterProjectListByRange(apt.projectlist).length} {tGlobal(filterProjectListByRange(apt.projectlist).length > 1 ? 'Appartements' : 'Appartement')}
      </span>
      <div className="w-full flex flex-col gap-2 relative">
        <div className="relative overflow-hidden" {...swipeHandlers}>
          {/* Badges jardin/rooftop sur la photo */}
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            {apt.projectlist.some(lot => !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false') && (
              <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-2 py-1 text-xs shadow">🌸 {t("jardin")}</span>
            )}
            {apt.projectlist.some(lot => !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false') && (
              <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-2 py-1 text-xs shadow">🏙️ {t("rooftop")}</span>
            )}
          </div>
          {/* Navigation images avec fondu */}
          {projectImages[apt.id] && projectImages[apt.id].length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsChangingImage(prev => ({...prev, [apt.id]: true}));
                  setTimeout(() => {
                    handlePrevImage(apt.id, projectImages[apt.id].length);
                    setIsChangingImage(prev => ({...prev, [apt.id]: false}));
                  }, 200);
                }}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-1.5 sm:p-2 rounded-full z-20 transition-colors border border-black"
                aria-label={t("precedent")}
                tabIndex={0}
              >
                <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsChangingImage(prev => ({...prev, [apt.id]: true}));
                  setTimeout(() => {
                    handleNextImage(apt.id, projectImages[apt.id].length);
                    setIsChangingImage(prev => ({...prev, [apt.id]: false}));
                  }, 200);
                }}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-1.5 sm:p-2 rounded-full z-20 transition-colors border border-black"
                aria-label={t("suivant")}
                tabIndex={0}
              >
                <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
              {/* Points de navigation */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-20">
                {projectImages[apt.id].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      // setCurrentImageIndexes doit être passé en prop si on veut le modifier ici
                    }}
                    className={`w-3 h-3 rounded-full border-2 border-black transition-all duration-300 ${idx === (currentImageIndexes[apt.id] || 0) ? "bg-green-600 scale-125 shadow" : "bg-white/80"}`}
                    aria-label={`${t("Aller à l'image")} ${idx + 1}`}
                    tabIndex={0}
                  />
                ))}
              </div>
            </>
          )}
          <img
            src={(projectImages[apt.id] && projectImages[apt.id].length > 0 ? projectImages[apt.id] : ["/components/image/placeholder.jpg"])[currentImageIndexes[apt.id] || 0]}
            alt={apt.title}
            className={`w-full h-48 sm:h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300 img-fade ${isChangingImage[apt.id] ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
        {/* Séparateur */}
        <div className="w-full h-px bg-gradient-to-r from-green-700 via-gray-200 to-green-200 my-1" />
      </div>
      <div className="p-3 sm:p-4 flex flex-col w-full relative group h-full">
        <div className="flex flex-row justify-between">
          <h2 className="text-base sm:text-lg font-semibold mb-2">
            {highlight(apt.title, debouncedSearchTerm)}
          </h2>
          <p className="text-xs sm:text-sm font-semibold">{apt.city}</p>
        </div>
        {/* Affichage des lots du projet */}
        {/* Version mobile : cartes empilées */}
        <div className="sm:hidden flex flex-col gap-2">
          {(showAllLots === apt.id ? filterProjectListByRange(apt.projectlist) : filterProjectListByRange(apt.projectlist).slice(0, 3)).map((lot, idx) => (
            <div key={lot.ref || idx} className="bg-white rounded-lg shadow p-2 flex items-center justify-between">
              <span>🛏 {lot.bed}</span>
              <span>📐 {lot.surface}m²</span>
              <span>💶 {formatPrice(lot.price)}</span>
              {!!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false' && <span>🌸</span>}
              {!!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false' && <span>🏙️</span>}
            </div>
          ))}
          {filterProjectListByRange(apt.projectlist).length > 3 && showAllLots !== apt.id && (
            <button onClick={() => setShowAllLots(apt.id)} className="text-green-600 underline text-xs mt-1">{t('Voir tous les lots')}</button>
          )}
          {showAllLots === apt.id && (
            <button onClick={() => setShowAllLots(null)} className="text-green-600 underline text-xs mt-1">{t('Réduire')}</button>
          )}
        </div>
        {/* Version desktop : tableau */}
        <div className="hidden sm:block mb-2 overflow-x-auto">
          <table className="w-full text-xs text-gray-700 text-center rounded-lg shadow border border-green-100 overflow-hidden">
            <thead>
              <tr className="bg-green-200/80 text-red-700 text-sm sm:text-base">
                <th className="w-8 font-normal">🛏</th>
                <th className="w-8 font-normal">🏢</th>
                <th className="w-8 font-normal">📐</th>
                <th className="w-8 font-normal">🌸</th>
                <th className="w-8 font-normal">🏙️</th>
                <th className="w-24 font-normal text-center">💶</th>
                <th className="font-normal">ℹ️</th>
              </tr>
            </thead>
            <tbody>
              {(showAllLots === apt.id ? filterProjectListByRange(apt.projectlist) : filterProjectListByRange(apt.projectlist).slice(0, 3)).map((lot, idx) => (
                <tr key={lot.ref || idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-green-100 transition`}>
                  <td className="w-8 font-semibold">{lot.bed}</td>
                  <td className="w-8">{lot.floor}</td>
                  <td className="w-8">{lot.surface}</td>
                  <td className="w-8">{!!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false' ? "🌸" : ""}</td>
                  <td className="w-8">{!!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false' ? "🏙️" : ""}</td>
                  <td className="w-24 text-right font-semibold">{formatPrice(lot.price)}</td>
                  <td className="pl-2 sm:pl-4 text-left text-black max-w-[120px] font-semibold truncate">{lot.des || ""}</td>
                </tr>
              ))}
              {filterProjectListByRange(apt.projectlist).length > 3 && showAllLots !== apt.id && (
                <tr>
                  <td colSpan={7} className="text-xl sm:text-2xl text-gray-700 font-extrabold text-center cursor-pointer" onClick={() => setShowAllLots(apt.id)}>...</td>
                </tr>
              )}
              {showAllLots === apt.id && (
                <tr>
                  <td colSpan={7} className="text-xs text-green-600 text-center cursor-pointer" onClick={() => setShowAllLots(null)}>{t('Réduire')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Link href={`/${locale}/DesignTest/Detail/${apt.id}`} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex items-center justify-center" tabIndex={0} aria-label={t('Voir le détail du projet')}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:rotate-90 flex items-center justify-center">
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </Link>
      </div>
    </div>
  );
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
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'map'
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
            {/* Boutons Jardin/Rooftop */}
            <div className="flex flex-col gap-3 mt-2 w-full">
              <button
                onClick={() => setOnlyGarden((v) => !v)}
                aria-pressed={onlyGarden}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full text-sm ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("AvecJardin")}</span>
                <span>🌸</span>
              </button>
              <button
                onClick={() => setOnlyRooftop((v) => !v)}
                aria-pressed={onlyRooftop}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full text-sm ${onlyRooftop ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("Rooftop")}</span>
                <span>🏙️</span>
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border-2 border-red-500 font-semibold transition-colors duration-200 w-full text-sm bg-white text-red-500 hover:bg-red-500 hover:text-white"
              >
                <span>{t("Réinitialiser les filtres")}</span>
                <span>🔄</span>
              </button>
            </div>
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
            <div className="hidden sm:flex flex-col gap-4 justify-center items-center w-full max-w-5xl mx-auto px-4">
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-16 justify-center items-stretch max-w-5xl mx-auto">
                {/* Sliders en colonne sur mobile, en ligne sur desktop */}
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
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 w-full justify-start">
                <button
                  onClick={() => setOnlyGarden((v) => !v)}
                  aria-pressed={onlyGarden}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
                >
                  <span>{t("AvecJardin")}</span>
                  <span>🌸</span>
                </button>
                <button
                  onClick={() => setOnlyRooftop((v) => !v)}
                  aria-pressed={onlyRooftop}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base ${onlyRooftop ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
                >
                  <span>{t("Rooftop")}</span>
                  <span>🏙️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen">
          <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Compteur de résultats */}
            <div className="mb-6 text-center">
              <p className="text-lg font-semibold text-gray-700">
                {filteredApartments.length} {filteredApartments.length > 1 ? t("projets") : t("projet")} {t("trouvé")}{filteredApartments.length > 1 ? 's' : ''} • 
                {filteredApartments.reduce((total, apt) => total + (filterProjectListByRange(apt.projectlist || []).length), 0)} {t("appartement")}{filteredApartments.reduce((total, apt) => total + (filterProjectListByRange(apt.projectlist || []).length), 0) > 1 ? 's' : ''} {t("disponible")}{filteredApartments.reduce((total, apt) => total + (filterProjectListByRange(apt.projectlist || []).length), 0) > 1 ? 's' : ''}
              </p>
            </div>

            {/* Boutons de basculement vue liste/carte */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-1 shadow-lg border-2 border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📋 {t("Vue Liste")}
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    viewMode === 'map'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🗺️ {t("Vue Carte")} ({filteredApartments.filter(apt => 
                    apt.lat && apt.lng && 
                    !isNaN(parseFloat(apt.lat)) && !isNaN(parseFloat(apt.lng)) &&
                    parseFloat(apt.lat) !== 0 && parseFloat(apt.lng) !== 0
                  ).length})
                </button>
              </div>
            </div>

            {/* Sticky filters desktop */}
            <div className="sticky top-0 z-20 bg-white/90 shadow-md py-2 fade-in">
              {/* Filtres actifs (chips) */}
              <div className="flex gap-2 my-2 px-4">
                {selectedCity !== t('Tous') && (
                  <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-3 py-1 text-xs flex items-center">
                    {selectedCity}
                    <button onClick={() => setSelectedCity(t('Tous'))} className="ml-2 text-red-500 font-bold" aria-label={t('Retirer filtre ville')}>×</button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center">
                    {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-2 text-red-500 font-bold" aria-label={t('Retirer filtre recherche')}>×</button>
                  </span>
                )}
                {/* Ajoute chips pour les autres filtres si actifs */}
                {onlyGarden && (
                  <span className="bg-green-200 border border-green-400 text-green-700 rounded-full px-3 py-1 text-xs flex items-center">
                    {t('AvecJardin')}
                    <button onClick={() => setOnlyGarden(false)} className="ml-2 text-red-500 font-bold" aria-label={t('Retirer filtre jardin')}>×</button>
                  </span>
                )}
                {onlyRooftop && (
                  <span className="bg-blue-200 border border-blue-400 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center">
                    {t('Rooftop')}
                    <button onClick={() => setOnlyRooftop(false)} className="ml-2 text-red-500 font-bold" aria-label={t('Retirer filtre rooftop')}>×</button>
                  </span>
                )}
                {(selectedCity !== t('Tous') || searchTerm || onlyGarden || onlyRooftop) && (
                  <button onClick={resetFilters} className="bg-white border border-red-400 text-red-500 rounded-full px-3 py-1 text-xs ml-2" aria-label={t('Réinitialiser tous les filtres')}>{t('Réinitialiser')}</button>
                )}
              </div>
              {/* Filtres inline desktop (déjà existant) */}
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

            {/* Grille des appartements avec animation d'apparition */}
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 fade-in">
                {paginatedApartments.length === 0 ? (
                  <p className="text-center text-gray-500 col-span-full">
                    {t("Aucun résultat")}
                  </p>
                ) : (
                  paginatedApartments.map((apt) => (
                    <ApartmentCard
                      key={apt.id}
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
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="fade-in">
                <GoogleMapComponent
                  apartments={filteredApartments}
                  projectImages={projectImages}
                  currentImageIndexes={currentImageIndexes}
                  locale={locale}
                />
              </div>
            )}

            {/* Pagination en bas */}
            {viewMode === 'list' && pageCount > 1 && (
              <div className="flex justify-center my-4 gap-2">
                {Array.from({length: pageCount}).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 rounded-full border-2 ${currentPage === i+1 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-600'}`}>{i+1}</button>
                ))}
              </div>
            )}

            {/* Bouton flottant filtres mobile */}
            <button
              className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full shadow-lg p-4 z-50 block sm:hidden focus:outline-green-600"
              onClick={() => setShowFilters(true)}
              aria-label={t('Ouvrir les filtres')}
              tabIndex={0}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            </button>
          </main>
        </div>
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
