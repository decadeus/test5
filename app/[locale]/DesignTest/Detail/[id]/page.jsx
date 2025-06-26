"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Fonction utilitaire pour formater le prix
function formatPrice(price) {
  if (typeof price === "number") return price.toLocaleString("fr-FR") + " €";
  const num = Number(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("fr-FR") + " €";
}

export default function ApartmentDetail() {
  const { id, locale } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apartment, setApartment] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'bed', direction: 'ascending' });
  const [equipments, setEquipments] = useState({});
  const [projectDescription, setProjectDescription] = useState('');
  const [communityAmenities, setCommunityAmenities] = useState('');
  const supabase = createClient();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  // Fonction de tri
  const sortData = (data, key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      if (["bed", "floor", "surface", "price"].includes(key)) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (["garden", "rooftop"].includes(key)) {
        aValue = aValue === true || aValue === 'true' || aValue === 1 || aValue === '1' ? 1 : 0;
        bValue = bValue === true || bValue === 'true' || bValue === 1 || bValue === '1' ? 1 : 0;
      }
      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setProjectList(sortedData);
  };

  // Fonction pour trier les données initiales
  const sortInitialData = (data) => {
    const sortedData = [...data].sort((a, b) => (Number(a.bed) || 0) - (Number(b.bed) || 0));
    setProjectList(sortedData);
  };

  // Composant pour l'en-tête de tri
  const SortableHeader = ({ label, sortKey }) => (
    <th 
      className="w-8 font-normal cursor-pointer hover:bg-green-300/50 transition-colors"
      onClick={() => sortData(projectList, sortKey)}
    >
      <div className="flex items-center justify-center gap-1">
        {label}
        {sortConfig.key === sortKey && (
          <span className="text-xs">
            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  useEffect(() => {
    const fetchApartment = async () => {
      setLoading(true);

      // Définir les colonnes à récupérer en fonction de la locale
      const lang = locale || 'fr';
      const nameCol = `name_${lang}`;
      const desCol = `des_${lang}`;
      const fulldescrCol = `fulldescr_${lang}`;
      const coamCol = `coam_${lang}`;

      const { data, error } = await supabase
        .from("project")
        .select(`
          id, name, compagny, country, city, des, fulldescr, coam,
          swim, cctv, entrance, bike, disabled, fitness, sauna, lift,
          ${nameCol}, ${desCol}, ${fulldescrCol}, ${coamCol}
        `)
        .eq("id", parseInt(id))
        .single();

      if (!error && data) {
        // Logique de fallback pour l'affichage
        const title = data[nameCol] || data.name;
        const description = data[desCol] || data.des;
        const fullDescription = data[fulldescrCol] || data.fulldescr;
        const communityDesc = data[coamCol] || data.coam;

        setApartment({
          id: data.id,
          title: title, // Utiliser le titre traduit
          summary: data.compagny,
          price: data.country,
          city: data.city,
        });
        setEquipments({
          swim: data.swim,
          cctv: data.cctv,
          entrance: data.entrance,
          bike: data.bike,
          disabled: data.disabled,
          fitness: data.fitness,
          sauna: data.sauna,
          lift: data.lift,
        });

        // Utiliser les descriptions traduites
        setProjectDescription(fullDescription || '');
        setCommunityAmenities(communityDesc || '');
        
        // Récupérer les projectlists
        const { data: projectlists, error: projectlistError } = await supabase
          .from("projectlist")
          .select("ide, ref, bed, floor, price, surface, garden, rooftop, des")
          .eq("ide", parseInt(id));

        if (!projectlistError && projectlists) {
          sortInitialData(projectlists);
        }

        // Récupérer les images depuis le storage
        const { data: imageList, error: imageError } = await supabase
          .storage
          .from('project')
          .list(`${data.id}/`);

        if (!imageError && imageList) {
          const onlyFiles = imageList.filter(item => item.name && item.metadata);
          const imageUrls = onlyFiles.map((image) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('project')
              .getPublicUrl(`${data.id}/${image.name}`);
            return publicUrl;
          });
          setImages(imageUrls);
        }
      }
      setLoading(false);
    };

    if (id) fetchApartment();
  }, [id, locale]);

  if (!apartment) return <p>Appartement introuvable</p>;

  return (
    <div className="bg-green-100/10 min-h-screen w-full">
      <div
        className="w-full h-[400px] mb-8 shadow-md flex justify-center items-center relative"
        style={{
          backgroundImage: "url(/appart.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl font-bold mb-2">{apartment.title}</h1>
          <h2 className="text-xl text-black mb-2">{apartment.city}</h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-[320px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="relative w-full h-[720px] md:h-[400px] overflow-hidden rounded-2xl shadow-lg bg-white">
            {/* Slider track */}
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="min-w-full h-full flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${apartment.title} - Image ${index + 1}`}
                    className="object-cover w-full h-full rounded-2xl select-none"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
            {/* Flèches */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-2 rounded-full z-20 transition-colors border border-black"
              aria-label="Précédent"
            >
              <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-2 rounded-full z-20 transition-colors border border-black"
              aria-label="Suivant"
            >
              <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
            {/* Points */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full border-2 border-black transition-all duration-300 ${
                    idx === currentSlide ? "bg-green-600 scale-125 shadow" : "bg-white/80"
                  }`}
                  aria-label={`Aller à la slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune image disponible</p>
            <p className="text-sm text-gray-400 mt-2">ID du projet: {id}</p>
          </div>
        )}

        
        
        {/* Description générale du projet */}
        {projectDescription && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-green-100">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Description générale</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{projectDescription}</p>
          </div>
        )}

        {/* Équipements communautaires */}
        {communityAmenities && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-green-100">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Équipements communautaires</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{communityAmenities}</p>
          </div>
        )}

        {/* Tableau des appartements */}
        {projectList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Appartements disponibles</h3>
            {/* Ligne d'icônes pour les équipements */}
            <div className="flex flex-row gap-8 justify-center items-center mb-4">
              {[
                { key: 'swim', label: 'Piscine', svg: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20c2-2 6-2 8 0s6 2 8 0"/><path d="M2 16c2-2 6-2 8 0s6 2 8 0"/><path d="M2 12c2-2 6-2 8 0s6 2 8 0"/></svg>) },
                { key: 'cctv', label: 'CCTV', svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="15" height="5" rx="2" /><path d="M17 7l5 3-5 3V7z" /><circle cx="5" cy="9.5" r="1" /><path d="M7 12v5a2 2 0 0 0 2 2h2" /></svg>
                ) },
                { key: 'entrance', label: 'Accueil', svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11L12 4l9 7"/><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M9 21V13h6v8"/></svg>
                ) },
                { key: 'bike', label: 'Parking vélo', svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="18.5" r="3.5" />
                    <circle cx="18.5" cy="18.5" r="3.5" />
                    <path d="M5.5 18.5L10 10h4l4.5 8.5" />
                    <path d="M12 10v8.5" />
                  </svg>
                ) },
                { key: 'disabled', label: 'PMR', svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="6" r="2" />
                    <path d="M10 8v4h6.5a2.5 2.5 0 1 1-2.5 2.5" />
                    <circle cx="16" cy="16.5" r="2.5" />
                    <path d="M10 12l2.5 4" />
                  </svg>
                ) },
                { key: 'fitness', label: 'Fitness', svg: (
                  // Haltère
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="10" width="10" height="4" rx="1" />
                    <rect x="2" y="9" width="2" height="6" rx="1" />
                    <rect x="20" y="9" width="2" height="6" rx="1" />
                  </svg>
                ) },
                { key: 'sauna', label: 'Sauna', svg: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 16c0-2 2-4 4-4s4 2 4 4"/></svg>) },
                { key: 'lift', label: 'Ascenseur', svg: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 6v12"/><path d="M9 9l3-3 3 3"/><path d="M9 15l3 3 3-3"/></svg>) },
              ].map(({ key, label, svg }) => (
                (equipments && (equipments[key] === true || equipments[key] === 'true' || equipments[key] === 1 || equipments[key] === '1')) && (
                  <div key={key} className="flex flex-col items-center">
                    {svg}
                    <span className="text-xs mt-1">{label}</span>
                  </div>
                )
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full py-8 text-sm text-gray-700 text-center rounded-lg shadow border border-green-100 overflow-hidden">
                <thead>
                  <tr className="bg-green-200/80 text-black py-16 text-base">
                    <SortableHeader label="Référence" sortKey="ref" />
                    <SortableHeader label="Chambres" sortKey="bed" />
                    <SortableHeader label="Étage" sortKey="floor" />
                    <SortableHeader label="Surface" sortKey="surface" />
                    <SortableHeader label="Jardin" sortKey="garden" />
                    <SortableHeader label="Rooftop" sortKey="rooftop" />
                    <SortableHeader label="Prix" sortKey="price" />
                    <th className="font-normal">Informations</th>
                  </tr>
                </thead>
                <tbody>
                  {projectList.map((lot, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100" + " hover:bg-green-100 transition"}>
                      <td className="w-28 font-semibold py-2">{lot.ref}</td>
                      <td className="w-28 font-semibold">{lot.bed}</td>
                      <td className="w-28">{lot.floor}</td>
                      <td className="w-28">{lot.surface}</td>
                      <td className="w-28">{!!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false' ? "🌸" : ""}</td>
                      <td className="w-28">{!!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false' ? "🏙️" : ""}</td>
                      <td className="w-28 text-right font-semibold">{formatPrice(lot.price)}</td>
                      <td className="pl-16 text-left text-black max-w-[120px] font-semibold">{lot.des || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

       
        <Link
          href="../List"
          className="text-green-600 underline hover:text-green-800"
        >
          Retour à la liste
        </Link>

        {/* Projets filtrés similaires */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Projets correspondant à vos filtres</h3>
          <FilteredProjectsCards excludeId={apartment.id} />
        </div>
      </div>
    </div>
  );
}

// Ajout du composant pour afficher les cards filtrées
function FilteredProjectsCards({ excludeId }) {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  // Récupère les filtres du localStorage
  function getFilters() {
    if (typeof window === 'undefined') return null;
    return {
      selectedCity: localStorage.getItem('selectedCity'),
      searchTerm: localStorage.getItem('searchTerm') || '',
      priceRange: JSON.parse(localStorage.getItem('priceRange') || '[100000,5000000]'),
      bedRange: JSON.parse(localStorage.getItem('bedRange') || '[1,5]'),
      surfaceRange: JSON.parse(localStorage.getItem('surfaceRange') || '[10,200]'),
      onlyGarden: localStorage.getItem('onlyGarden') === 'true',
      onlyRooftop: localStorage.getItem('onlyRooftop') === 'true',
    };
  }

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const filters = getFilters();
      if (!filters) return;
      // Récupère les projets
      const { data: projects } = await supabase
        .from('project')
        .select('id, name, compagny, country, city');
      // Récupère les projectlists
      const { data: projectlists } = await supabase
        .from('projectlist')
        .select('ide, ref, bed, floor, price, surface, garden, rooftop, des');
      // Associe les projectlists à leur projet parent
      const apartmentsWithList = (projects || []).map((item) => ({
        id: item.id,
        title: item.name,
        summary: item.compagny,
        price: item.country,
        city: item.city,
        imageUrl: '/images/placeholder.jpg',
        projectlist: (projectlists || []).filter((pl) => pl.ide === item.id),
      }));
      // Filtres comme dans List
      const filtered = apartmentsWithList.filter((a) => {
        if (a.id === excludeId) return false;
        const matchesCity = !filters.selectedCity || filters.selectedCity === 'Tous' || a.city === filters.selectedCity;
        const matchesSearch =
          a.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          a.summary.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesRange = a.projectlist && a.projectlist.some(lot => {
          const lotPrice = parseFloat(lot.price);
          const lotBed = parseInt(lot.bed);
          const lotSurface = parseFloat(lot.surface);
          const hasGarden = !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false';
          const hasRooftop = !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false';
          return (
            lotPrice >= filters.priceRange[0] && lotPrice <= filters.priceRange[1] &&
            lotBed >= filters.bedRange[0] && lotBed <= filters.bedRange[1] &&
            lotSurface >= filters.surfaceRange[0] && lotSurface <= filters.surfaceRange[1] &&
            (!filters.onlyGarden || hasGarden) &&
            (!filters.onlyRooftop || hasRooftop)
          );
        });
        return matchesCity && matchesSearch && matchesRange;
      });
      setFilteredProjects(filtered);
      // Images (optionnel, ici placeholder)
    };
    fetchProjects();
  }, [excludeId]);

  if (filteredProjects.length === 0) {
    return <p className="text-gray-500">Aucun autre projet ne correspond à vos filtres.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {filteredProjects.map((apt) => (
        <div
          key={apt.id}
          className="bg-white/80 backdrop-blur-sm border-1 border-white text-gray-900 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group"
        >
          <div className="w-full flex flex-col gap-2 relative">
            <div className="relative overflow-hidden">
              {/* Badges jardin/rooftop sur la photo */}
              <div className="absolute top-2 right-2 flex gap-2 z-20">
                {apt.projectlist.some(lot => !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false') && (
                  <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-2 py-1 text-xs shadow">🌸 jardin</span>
                )}
                {apt.projectlist.some(lot => !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false') && (
                  <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-2 py-1 text-xs shadow">🏙️ rooftop</span>
                )}
              </div>
              <img
                src={apt.imageUrl}
                alt={apt.title}
                className="w-full h-48 sm:h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="w-full h-px bg-gradient-to-r from-green-700 via-gray-200 to-green-200 my-1" />
          </div>
          <div className="p-3 sm:p-4 flex flex-col w-full relative group h-full">
            <div className="flex flex-row justify-between">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                {apt.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold">{apt.city}</p>
            </div>
            {/* Affichage des lots du projet */}
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
                    {apt.projectlist.slice(0, 3).map((lot, idx) => (
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
                    {apt.projectlist.length > 3 && (
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
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
