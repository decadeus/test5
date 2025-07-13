"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Slider, Dialog } from "@mui/material";
import { useTranslations } from "next-intl";
import { useDebounce } from "use-debounce";
import { useSwipeable } from "react-swipeable";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { MapPin } from "lucide-react";

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
  const { data, error } = await supabase.storage
    .from("project")
    .list(`${projectId}/`, { limit: 1, offset: 0 });
  if (error || !data || data.length === 0) return null;
  // Prend la première image trouvée
  const file = data[0];
  return supabase.storage
    .from("project")
    .getPublicUrl(`${projectId}/${file.name}`).data.publicUrl;
}

// Fonction utilitaire pour récupérer toutes les images image1- à image5- d'un projet
async function getProjectImages(supabase, projectId) {
  const { data, error } = await supabase.storage
    .from("project")
    .list(`${projectId}/`, { limit: 20, offset: 0 });
  if (error || !data) return [];
  // Filtre les images image1- à image5-
  const wanted = ["image1-", "image2-", "image3-", "image4-", "image5-"];
  return data
    .filter((file) => wanted.some((prefix) => file.name.startsWith(prefix)))
    .map(
      (file) =>
        supabase.storage
          .from("project")
          .getPublicUrl(`${projectId}/${file.name}`).data.publicUrl
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
  showLotsTable,
  favorites,
  handleToggleFavorite,
  isFavorite,
  showProjectButton = true,
}) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      handleNextImage(apt.id, (projectImages[apt.id] || []).length),
    onSwipedRight: () =>
      handlePrevImage(apt.id, (projectImages[apt.id] || []).length),
  });
  return (
    <div
      key={apt.id}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group flex flex-col w-full"
    >
      <div className="relative">
        <Image
          src={
            (projectImages[apt.id] && projectImages[apt.id].length > 0
              ? projectImages[apt.id]
              : ["/components/image/placeholder.jpg"])[
              currentImageIndexes[apt.id] || 0
            ]
          }
          alt={apt.title}
          width={320}
          height={180}
          priority
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {filterProjectListByRange(apt.projectlist).length}{" "}
          {tGlobal(
            filterProjectListByRange(apt.projectlist).length > 1
              ? "Appartements"
              : "Appartement"
          )}
        </span>
        <button
          onClick={() => handleToggleFavorite(apt)}
          className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white transition border-2 border-green-200"
          aria-label="favorite"
        >
          {isFavorite(apt) ? (
            <FaHeart className="text-green-600" size={22} />
          ) : (
            <FaRegHeart className="text-green-600" size={22} />
          )}
        </button>
      </div>
      <div className="p-5 flex flex-col h-full gap-2 flex-1">
        <h3 className="text-lg font-bold text-gray-900">
          {highlight(apt.title, debouncedSearchTerm)}
        </h3>
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{apt.city}</span>
        </div>
        <span className="text-xs text-gray-400 italic">
          by{" "}
          {apt.compagny && apt.compagny !== "null"
            ? apt.compagny
            : "Non renseigné"}
        </span>
        {showProjectButton && (
          <button className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition">
            <Link
              href={`/${locale}/Projet/Detail/${apt.id}`}
              className="flex items-center gap-2 w-full h-full justify-center"
            >
              {t("Voir le détail")}
              <PlusIcon className="w-4 h-4" />
            </Link>
          </button>
        )}
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

// Ajout gestion favoris locale
const NEW_FAVORITE_APARTMENTS_KEY = "favoriteApartments";

function ProjectSidePanel({ project, onClose, ...props }) {
  if (!project) return null;
  return (
    <div className="relative bg-white  rounded-xl p-2 w-full max-w-xs flex flex-col gap-2 ">
      <ApartmentCard
        apt={project}
        projectImages={props.projectImages}
        currentImageIndexes={props.currentImageIndexes}
        handleNextImage={props.handleNextImage}
        handlePrevImage={props.handlePrevImage}
        isChangingImage={props.isChangingImage}
        setIsChangingImage={props.setIsChangingImage}
        highlight={props.highlight}
        debouncedSearchTerm={props.debouncedSearchTerm}
        filterProjectListByRange={props.filterProjectListByRange}
        formatPrice={props.formatPrice}
        t={props.t}
        showAllLots={props.showAllLots}
        setShowAllLots={props.setShowAllLots}
        locale={props.locale}
        tGlobal={props.tGlobal}
        showLotsTable={props.showLotsTable}
        favorites={props.favorites}
        handleToggleFavorite={props.handleToggleFavorite}
        isFavorite={props.isFavorite}
        showProjectButton={true}
      />
    </div>
  );
}

function ApartmentCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-lg animate-pulse flex flex-col min-w-[260px] max-w-[340px] w-full overflow-hidden">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="h-8 w-full bg-gray-200 rounded-xl mt-2" />
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
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showAllLots, setShowAllLots] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState({});
  const [viewMode, setViewMode] = useState("list");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "fr";
  const defaultFilters = {
    selectedCountry: "France", // Ajout du filtre pays par défaut
    selectedCity: t("Tous"),
    searchTerm: "",
    priceRange: [100000, 5000000],
    bedRange: [1, 5],
    surfaceRange: [10, 200],
    onlyGarden: false,
    onlyRooftop: false,
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedSearchTerm] = useDebounce(filters.searchTerm, 300);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [justUnselectedGarden, setJustUnselectedGarden] = useState(false);
  const [justUnselectedRooftop, setJustUnselectedRooftop] = useState(false);
  const [justUnselectedFavorites, setJustUnselectedFavorites] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const PAGE_SIZE = 12;
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ajout : liste des pays distincts
  const countries = useMemo(() => {
    return [
      ...new Set(apartments.map((a) => a.country).filter(Boolean)),
    ].sort();
  }, [apartments]);
  // Ajout : liste des villes du pays sélectionné
  const cities = useMemo(() => {
    return [
      t("Tous"),
      ...[
        ...new Set(
          apartments
            .filter((a) => a.country === filters.selectedCountry)
            .map((a) => a.city)
        ),
      ].sort(),
    ];
  }, [apartments, filters.selectedCountry, t]);

  // --- RESTORE PATCH : min/max initiaux stockés au premier fetch, sliders stables ---
  const [minMaxValuesInitial, setMinMaxValuesInitial] = useState(null);

  function getMinMaxValuesFromList(list) {
    let minPrice = Infinity,
      maxPrice = -Infinity;
    let minBed = Infinity,
      maxBed = -Infinity;
    let minSurface = Infinity,
      maxSurface = -Infinity;
    list.forEach((apt) => {
      apt.projectlist?.forEach((lot) => {
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
      maxSurface: maxSurface === -Infinity ? 200 : maxSurface,
    };
  }

  useEffect(() => {
    setFilteredCities(cities);
  }, [cities]);

  // 2. Initialiser les filtres depuis le localStorage au montage
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("filters");
      if (saved) {
        setFilters(JSON.parse(saved));
      }
    }
  }, []);

  // 3. Fonction générique pour modifier les filtres
  function updateFilter(key, value) {
    setFilters((prev) => {
      const newValue = typeof value === "function" ? value(prev[key]) : value;
      const updated = { ...prev, [key]: newValue };
      if (typeof window !== "undefined") {
        localStorage.setItem("filters", JSON.stringify(updated));
      }
      return updated;
    });
  }

  // 4. Réinitialiser tous les filtres proprement
  function resetFilters() {
    setFilters(defaultFilters);
    if (typeof window !== "undefined") {
      localStorage.setItem("filters", JSON.stringify(defaultFilters));
    }
  }

  // 5. Réinitialiser la ville à chaque changement de langue ou de pays
  useEffect(() => {
    updateFilter("selectedCity", t("Tous"));
  }, [locale, t, filters.selectedCountry]);

  // 6. Utiliser les filtres dans le filtrage
  const getMinMaxValues = () => {
    let minPrice = Infinity,
      maxPrice = -Infinity;
    let minBed = Infinity,
      maxBed = -Infinity;
    let minSurface = Infinity,
      maxSurface = -Infinity;
    apartments.forEach((apt) => {
      apt.projectlist?.forEach((lot) => {
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
      maxSurface: maxSurface === -Infinity ? 200 : maxSurface,
    };
  };
  const minMaxValues = useMemo(() => getMinMaxValues(), [apartments]);

  // 7. Utiliser les filtres dans le filtrage
  const hasProjectListInRange = (project) => {
    if (!project.projectlist || project.projectlist.length === 0) return false;
    return project.projectlist.some((lot) => {
      const lotPrice = parseFloat(lot.price);
      const lotBed = parseInt(lot.bed);
      const lotSurface = parseFloat(lot.surface);
      const hasGarden =
        !!lot.garden &&
        String(lot.garden) !== "0" &&
        String(lot.garden).toLowerCase() !== "false";
      const hasRooftop =
        !!lot.rooftop &&
        String(lot.rooftop) !== "0" &&
        String(lot.rooftop).toLowerCase() !== "false";
      return (
        lotPrice >= filters.priceRange[0] &&
        lotPrice <= filters.priceRange[1] &&
        lotBed >= filters.bedRange[0] &&
        lotBed <= filters.bedRange[1] &&
        lotSurface >= filters.surfaceRange[0] &&
        lotSurface <= filters.surfaceRange[1] &&
        (!filters.onlyGarden || hasGarden) &&
        (!filters.onlyRooftop || hasRooftop)
      );
    });
  };
  const filterProjectListByRange = (projectlist) => {
    if (!projectlist) return [];
    return projectlist.filter((lot) => {
      const lotPrice = parseFloat(lot.price);
      const lotBed = parseInt(lot.bed);
      const lotSurface = parseFloat(lot.surface);
      const hasGarden =
        !!lot.garden &&
        String(lot.garden) !== "0" &&
        String(lot.garden).toLowerCase() !== "false";
      const hasRooftop =
        !!lot.rooftop &&
        String(lot.rooftop) !== "0" &&
        String(lot.rooftop).toLowerCase() !== "false";
      return (
        lotPrice >= filters.priceRange[0] &&
        lotPrice <= filters.priceRange[1] &&
        lotBed >= filters.bedRange[0] &&
        lotBed <= filters.bedRange[1] &&
        lotSurface >= filters.surfaceRange[0] &&
        lotSurface <= filters.surfaceRange[1] &&
        (!filters.onlyGarden || hasGarden) &&
        (!filters.onlyRooftop || hasRooftop)
      );
    });
  };
  const filteredApartments = apartments.filter((a) => {
    const matchesCountry = a.country === filters.selectedCountry;
    const matchesCity =
      filters.selectedCity === t("Tous") || a.city === filters.selectedCity;
    const matchesSearch =
      a.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesRange = hasProjectListInRange(a);
    const matchesFavorite = !showOnlyFavorites || favorites.includes(a.id);
    return (
      matchesCountry &&
      matchesCity &&
      matchesSearch &&
      matchesRange &&
      matchesFavorite
    );
  });

  // Pour la carte : on veut tous les projets du pays et de la ville sélectionnée
  const apartmentsForMap = apartments.filter(
    (a) =>
      a.country === filters.selectedCountry &&
      (filters.selectedCity === t("Tous") || a.city === filters.selectedCity)
  );

  // Ajout un effet pour reset la pagination à chaque changement de filtre
  useEffect(() => {
    setPageIndex(0);
    setApartments([]);
    setHasMore(true);
  }, [filters]);

  // Remplace le useEffect de fetchProjects par une version paginée
  useEffect(() => {
    const fetchProjects = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const from = pageIndex * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        let query = supabase
          .from("project")
          .select("id, name, compagny, country, city, lat, lng, online");
        // Filtres côté serveur
        if (filters.selectedCountry) {
          query = query.eq("country", filters.selectedCountry);
        }
        if (filters.selectedCity && filters.selectedCity !== t("Tous")) {
          query = query.eq("city", filters.selectedCity);
        }
        if (filters.searchTerm && filters.searchTerm.length > 0) {
          query = query.ilike("name", `%${filters.searchTerm}%`);
        }
        query = query.range(from, to);
        const { data: projects, error: errorProjects } = await query;
        // Filtre pour ne garder que les projets en ligne
        const onlineProjects = (projects || []).filter(
          (item) => item.online === true
        );
        // Récupère les projectlists pour ces projets
        const projectIds = onlineProjects.map((p) => p.id);
        const { data: projectlists, error: errorProjectlists } = await supabase
          .from("projectlist")
          .select("ide, ref, bed, floor, price, surface, garden, rooftop, des");
        if (errorProjects || errorProjectlists) {
          setError(errorProjects || errorProjectlists);
          setIsLoading(false);
          return;
        }
        // Associe les projectlists à leur projet parent
        const apartmentsWithList = (onlineProjects || []).map((item) => ({
          id: item.id,
          title: item.name,
          compagny: item.compagny,
          summary: item.compagny,
          price: item.country,
          city: item.city,
          imageUrl: "/images/placeholder.jpg",
          projectlist: (projectlists || []).filter((pl) => pl.ide === item.id),
          lat: item.lat,
          lng: item.lng,
        }));
        // --- RESTORE PATCH : min/max initiaux stockés au premier fetch, sliders stables ---
        if (!minMaxValuesInitial && apartmentsWithList.length > 0) {
          setMinMaxValuesInitial(getMinMaxValuesFromList(apartmentsWithList));
        }
        setApartments((prev) =>
          pageIndex === 0
            ? apartmentsWithList
            : [...prev, ...apartmentsWithList]
        );
        // Images (optionnel, tu peux optimiser pour ne charger que les images des nouveaux projets)
        const imagesObj = {};
        await Promise.all(
          apartmentsWithList.map(async (apt) => {
            const urls = await getProjectImages(supabase, apt.id);
            if (urls.length > 0) imagesObj[apt.id] = urls;
          })
        );
        setProjectImages((prev) => ({ ...prev, ...imagesObj }));
        if ((projects || []).length < PAGE_SIZE) setHasMore(false);
      } catch (e) {
        setError(e.message || "Erreur inconnue");
      }
      setIsLoading(false);
    };
    fetchProjects();
    // eslint-disable-next-line
  }, [pageIndex, filters]);

  // Chargement favoris au montage
  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem(NEW_FAVORITE_APARTMENTS_KEY)) || [];
    setFavorites(storedFavorites);
  }, []);

  // Fonction toggle favori
  const handleToggleFavorite = (apt) => {
    const itemId = apt.id;
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem(
      NEW_FAVORITE_APARTMENTS_KEY,
      JSON.stringify(newFavorites)
    );
  };
  const isFavorite = (apt) => favorites.includes(apt.id);

  // Highlight du texte recherché
  function highlight(text, term) {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  // Pagination des résultats filtrés
  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageCount = Math.ceil(filteredApartments.length / itemsPerPage);

  // Fonction pour passer à l'image suivante d'un appartement
  const handleNextImage = (aptId, totalImages) => {
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) + 1) % totalImages,
    }));
  };

  // Fonction pour passer à l'image précédente d'un appartement
  const handlePrevImage = (aptId, totalImages) => {
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [aptId]: ((prev[aptId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    setShowCityDropdown(true);
    if (value === "") {
      updateFilter("selectedCity", t("Tous"));
      setFilteredCities(cities);
    } else {
      setFilteredCities(
        cities.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    }
  };
  const handleCitySelect = (city) => {
    updateFilter("selectedCity", city);
    setCityInput(city);
    setShowCityDropdown(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".city-autocomplete")) {
        setShowCityDropdown(false);
      }
    }
    if (showCityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCityDropdown]);

  // Helper pour trouver le pays d'une ville
  const getCountryForCity = (city) => {
    if (city === t("Tous")) return "";
    const found = apartments.find(
      (a) => a.city === city && a.country === filters.selectedCountry
    );
    return found ? found.country : "";
  };

  // Afficher la dropdown seulement si l'utilisateur a tapé au moins une lettre et qu'il y a des résultats
  const shouldShowCityDropdown =
    showCityDropdown && cityInput.length > 0 && filteredCities.length > 0;

  // Ajout du log pour tracer le fetch
  useEffect(() => {
    console.log("[ApartmentList] Initial apartments:", apartments);
  }, []);

  // Ajout du log après chaque setApartments
  useEffect(() => {
    console.log("[ApartmentList] apartments updated:", apartments);
  }, [apartments]);

  // Dans le render, avant le return
  console.log("[ApartmentList] apartments in render:", apartments);

  // --- RESTORE PATCH : min/max initiaux stockés au premier fetch, sliders stables ---
  // 1. Récupérer tous les lots du pays/ville sélectionnés (avant filtrage par sliders)
  const allLotsForSliders = useMemo(() => {
    let lots = [];
    apartments.forEach((apt) => {
      lots = lots.concat(apt.projectlist || []);
    });
    return lots;
  }, [apartments]);

  // 2. Calculer les min/max globaux à partir de allLotsForSliders
  const globalSliderBounds = useMemo(() => {
    let minPrice = Infinity,
      maxPrice = -Infinity;
    let minBed = Infinity,
      maxBed = -Infinity;
    let minSurface = Infinity,
      maxSurface = -Infinity;
    allLotsForSliders.forEach((lot) => {
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
    return {
      minPrice: minPrice === Infinity ? 100000 : minPrice,
      maxPrice: maxPrice === -Infinity ? 5000000 : maxPrice,
      minBed: minBed === Infinity ? 1 : minBed,
      maxBed: maxBed === -Infinity ? 5 : maxBed,
      minSurface: minSurface === Infinity ? 10 : minSurface,
      maxSurface: maxSurface === -Infinity ? 200 : maxSurface,
    };
  }, [allLotsForSliders]);

  // --- RESTORE PATCH : min/max initiaux stockés au premier fetch, sliders stables ---
  // 1. Récupérer tous les lots filtrés selon les filtres actuels
  const filteredLots = useMemo(() => {
    let lots = [];
    apartments.forEach((apt) => {
      lots = lots.concat(
        apt.projectlist?.filter((lot) => {
          const lotPrice = parseFloat(lot.price);
          const lotBed = parseInt(lot.bed);
          const lotSurface = parseFloat(lot.surface);
          const hasGarden =
            !!lot.garden &&
            String(lot.garden) !== "0" &&
            String(lot.garden).toLowerCase() !== "false";
          const hasRooftop =
            !!lot.rooftop &&
            String(lot.rooftop) !== "0" &&
            String(lot.rooftop).toLowerCase() !== "false";
          return (
            lotPrice >= filters.priceRange[0] &&
            lotPrice <= filters.priceRange[1] &&
            lotBed >= filters.bedRange[0] &&
            lotBed <= filters.bedRange[1] &&
            lotSurface >= filters.surfaceRange[0] &&
            lotSurface <= filters.surfaceRange[1] &&
            (!filters.onlyGarden || hasGarden) &&
            (!filters.onlyRooftop || hasRooftop)
          );
        }) || []
      );
    });
    return lots;
  }, [apartments, filters]);

  // 2. Calculer les min/max à partir de filteredLots
  const dynamicSliderBounds = useMemo(() => {
    let minPrice = Infinity,
      maxPrice = -Infinity;
    let minBed = Infinity,
      maxBed = -Infinity;
    let minSurface = Infinity,
      maxSurface = -Infinity;
    filteredLots.forEach((lot) => {
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
    return {
      minPrice: minPrice === Infinity ? filters.priceRange[0] : minPrice,
      maxPrice: maxPrice === -Infinity ? filters.priceRange[1] : maxPrice,
      minBed: minBed === Infinity ? filters.bedRange[0] : minBed,
      maxBed: maxBed === -Infinity ? filters.bedRange[1] : maxBed,
      minSurface:
        minSurface === Infinity ? filters.surfaceRange[0] : minSurface,
      maxSurface:
        maxSurface === -Infinity ? filters.surfaceRange[1] : maxSurface,
    };
  }, [filteredLots, filters]);

  // State pour tous les projets filtrés (non paginés, pour le résumé)
  const [allFilteredProjects, setAllFilteredProjects] = useState([]);

  // Fetch séparé pour tous les projets filtrés (pour le résumé)
  useEffect(() => {
    const fetchAllFilteredProjects = async () => {
      let query = supabase
        .from("project")
        .select("id, name, compagny, country, city, lat, lng, online");
      if (filters.selectedCountry) {
        query = query.eq("country", filters.selectedCountry);
      }
      if (filters.selectedCity && filters.selectedCity !== t("Tous")) {
        query = query.eq("city", filters.selectedCity);
      }
      if (filters.searchTerm && filters.searchTerm.length > 0) {
        query = query.ilike("name", `%${filters.searchTerm}%`);
      }
      const { data: projects, error: errorProjects } = await query;
      const onlineProjects = (projects || []).filter(
        (item) => item.online === true
      );
      // Récupère les projectlists pour ces projets
      const { data: projectlists, error: errorProjectlists } = await supabase
        .from("projectlist")
        .select("ide, ref, bed, floor, price, surface, garden, rooftop, des");
      if (errorProjects || errorProjectlists) {
        setAllFilteredProjects([]);
        return;
      }
      // Associe les projectlists à leur projet parent
      const projectsWithList = (onlineProjects || []).map((item) => ({
        id: item.id,
        title: item.name,
        compagny: item.compagny,
        summary: item.compagny,
        price: item.country,
        city: item.city,
        imageUrl: "/images/placeholder.jpg",
        projectlist: (projectlists || []).filter((pl) => pl.ide === item.id),
        lat: item.lat,
        lng: item.lng,
      }));
      setAllFilteredProjects(projectsWithList);
    };
    fetchAllFilteredProjects();
    // eslint-disable-next-line
  }, [filters]);

  // Calcul du total projets (projets avec au moins un lot filtré)
  const totalFilteredProjects = allFilteredProjects.filter(
    (apt) => filterProjectListByRange(apt.projectlist).length > 0
  ).length;
  // Calcul du nombre de compagnies (compagnies avec au moins un projet affiché)
  const totalFilteredCompanies = useMemo(() => {
    const set = new Set(
      allFilteredProjects
        .filter((apt) => filterProjectListByRange(apt.projectlist).length > 0)
        .map((apt) => apt.compagny)
        .filter(Boolean)
    );
    return set.size;
  }, [allFilteredProjects, filterProjectListByRange]);
  const totalFilteredAppartments = useMemo(() => {
    return allFilteredProjects.reduce(
      (acc, apt) => acc + filterProjectListByRange(apt.projectlist).length,
      0
    );
  }, [allFilteredProjects, filterProjectListByRange]);

  if (!isHydrated) return null;
  return (
    <>
      <div className="bg-green-100/10 min-h-screen w-full pt-16">
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
        <Dialog
          open={showFilters}
          onClose={() => setShowFilters(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              borderRadius: 24,
              padding: 0,
              background: "white",
              minHeight: "auto",
            },
          }}
        >
          <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">{t("Filtre")}</span>
              <button
                onClick={() => setShowFilters(false)}
                className="text-green-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            {/* Filtres ville + recherche */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 whitespace-nowrap overflow-x-auto pb-2 w-full">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      updateFilter("selectedCountry", country);
                      updateFilter("selectedCity", t("Tous"));
                    }}
                    aria-pressed={filters.selectedCountry === country}
                    className={`h-10 px-3 border-2 border-black rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                      filters.selectedCountry === country
                        ? "bg-green-600 text-white"
                        : "bg-white text-black hover:bg-green-600 hover:text-white"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {/* --- VERSION MOBILE (dans le Dialog) --- */}
              <div className="relative city-autocomplete">
                <input
                  type="text"
                  value={cityInput}
                  onChange={handleCityInputChange}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder={t("Ville")}
                  className="h-10 w-full pl-3 text-left border-2 border-black rounded-full text-sm font-semibold text-gray-500 placeholder:text-black/50 placeholder:font-semibold"
                />
                {shouldShowCityDropdown && (
                  <ul className="z-10 bg-white border border-gray-300 rounded-2xl mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                    {filteredCities.map((city, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${city === filters.selectedCity ? "bg-gray-200 font-bold" : ""}`}
                        onClick={() => handleCitySelect(city)}
                      >
                        <MdLocationOn className="text-green-600 text-lg min-w-[20px]" />
                        <span className="font-bold text-black">{city}</span>
                        {getCountryForCity(city) && (
                          <span className="ml-1 text-gray-400 text-sm">
                            {getCountryForCity(city)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Sliders */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Prix")}</span>
                  <span className="text-xs font-semibold text-black">
                    {formatPrice(filters.priceRange[0])} -{" "}
                    {formatPrice(filters.priceRange[1])}
                  </span>
                </div>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, v) => updateFilter("priceRange", v)}
                  valueLabelDisplay="off"
                  min={minMaxValuesInitial?.minPrice ?? minMaxValues.minPrice}
                  max={minMaxValuesInitial?.maxPrice ?? minMaxValues.maxPrice}
                  step={10000}
                  sx={{
                    color: "#16a34a",
                    height: 4,
                    px: 1,
                    borderRadius: "9999px",
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    "& .MuiSlider-thumb": {
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      border: "2.5px solid #111",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.10)",
                    },
                    "& .MuiSlider-track": {
                      border: "none",
                      background: "#16a34a",
                      height: 4,
                      borderRadius: "9999px",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "white",
                      border: "2px solid #111",
                      opacity: 1,
                      height: 4,
                      borderRadius: "9999px",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Chambres")}</span>
                  <span className="text-xs font-semibold text-black">
                    {filters.bedRange[0]} - {filters.bedRange[1]}
                  </span>
                </div>
                <Slider
                  value={filters.bedRange}
                  onChange={(_, v) => updateFilter("bedRange", v)}
                  valueLabelDisplay="off"
                  min={minMaxValuesInitial?.minBed ?? minMaxValues.minBed}
                  max={minMaxValuesInitial?.maxBed ?? minMaxValues.maxBed}
                  step={1}
                  sx={{
                    color: "#16a34a",
                    height: 4,
                    px: 1,
                    borderRadius: "9999px",
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    "& .MuiSlider-thumb": {
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      border: "2.5px solid #111",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.10)",
                    },
                    "& .MuiSlider-track": {
                      border: "none",
                      background: "#16a34a",
                      height: 4,
                      borderRadius: "9999px",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "white",
                      border: "2px solid #111",
                      opacity: 1,
                      height: 4,
                      borderRadius: "9999px",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white/90 p-1.5 shadow-lg px-3 border-2 border-black rounded-full flex flex-row justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{t("Surface")}</span>
                  <span className="text-xs font-semibold text-black">
                    {filters.surfaceRange[0]} - {filters.surfaceRange[1]}
                  </span>
                </div>
                <Slider
                  value={filters.surfaceRange}
                  onChange={(_, v) => updateFilter("surfaceRange", v)}
                  valueLabelDisplay="off"
                  min={
                    minMaxValuesInitial?.minSurface ?? minMaxValues.minSurface
                  }
                  max={
                    minMaxValuesInitial?.maxSurface ?? minMaxValues.maxSurface
                  }
                  step={1}
                  sx={{
                    color: "#16a34a",
                    height: 4,
                    px: 1,
                    borderRadius: "9999px",
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    "& .MuiSlider-thumb": {
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      border: "2.5px solid #111",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.10)",
                    },
                    "& .MuiSlider-track": {
                      border: "none",
                      background: "#16a34a",
                      height: 4,
                      borderRadius: "9999px",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "white",
                      border: "2px solid #111",
                      opacity: 1,
                      height: 4,
                      borderRadius: "9999px",
                    },
                  }}
                />
              </div>
            </div>
            {/* Filtres Jardin, Rooftop, Favoris */}
            <div className="hidden md:flex lg:hidden w-full justify-center gap-4 mt-4">
              <button
                onClick={(e) => {
                  updateFilter("onlyGarden", (v) => {
                    if (v) setJustUnselectedGarden(true);
                    return !v;
                  });
                  e.currentTarget.blur();
                }}
                onMouseLeave={() => setJustUnselectedGarden(false)}
                aria-pressed={filters.onlyGarden}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${filters.onlyGarden ? "bg-green-600 text-white" : "bg-white text-black"} ${!filters.onlyGarden && !justUnselectedGarden ? "hover:bg-green-600 hover:text-white" : ""}`}
              >
                <span>{t("AvecJardin")}</span>
                <span>🌸</span>
              </button>
              <button
                onClick={(e) => {
                  updateFilter("onlyRooftop", (v) => {
                    if (v) setJustUnselectedRooftop(true);
                    return !v;
                  });
                  e.currentTarget.blur();
                }}
                onMouseLeave={() => setJustUnselectedRooftop(false)}
                aria-pressed={filters.onlyRooftop}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${filters.onlyRooftop ? "bg-green-600 text-white" : "bg-white text-black"} ${!filters.onlyRooftop && !justUnselectedRooftop ? "hover:bg-green-600 hover:text-white" : ""}`}
              >
                <span>{t("Rooftop")}</span>
                <span>🏙️</span>
              </button>
              <button
                onClick={(e) => {
                  setShowOnlyFavorites((v) => {
                    if (v) setJustUnselectedFavorites(true);
                    return !v;
                  });
                  e.currentTarget.blur();
                }}
                onMouseLeave={() => setJustUnselectedFavorites(false)}
                aria-pressed={showOnlyFavorites}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black font-semibold transition-colors duration-200 text-sm ${showOnlyFavorites ? "bg-green-600 text-white" : "bg-white text-black"} ${!showOnlyFavorites && !justUnselectedFavorites ? "hover:bg-green-600 hover:text-white" : ""}`}
              >
                {showOnlyFavorites ? (
                  <FaHeart className="text-red-600" />
                ) : (
                  <FaRegHeart className="text-gray-400" />
                )}
                <span>{t("MesFavoris")}</span>
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
        {/* Filtres inline desktop - version pro épurée avec fond d'écran */}
        <div
          className="hidden sm:block w-full h-[440px] bg-cover bg-center mb-8 shadow-md relative"
          style={{ backgroundImage: "url(/newheader.png)" }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10 z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-6 pt-16">
            <div className="flex items-center gap-8 w-full py-8 border-b-2 border-black bg-white/60 rounded-xl shadow-sm backdrop-blur-md relative z-10 min-h-[100px]">
              {/* Ville */}
              <div className="relative city-autocomplete flex items-center min-w-[180px] pl-4">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={cityInput}
                  onChange={handleCityInputChange}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder={t("Ville")}
                  className="bg-transparent border-none outline-none text-lg font-normal w-32 focus:w-48 transition-all duration-200 pl-3"
                />
                {shouldShowCityDropdown && (
                  <ul className="z-30 bg-white border border-gray-300 rounded-2xl mt-1 w-48 max-h-48 overflow-y-auto shadow-lg absolute top-24 left-0">
                    {filteredCities.map((city, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${city === filters.selectedCity ? "bg-gray-200 font-bold" : ""}`}
                        onClick={() => handleCitySelect(city)}
                      >
                        <MdLocationOn className="text-green-600 text-lg min-w-[20px]" />
                        <span className="font-bold text-black">{city}</span>
                        {getCountryForCity(city) && (
                          <span className="ml-1 text-gray-400 text-sm">
                            {getCountryForCity(city)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="lg:flex lg:flex-row flex-col items-center gap-8">
                <div className="flex items-center gap-4 w-full">
                {/* Prix */}
                <div className="flex flex-col items-start min-w-[180px]">
                  <span className="text-sm text-gray-700 font-normal mb-1">
                    {t("Prix")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {formatPrice(filters.priceRange[0])}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-base font-semibold">
                      {formatPrice(filters.priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={filters.priceRange}
                    onChange={(_, v) => updateFilter("priceRange", v)}
                    valueLabelDisplay="off"
                    min={minMaxValuesInitial?.minPrice ?? minMaxValues.minPrice}
                    max={minMaxValuesInitial?.maxPrice ?? minMaxValues.maxPrice}
                    step={10000}
                    sx={{
                      color: "#111",
                      height: 2,
                      px: 0,
                      borderRadius: 0,
                      background: "transparent",
                      boxShadow: "none",
                      border: "none",
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#111",
                        border: "2px solid #fff",
                        boxShadow: "none",
                      },
                      "& .MuiSlider-track": {
                        border: "none",
                        background: "#111",
                        height: 2,
                        borderRadius: 0,
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#e5e7eb",
                        border: "none",
                        opacity: 1,
                        height: 2,
                        borderRadius: 0,
                      },
                    }}
                  />
                </div>
                {/* Chambres */}
                <div className="flex flex-col items-start min-w-[120px]">
                  <span className="text-sm text-gray-700 font-normal mb-1">
                    {t("Chambres")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {filters.bedRange[0]}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-base font-semibold">
                      {filters.bedRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={filters.bedRange}
                    onChange={(_, v) => updateFilter("bedRange", v)}
                    valueLabelDisplay="off"
                    min={minMaxValuesInitial?.minBed ?? minMaxValues.minBed}
                    max={minMaxValuesInitial?.maxBed ?? minMaxValues.maxBed}
                    step={1}
                    sx={{
                      color: "#111",
                      height: 2,
                      px: 0,
                      borderRadius: 0,
                      background: "transparent",
                      boxShadow: "none",
                      border: "none",
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#111",
                        border: "2px solid #fff",
                        boxShadow: "none",
                      },
                      "& .MuiSlider-track": {
                        border: "none",
                        background: "#111",
                        height: 2,
                        borderRadius: 0,
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#e5e7eb",
                        border: "none",
                        opacity: 1,
                        height: 2,
                        borderRadius: 0,
                      },
                    }}
                  />
                </div>
                {/* Surface */}
                <div className="flex flex-col items-start min-w-[120px]">
                  <span className="text-sm text-gray-700 font-normal mb-1">
                    {t("Surface")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {filters.surfaceRange[0]}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-base font-semibold">
                      {filters.surfaceRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={filters.surfaceRange}
                    onChange={(_, v) => updateFilter("surfaceRange", v)}
                    valueLabelDisplay="off"
                    min={
                      minMaxValuesInitial?.minSurface ?? minMaxValues.minSurface
                    }
                    max={
                      minMaxValuesInitial?.maxSurface ?? minMaxValues.maxSurface
                    }
                    step={1}
                    sx={{
                      color: "#111",
                      height: 2,
                      px: 0,
                      borderRadius: 0,
                      background: "transparent",
                      boxShadow: "none",
                      border: "none",
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#111",
                        border: "2px solid #fff",
                        boxShadow: "none",
                      },
                      "& .MuiSlider-track": {
                        border: "none",
                        background: "#111",
                        height: 2,
                        borderRadius: 0,
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#e5e7eb",
                        border: "none",
                        opacity: 1,
                        height: 2,
                        borderRadius: 0,
                      },
                    }}
                  />
                </div>
                </div>
                {/* Filtres secondaires */}
                <div className="flex items-center justify-center gap-4 w-full">
                <button
                  onClick={(e) => {
                    updateFilter("onlyGarden", (v) => {
                      if (v) setJustUnselectedGarden(true);
                      return !v;
                    });
                    e.currentTarget.blur();
                  }}
                  onMouseLeave={() => setJustUnselectedGarden(false)}
                  aria-pressed={filters.onlyGarden}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full font-medium text-[15px] border transition-all duration-200 whitespace-nowrap
                  ${
                    filters.onlyGarden
                      ? "bg-green-600 text-white border-green-700 shadow-md"
                      : "bg-white/60 text-black border-gray-300 hover:bg-green-100"
                  }
                `}
                >
                  <span>🌸</span>
                  <span>{t("AvecJardin")}</span>
                </button>
                <button
                  onClick={(e) => {
                    updateFilter("onlyRooftop", (v) => {
                      if (v) setJustUnselectedRooftop(true);
                      return !v;
                    });
                    e.currentTarget.blur();
                  }}
                  onMouseLeave={() => setJustUnselectedRooftop(false)}
                  aria-pressed={filters.onlyRooftop}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full font-medium text-[15px] border transition-all duration-200 whitespace-nowrap
                  ${
                    filters.onlyRooftop
                      ? "bg-blue-600 text-white border-blue-700 shadow-md"
                      : "bg-white/60 text-black border-gray-300 hover:bg-blue-100"
                  }
                `}
                >
                  <span>🏙️</span>
                  <span>{t("Rooftop")}</span>
                </button>
                <button
                  onClick={(e) => {
                    setShowOnlyFavorites((v) => {
                      if (v) setJustUnselectedFavorites(true);
                      return !v;
                    });
                    e.currentTarget.blur();
                  }}
                  onMouseLeave={() => setJustUnselectedFavorites(false)}
                  aria-pressed={showOnlyFavorites}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full font-normal text-base border-none bg-white hover:underline transition-colors duration-200 ${showOnlyFavorites ? "text-red-700" : "text-black"}`}
                >
                  {showOnlyFavorites ? (
                    <FaHeart className="text-red-600" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                  <span>{t("MesFavoris")}</span>
                </button>
                </div>
              </div>
            </div>
            {/* Résumé dans la zone blanche */}
            <div className="w-full flex flex-col items-center justify-center py-8 mt-4">
              <span className="text-3xl font-extrabold text-gray-800">
                {tGlobal("Compagnies")}: {totalFilteredCompanies} |{" "}
                {tGlobal("Projets")}: {totalFilteredProjects} |{" "}
                {tGlobal("Appartements")}: {totalFilteredAppartments}
              </span>
            </div>
          </div>
        </div>

        {/* Affichage du total projets, appartements et compagnies filtrés (desktop uniquement) */}
        {/* <div className="w-full flex flex-col items-center justify-center my-4">
          <span className="text-base font-semibold text-gray-700">
            {tGlobal('Projets')}: {totalFilteredProjects} | {tGlobal('Appartements')}: {totalFilteredAppartments} | {tGlobal('Compagnies')}: {totalFilteredCompanies}
          </span>
        </div> */}

        <div className="flex justify-center mb-8 mt-4">
          <div className="bg-white rounded-full p-1 shadow-lg border-2 border-gray-200 flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              📋 {t("Vue Liste")}
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              🗺️ {t("Vue Carte")}
            </button>
          </div>
        </div>

        {/* Sticky filters desktop */}
        <div className="sticky top-0 z-20 py-2 fade-in">
          {/* Filtres actifs (chips) */}
          {/* ... */}
        </div>

        {/* Loader animé */}
        {apartments.length === 0 && !error && (
          <div className="flex justify-center items-center h-32">
            <svg
              className="animate-spin h-8 w-8 text-green-600"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </div>
        )}
        {/* Message d'erreur */}
        {error && (
          <div className="text-center text-red-600 font-semibold my-4">
            {t("Erreur de chargement.")}{" "}
            <button
              onClick={() => window.location.reload()}
              className="underline"
            >
              {t("Réessayer")}
            </button>
          </div>
        )}

        {/* Grille des appartements avec animation d'apparition - remplacée par slider par ville */}
        {viewMode === "list" ? (
          <div className="fade-in max-w-7xl mx-auto pt-8 px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ApartmentCardSkeleton key={i} />
                ))
              ) : !isLoading && apartments.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">
                  {t("Aucun résultat")}
                </p>
              ) : (
                apartments
                  .filter(
                    (apt) => !showOnlyFavorites || favorites.includes(apt.id)
                  )
                  .filter(
                    (apt) =>
                      filterProjectListByRange(apt.projectlist).length > 0
                  )
                  .map((apt) => (
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
                      showLotsTable={false}
                      favorites={favorites}
                      handleToggleFavorite={handleToggleFavorite}
                      isFavorite={isFavorite}
                      showProjectButton={true}
                    />
                  ))
              )}
            </div>
            {hasMore && !isLoading && (
              <div className="flex justify-center mt-8 mb-8">
                <button
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow transition"
                  onClick={() => setPageIndex((c) => c + 1)}
                >
                  Montrez plus
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row  max-w-7xl items-center mx-auto">
            <div className="flex-1 min-w-0">
              <div className="md:max-w-7xl md:w-full w-[350px] mx-auto my-12">
                <GoogleMapComponent
                  apartments={apartments}
                  projectImages={projectImages}
                  currentImageIndexes={currentImageIndexes}
                  locale={locale}
                  onMarkerClick={setSelectedProject}
                />
                {console.log(
                  "[ApartmentList] apartments passed to GoogleMapComponent:",
                  apartments
                )}
              </div>
            </div>
            <div className="w-full lg:w-[400px] lg:mt-12 flex items-center justify-center">
              {selectedProject && (
                <ProjectSidePanel
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
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
                  favorites={favorites}
                  handleToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  showProjectButton={true}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Styles pour focus visible, fade-in, img-fade */}
      <style jsx global>{`
        button:focus,
        a:focus {
          outline: 2px solid #16a34a;
          outline-offset: 2px;
        }
        .fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: none;
          }
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
