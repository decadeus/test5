"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Swim from '@/components/svg/swim';
import Cctv from '@/components/svg/cctv';
import Bike from '@/components/svg/bike';
import Disabled from '@/components/svg/disabled';
import Fitness from '@/components/svg/fitness';
import { FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import { FaLanguage } from 'react-icons/fa';
import { notFound } from 'next/navigation';
import Badge from "@/components/ui/Badge";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useTranslations } from "next-intl";

const GoogleMapComponent = dynamic(() => import('@/components/GoogleMap'), { ssr: false, loading: () => <div>Chargement de la carte…</div> });

function formatPrice(price) {
  if (typeof price === "number") return price.toLocaleString("fr-FR") + " €";
  const num = Number(price);
  if (isNaN(num)) return price;
  return num.toLocaleString("fr-FR") + " €";
}

// Mapping code langue -> nom complet
const languageLabels = {
  fr: 'Français',
  en: 'Anglais',
  de: 'Allemand',
  pl: 'Polonais',
  ru: 'Russe',
  uk: 'Ukrainien',
  es: 'Espagnol',
  it: 'Italien',
  // Ajoute d'autres si besoin
};

// Mapping natif unique pour toutes les langues
const NATIVE_LANG_LABELS = {
  fr: 'Français',
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  ru: 'Русский',
  uk: 'Українська',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
};

// Fonction pour parser et afficher les langues
function renderLanguages(langs) {
  let arr = [];
  if (!langs) return <span>Non renseigné</span>;
  if (Array.isArray(langs)) arr = langs;
  else {
    try {
      arr = JSON.parse(langs);
      if (!Array.isArray(arr)) arr = [langs];
    } catch {
      arr = [langs];
    }
  }
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {arr.map((code, idx) => (
        <span key={idx} className="bg-green-50 text-green-900 px-4 py-1 rounded-2xl text-base font-semibold shadow-sm border border-green-100">
          {languageLabels[code] || code}
        </span>
      ))}
    </div>
  );
}

// Copier le design premium ProjectRecapCard ici :
const LANG_LABELS = {
  fr: 'Français',
  en: 'Anglais',
  pl: 'Polonais',
  de: 'Allemand',
  ru: 'Russe',
  uk: 'Ukrainien',
  es: 'Espagnol',
  it: 'Italien',
  pt: 'Portugais',
  nl: 'Néerlandais',
};

