"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Slider, Dialog } from '@mui/material';
import { useTranslations } from "next-intl";

import React from "react";
import { createClient } from "@/utils/supabase/client";

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

export default function ApartmentList() {
  const supabase = createClient();
  const t = useTranslations("Filtre");
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

  // Initialiser les valeurs min/max basées sur les données réelles
  useEffect(() => {
    if (apartments.length > 0) {
      const { minPrice, maxPrice, minBed, maxBed, minSurface, maxSurface } = getMinMaxValues();
      const priceRangeVal = maxPrice - minPrice;
      const startPrice = Math.round(minPrice + priceRangeVal * 0.1);
      const endPrice = Math.round(minPrice + priceRangeVal * 0.9);
      setPriceRange([startPrice, endPrice]);
      setBedRange([minBed, maxBed]);
      setSurfaceRange([minSurface, maxSurface]);
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
      // Récupère les projets
      const { data: projects, error: errorProjects } = await supabase
        .from("project")
        .select("id, name, compagny, country, city");

      // Récupère les projectlists
      const { data: projectlists, error: errorProjectlists } = await supabase
        .from("projectlist")
        .select("ide, ref, bed, floor, price, surface, garden, rooftop, des");

      if (errorProjects || errorProjectlists) {
        console.error("Supabase error:", errorProjects || errorProjectlists);
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
    };
    fetchProjects();
  }, []);

  return (
    <>
      <div className="bg-green-100/10 min-h-screen w-full">
        {/* Bouton Filtres mobile centré uniquement */}
        <div className="block sm:hidden w-full flex justify-center px-4 pt-3">
          <button
            className="bg-green-600 text-white font-bold rounded-full py-1 text-base shadow border-2 border-black h-10 w-2/3 max-w-xs mt-2"
            style={{ minHeight: 36 }}
            onClick={() => setShowFilters(true)}
          >
            {t("Filtre")}
          </button>
        </div>
        {/* Modal Filtres mobile */}
        <Dialog open={showFilters} onClose={() => setShowFilters(false)} fullWidth maxWidth="sm" PaperProps={{
          style: { borderRadius: 24, padding: 0, background: 'white', minHeight: 'auto' }
        }}>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">{t("Filtre")}</span>
              <button onClick={() => setShowFilters(false)} className="text-green-600 font-bold text-lg">✕</button>
            </div>
            {/* Filtres ville + recherche */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 whitespace-nowrap overflow-x-auto pb-2 w-full">
                {[
                  t("Tous"),
                  ...[...new Set(apartments.map((a) => a.city))].sort(),
                ].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
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
            <div className="flex flex-col gap-4">
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
                  min={getMinMaxValues().minPrice}
                  max={getMinMaxValues().maxPrice}
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
                  min={getMinMaxValues().minBed}
                  max={getMinMaxValues().maxBed}
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
                  min={getMinMaxValues().minSurface}
                  max={getMinMaxValues().maxSurface}
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
            <div className="flex flex-col gap-2 mt-2 w-full">
              <button
                onClick={() => setOnlyGarden((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full text-sm ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("AvecJardin")}</span>
                <span>🌸</span>
              </button>
              <button
                onClick={() => setOnlyRooftop((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full text-sm ${onlyRooftop ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
              >
                <span>{t("Rooftop")}</span>
                <span>🏙️</span>
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
                      min={getMinMaxValues().minPrice}
                      max={getMinMaxValues().maxPrice}
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
                      min={getMinMaxValues().minBed}
                      max={getMinMaxValues().maxBed}
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
                      min={getMinMaxValues().minSurface}
                      max={getMinMaxValues().maxSurface}
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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-black font-semibold transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base ${onlyGarden ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-green-600 hover:text-white'}`}
                >
                  <span>{t("AvecJardin")}</span>
                  <span>🌸</span>
                </button>
                <button
                  onClick={() => setOnlyRooftop((v) => !v)}
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

            {apartments.length === 0 && (
              <p className="text-center text-gray-500">
                {t("Chargement")}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filteredApartments.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">
                  {t("Aucun résultat")}
                </p>
              ) : (
                filteredApartments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white/80 backdrop-blur-sm border-1 border-white text-gray-900 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group"
                  >
                    <div className="w-full flex flex-col gap-2 relative">
                      <div className="relative overflow-hidden">
                        {/* Badges jardin/rooftop sur la photo */}
                        <div className="absolute top-2 right-2 flex gap-2 z-20">
                          {apt.projectlist.some(lot => !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false') && (
                            <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-2 py-1 text-xs shadow">🌸 {t("jardin")}</span>
                          )}
                          {apt.projectlist.some(lot => !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false') && (
                            <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-2 py-1 text-xs shadow">🏙️ {t("rooftop")}</span>
                          )}
                        </div>
                        {/* Navigation buttons */}
                        {projectImages[apt.id] && projectImages[apt.id].length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handlePrevImage(apt.id, projectImages[apt.id].length);
                              }}
                              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-1.5 sm:p-2 rounded-full z-20 transition-colors border border-black"
                              aria-label={t("precedent")}
                            >
                              <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleNextImage(apt.id, projectImages[apt.id].length);
                              }}
                              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-1.5 sm:p-2 rounded-full z-20 transition-colors border border-black"
                              aria-label={t("suivant")}
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
                                    setCurrentImageIndexes(prev => ({
                                      ...prev,
                                      [apt.id]: idx
                                    }));
                                  }}
                                  className={`w-2 h-2 rounded-full border-2 border-black transition-all duration-300 ${
                                    idx === (currentImageIndexes[apt.id] || 0) ? "bg-green-600 scale-125 shadow" : "bg-white/80"
                                  }`}
                                  aria-label={`${t("Aller à l'image")} ${idx + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        <img
                          src={(projectImages[apt.id] || ["/images/placeholder.jpg"])[currentImageIndexes[apt.id] || 0]}
                          alt={apt.title}
                          className="w-full h-48 sm:h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Séparateur */}
                      <div className="w-full h-px bg-gradient-to-r from-green-700 via-gray-200 to-green-200 my-1" />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col w-full relative group h-full">
                      <div className="flex flex-row justify-between">
                        <h2 className="text-base sm:text-lg font-semibold mb-2">
                          {apt.title}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold">{apt.city}</p>
                      </div>
                      {/* Affichage des lots du projet avec design amélioré */}
                      {apt.projectlist && apt.projectlist.length > 0 && (
                        <div className="mb-2 overflow-x-auto">
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
                              {filterProjectListByRange(apt.projectlist).slice(0, 3).map((lot, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100" + " hover:bg-green-100 transition"}>
                                  <td className="w-8 font-semibold">{lot.bed}</td>
                                  <td className="w-8">{lot.floor}</td>
                                  <td className="w-8">{lot.surface}</td>
                                  <td className="w-8">{!!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false' ? "🌸" : ""}</td>
                                  <td className="w-8">{!!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false' ? "🏙️" : ""}</td>
                                  <td className="w-24 text-right font-semibold">{formatPrice(lot.price)}</td>
                                  <td className="pl-2 sm:pl-4 text-left text-black max-w-[120px] font-semibold truncate">{lot.des || ""}</td>
                                </tr>
                              ))}
                              {filterProjectListByRange(apt.projectlist).length > 3 && (
                                <tr>
                                  <td colSpan={7} className="text-xl sm:text-2xl text-gray-700 font-extrabold text-center">...</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <Link href={`/fr/DesignTest/Detail/${apt.id}`} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:rotate-90 flex items-center justify-center">
                          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
