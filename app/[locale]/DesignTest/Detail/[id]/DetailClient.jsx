"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Swim from '@/components/svg/swim';
import Cctv from '@/components/svg/cctv';
import Bike from '@/components/svg/bike';
import Disabled from '@/components/svg/disabled';
import Fitness from '@/components/svg/fitness';

function formatPrice(price) {
  if (typeof price === "number") return price.toLocaleString("fr-FR") + " €";
  const num = Number(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("fr-FR") + " €";
}

export default function DetailClient({ project, locale }) {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const sortInitialData = (data) => {
    const sortedData = [...data].sort((a, b) => (Number(a.bed) || 0) - (Number(b.bed) || 0));
    setProjectList(sortedData);
  };

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

  // Carte Google Maps
  const containerStyle = {
    width: '100%',
    height: '350px',
    marginBottom: '2rem',
    borderRadius: '1rem',
    overflow: 'hidden',
  };
  const center = {
    lat: Number(project.lat) || 52.2297,
    lng: Number(project.lng) || 21.0122,
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const equipmentList = [
    {
      key: 'swim',
      label: 'Piscine',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: <Swim />
    },
    {
      key: 'cctv',
      label: 'Vidéosurveillance',
      bg: 'bg-gray-200',
      text: 'text-gray-800',
      icon: <Cctv />
    },
    {
      key: 'entrance',
      label: 'Réception',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <span role="img" aria-label="reception">🏢</span>
    },
    {
      key: 'bike',
      label: 'Parking vélo',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <Bike />
    },
    {
      key: 'disabled',
      label: 'Accès handicapé',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: <Disabled />
    },
    {
      key: 'child',
      label: 'Espace enfants',
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      icon: <span role="img" aria-label="enfant">🧸</span>
    },
    {
      key: 'fitness',
      label: 'Salle de sport',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: <Fitness />
    }
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const id = project.id;
      // Récupérer les projectlists
      const { data: projectlists, error: projectlistError } = await supabase
        .from("projectlist")
        .select("ide, ref, bed, floor, price, surface, garden, rooftop, des")
        .eq("ide", id);
      if (!projectlistError && projectlists) {
        sortInitialData(projectlists);
      }
      // Récupérer les images depuis le storage
      const { data: imageList, error: imageError } = await supabase
        .storage
        .from('project')
        .list(`${id}/`);
      if (!imageError && imageList) {
        const onlyFiles = imageList.filter(item => item.name && item.metadata);
        const imageUrls = onlyFiles.map((image) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('project')
            .getPublicUrl(`${id}/${image.name}`);
          return publicUrl;
        });
        setImages(imageUrls);
      }
      setLoading(false);
    };
    if (project && project.id) {
      const lang = locale || 'fr';
      setEquipments({
        swim: project.swim,
        cctv: project.cctv,
        entrance: project.entrance,
        bike: project.bike,
        disabled: project.disabled,
        fitness: project.fitness,
        sauna: project.sauna,
        lift: project.lift,
      });
      setProjectDescription(project[`fulldescr_${lang}`] || project.fulldescr || '');
      setCommunityAmenities(project[`coam_${lang}`] || project.coam || '');
      fetchDetails();
    }
  }, [project, locale]);

  if (!project) return <p>Appartement introuvable</p>;

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
          <h1 className="text-5xl font-bold mb-2">{project[`name_${locale}`] || project.name}</h1>
          <h2 className="text-xl text-black mb-2">{project.city}</h2>
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
                    alt={`${project[`name_${locale}`] || project.name} - Image ${index + 1}`}
                    className="object-cover w-full h-full rounded-2xl select-none"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
            {/* Flèches de navigation slider */}
            {images.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10">
                  ◀
                </button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10">
                  ▶
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      {/* Nouveau layout deux colonnes : texte à gauche, carte+promoteur à droite */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mb-12">
        {/* Colonne gauche : texte */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{projectDescription}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Équipements communautaires</h3>
            <p className="text-gray-700 whitespace-pre-line">{communityAmenities}</p>
          </div>
        </div>
        {/* Colonne droite : carte + promoteur + équipements */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Localisation du projet</h3>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '1rem' }}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <div>Chargement de la carte...</div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Coordonnées du promoteur</h3>
            <div className="text-gray-700 space-y-2">
              <div><span className="font-semibold">Nom :</span> {project.compagny || "Non renseigné"}</div>
              <div><span className="font-semibold">Contact :</span> {project.aponsel || "Non renseigné"}</div>
              <div><span className="font-semibold">Email :</span> {project.email || "Non renseigné"}</div>
              <div><span className="font-semibold">Site web :</span> {project.link ? <a href={project.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{project.link}</a> : "Non renseigné"}</div>
            </div>
          </div>
          {/* Card équipements (badges/icônes) */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Équipements</h3>
            <div className="flex flex-wrap gap-3">
              {equipmentList.map(eq =>
                equipments[eq.key] && (
                  <span
                    key={eq.key}
                    className={`flex items-center gap-2 px-1 pr-2 py-1 ${eq.bg} ${eq.text} rounded-full text-sm`}
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow">
                      {eq.icon}
                    </span>
                    {eq.label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Tableau des lots */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8 mb-8">
        <h3 className="text-2xl font-bold mb-4">Lots disponibles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <SortableHeader label="Réf" sortKey="ref" />
                <SortableHeader label="Chambres" sortKey="bed" />
                <SortableHeader label="Étage" sortKey="floor" />
                <SortableHeader label="Surface" sortKey="surface" />
                <SortableHeader label="Jardin" sortKey="garden" />
                <SortableHeader label="Rooftop" sortKey="rooftop" />
                <SortableHeader label="Prix" sortKey="price" />
                <th className="w-32 font-normal">Description</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((lot, idx) => (
                <tr key={idx} className="border-t">
                  <td className="text-center py-2">{lot.ref}</td>
                  <td className="text-center py-2">{lot.bed}</td>
                  <td className="text-center py-2">{lot.floor}</td>
                  <td className="text-center py-2">{lot.surface} m²</td>
                  <td className="text-center py-2">{lot.garden ? "Oui" : "Non"}</td>
                  <td className="text-center py-2">{lot.rooftop ? "Oui" : "Non"}</td>
                  <td className="text-center py-2">{formatPrice(lot.price)}</td>
                  <td className="text-center py-2">{lot.des}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 