function ProjectRecapCard({ formData, images }) {
  const t = useTranslations('Projet');
  // Utilise images[0] (première image du tableau) comme source de l'avatar si dispo, sinon formData.avatar ou null
  const avatarUrl = images && images.length > 0 ? images[0] : (formData.avatar || null);
  // Affichage lisible des langues
  let langues = [];
  if (Array.isArray(formData.promoter_languages)) {
    langues = formData.promoter_languages;
  } else if (typeof formData.promoter_languages === 'string') {
    try {
      const arr = JSON.parse(formData.promoter_languages);
      langues = Array.isArray(arr) ? arr : [formData.promoter_languages];
    } catch {
      langues = [formData.promoter_languages];
    }
  }
  return (
    <div className=" w-full flex flex-col items-center text-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/40">
      <div className="flex  gap-8 justify-center items-center">
      {/* Avatar promoteur avec halo premium */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-gray-200/60 via-gray-100/80 to-white blur-lg opacity-80"></div>
        <div className="relative w-20 h-20 md:w-20 md:h-20 rounded-full shadow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg font-semibold">{t('NoAvatar') || 'No avatar'}</div>
          )}
        </div>
      </div>
      
      {/* Prénom + Nom promoteur */}
      <div>
      <h3 className="text-xl font-extrabold text-gray-700 mb-1 text-center tracking-tight leading-tight drop-shadow-sm">
        {formData.promoter_first_name} {formData.promoter_last_name}
      </h3>
      {/* Compagnie */}
      <div className="text-gray-500 text-lg font-semibold italic mb-3 text-center">
        {formData.compagny}
      </div>
      </div>
      </div>
      {/* Langues */}
      {langues.length > 0 && (
        <div className="flex flex-col items-center mb-4">
          <span className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FiGlobe className="inline text-gray-400" />{t('LanguesParlees') || 'Langues parlées'}</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {langues.filter(Boolean).map((lang, i) => (
              <span key={i} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-gray-100 shadow-sm flex items-center gap-1">
                {NATIVE_LANG_LABELS[lang] || lang}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Bouton vers le site web promoteur */}
      {formData.link && (
        <a
          href={formData.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-700 hover:to-gray-900 text-black hover:text-white font-bold px-6 py-2 rounded-full shadow shadow-gray-100/30 transition mb-4 mt-2 text-base tracking-wide hover:border-gray-900"
        >
          <FiGlobe className="text-lg" />
          {t('PlusInfosProjet') || "Plus d'infos sur le projet"}
        </a>
      )}
      {/* Icônes email et téléphone premium */}
      <div className="flex gap-6 justify-center mt-3 mb-1">
        <div className="rounded-full bg-gray-700 border border-gray-200 shadow p-3 flex items-center justify-center hover:bg-gray-100 transition group">
          <FiMail className="text-2xl text-white group-hover:text-red-700 transition-colors" title={t('Email') || "Email"} />
        </div>
        <div className="rounded-full bg-gray-700 border border-gray-200 shadow p-3 flex items-center justify-center hover:bg-gray-100 transition group">
          <FiPhone className="text-2xl text-white group-hover:text-red-700 transition-colors" title={t('Telephone') || "Téléphone"} />
        </div>
      </div>
    </div>
  );
}

export default function DetailClient({ project, locale }) {
  const t = useTranslations("DetailProject");
  const tProj = useTranslations("Projet");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'bed', direction: 'ascending' });
  const [equipments, setEquipments] = useState({});
  const supabase = createClient();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [showPromoterModal, setShowPromoterModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(false);

  // Mesure dynamique du conteneur
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth || 600);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dimensions
  const slideWidth = containerWidth * 0.7;
  const gap = 24;
  const padding = (containerWidth - slideWidth) / 2;
  const trackWidth = images.length * (slideWidth + gap);
  const translateX = -currentSlide * (slideWidth + gap);

  // Navigation
  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };
  const nextSlide = () => {
    if (currentSlide < images.length - 1) setCurrentSlide((prev) => prev + 1);
  };

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

  const SortableHeader = ({ label, sortKey, extraClass = "" }) => (
    <th 
      className={`w-8 font-normal cursor-pointer hover:bg-green-300/50 transition-colors ${extraClass}`}
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
      fetchDetails();
    }
  }, [project, locale]);

  // Gère l'ouverture animée du modal
  useEffect(() => {
    if (showPromoterModal) {
      setModalVisible(true);
      setTimeout(() => setModalAnimation(true), 10); // Laisse le temps au DOM d'afficher
    } else if (modalVisible) {
      setModalAnimation(false);
      // Attend la fin de l'animation avant de retirer du DOM
      const timeout = setTimeout(() => setModalVisible(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [showPromoterModal]);

  if (!project) notFound();

  const lang = locale || 'fr';
  // Champs projet multilingues
  const projectName = project.name;
  const projectCity = project[`city_${lang}`] || project.city_fr || project.city;

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="/appart.webp"
          imagesrcset="/appart.webp 1x, /appart.webp 2x"
          imagesizes="100vw"
        />
        <link
          rel="preload"
          href="/fonts/roboto/roboto-v48-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/roboto/roboto-v48-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/roboto/roboto-v48-latin-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <main className="bg-green-100/10 min-h-screen w-full">
        <header>
          <div className="w-full h-[340px] relative mb-8 shadow-md flex justify-center items-center overflow-hidden rounded-none">
            <Image
              src="/appart.webp"
              alt={`${projectName} ${projectCity}`}
              fill
              className="object-cover z-0"
              priority
              draggable={false}
              placeholder="blur"
              blurDataURL="/appart.webp"
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="flex flex-col justify-center items-center relative z-10">
              <h1 className="text-5xl font-bold mb-2">{projectName}</h1>
              <h2 className="text-xl text-black mb-2">{projectCity}</h2>
            </div>
          </div>
        </header>
        <section
          className={`max-w-7xl mx-auto px-4 mb-8 min-h-[400px] transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
        >
          {loading ? (
            <div className="flex justify-center items-center h-[220px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : images.length > 0 ? (
            <div className="max-w-3xl w-full mx-auto">
              <div className="relative w-full h-[340px] flex items-center justify-center">
                {/* Image courante */}
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={images[currentSlide]}
                    alt={`${projectName} - Image ${currentSlide + 1}`}
                    fill
                    className="object-cover w-full h-full rounded-2xl select-none border-2 border-white shadow-lg"
                    draggable={false}
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                {/* Flèches de navigation slider */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                      disabled={currentSlide === 0}
                      aria-label="Image précédente"
                      className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-20 ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, images.length - 1))}
                      disabled={currentSlide === images.length - 1}
                      aria-label="Image suivante"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-20 ${currentSlide === images.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>
              {/* Pagination X/Y */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-lg font-semibold text-blue-800">{currentSlide + 1}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-400">{images.length}</span>
                </div>
              )}
            </div>
          ) : null}
        </section>
        {/* Nouveau layout deux colonnes : texte à gauche, carte+promoteur à droite */}
        <section className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-0 gap-12 mb-8">
          {/* Colonne gauche : texte */}
          <div className="w-full md:w-1/2 flex flex-col gap-8 md:pr-2 px-4">
            <div className="bg-white rounded-xl shadow p-4 min-h-[300px]">
              <h3 className="text-2xl font-bold mb-4">{t('Description')}</h3>
              <p className="text-gray-900 whitespace-pre-line">{project[`fulldescr_${lang}`] || project.fulldescr || ''}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-2xl font-bold mb-4">{t('CommunityAmenities')}</h3>
              <p className="text-gray-900 whitespace-pre-line mb-3">{project[`coam_${lang}`] || project.coam || ''}</p>
              {/* Badges équipements */}
              <div className="flex flex-wrap gap-2 mt-2">
                {equipmentList.map(eq =>
                  equipments[eq.key] && (
                    <Badge
                      key={eq.key}
                      className={`flex items-center gap-2 px-1 pr-3 py-1 ${eq.bg} ${eq.text}`}
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow">
                        {eq.icon}
                      </span>
                      {tProj(eq.key)}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Colonne droite : carte + promoteur + équipements */}
          <div className="w-full md:w-1/2 flex flex-col gap-8 md:px-4 px-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-2xl font-bold mb-4">{t('Location')}</h3>
              <GoogleMapComponent
                mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '1rem' }}
                center={center}
                zoom={15}
                apartments={[project]}
                inactiveMarker
              />
            </div>
            {/* Promoteur visible seulement sur desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow p-4">
              <ProjectRecapCard formData={project} images={images} />
            </div>
          </div>
        </section>
        {/* Tableau des lots */}
        <section className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6  m-8">
          <h3 className="text-2xl font-bold mb-4">{t('Lots')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <SortableHeader label={t('Bedrooms')} sortKey="bed" extraClass="px-4" />
                  <SortableHeader label={t('Floor')} sortKey="floor" extraClass="px-4" />
                  <SortableHeader label={t('Surface')} sortKey="surface" extraClass="px-4" />
                  <SortableHeader label={t('Garden')} sortKey="garden" extraClass="px-4" />
                  <SortableHeader label={t('Rooftop')} sortKey="rooftop" extraClass="px-4" />
                  <SortableHeader label={t('Price')} sortKey="price" extraClass="px-4" />
                  <th className="w-32 font-normal px-4">{t('Description')}</th>
                </tr>
              </thead>
              <tbody>
                {projectList.map((lot, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="text-center py-2 px-4">{lot.bed}</td>
                    <td className="text-center py-2 px-4">{lot.floor}</td>
                    <td className="text-center py-2 px-4">{lot.surface} m²</td>
                    <td className="text-center py-2 px-4">
                      {lot.garden ? "🌸" : ""}
                    </td>
                    <td className="text-center py-2 px-4">
                      {lot.rooftop ? "🏙️" : ""}
                    </td>
                    <td className="text-center py-2 px-4">
                      {Number(lot.price)?.toLocaleString('fr-FR')}
                    </td>
                    <td className="text-center py-2 px-4">{lot.des}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Bouton flottant pour ouvrir la modal sur mobile */}
        <button
          className="fixed right-0 top-20 z-50 bg-green-800 text-white rounded-tl-2xl rounded-bl-2xl shadow-lg px-3 py-4 flex flex-col items-center md:hidden hover:bg-green-900 transition-colors border border-green-900"
          onClick={() => setShowPromoterModal(true)}
          aria-label="Contact promoteur"
        >
          <span className="vertical-text text-xs">{t('ContactPromoter')}</span>
        </button>
        {/* Modal promoteur sur mobile */}
        {modalVisible && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center md:hidden transition-opacity duration-300 ${modalAnimation ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div
              className={`bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative transform transition-all duration-300
                ${modalAnimation ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setShowPromoterModal(false)}
                aria-label="Fermer la fenêtre de contact promoteur"
              >
                ×
              </button>
              <ProjectRecapCard formData={project} images={images} />
            </div>
          </div>
        )}
        {/* Ajoute un padding-bottom sur mobile pour éviter que le bouton ne masque le contenu */}
        <style jsx>{`
          @media (max-width: 768px) {
            main {
              padding-bottom: 90px !important;
            }
          }
        `}</style>
      </main>
    </>
  );
} 