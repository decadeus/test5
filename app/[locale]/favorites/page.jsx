"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaEuroSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbCurrencyZloty } from "react-icons/tb";
import { ExternalLink, BedDouble, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import Avatar from "@/app/getimage/project";

const NEW_FAVORITE_APARTMENTS_KEY = "favoriteApartments";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favoriteLots, setFavoriteLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Filtre");
  const tGlobal = useTranslations();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem(NEW_FAVORITE_APARTMENTS_KEY)) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      if (favorites.length === 0) {
        setFavoriteLots([]);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("projectlist")
        .select("*, project(*)")
        .in("id", favorites);
      setFavoriteLots(data || []);
      setLoading(false);
      // Nettoyage automatique du localStorage : ne garder que les IDs valides
      const validIds = (data || []).map(lot => lot.id);
      if (favorites.length !== validIds.length) {
        setFavorites(validIds);
        localStorage.setItem(NEW_FAVORITE_APARTMENTS_KEY, JSON.stringify(validIds));
      }
    }
    fetchFavorites();
  }, [favorites]);

  // Grouper les lots favoris par projet
  const projectsMap = {};
  favoriteLots.forEach(lot => {
    const projectId = lot.project?.id;
    if (!projectId) return;
    if (!projectsMap[projectId]) {
      projectsMap[projectId] = {
        project: lot.project,
        lots: [],
      };
    }
    projectsMap[projectId].lots.push(lot);
  });
  const favoriteProjects = Object.values(projectsMap);

  // Cœur plein si au moins un lot du projet est favori
  const isProjectFavorite = (projectId) => favoriteProjects.find(p => p.project.id === projectId)?.lots.some(lot => favorites.includes(lot.id));
  const handleToggleProjectFavorite = (projectId) => {
    const lots = favoriteProjects.find(p => p.project.id === projectId)?.lots || [];
    const allAreFav = lots.every(lot => favorites.includes(lot.id));
    let newFavorites;
    if (allAreFav) {
      newFavorites = favorites.filter(id => !lots.some(lot => lot.id === id));
    } else {
      const lotIds = lots.map(lot => lot.id);
      newFavorites = Array.from(new Set([...favorites, ...lotIds]));
    }
    setFavorites(newFavorites);
    localStorage.setItem(NEW_FAVORITE_APARTMENTS_KEY, JSON.stringify(newFavorites));
  };

  // ProjectCard factorisé depuis la homepage
  function ProjectCard({ project, lots, isFavorite, handleToggleFavorite, t, tGlobal }) {
    // Fallback image
    let imageNode = <div className="bg-gray-200 w-full h-64" />;
    if (project.mainpic_url) {
      if (project.mainpic_url.startsWith('http')) {
        imageNode = <img src={project.mainpic_url} alt={project.name || "Image projet"} className="object-cover w-full h-64" />;
      } else {
        imageNode = <Avatar uid={project.id} url={project.mainpic_url} classn="object-cover w-full h-64" />;
      }
    }
    // Badges
    const hasGarden = lots.some(lot => !!lot.garden && String(lot.garden) !== '0' && String(lot.garden).toLowerCase() !== 'false');
    const hasRooftop = lots.some(lot => !!lot.rooftop && String(lot.rooftop) !== '0' && String(lot.rooftop).toLowerCase() !== 'false');
    return (
      <div className="bg-white rounded-2xl shadow p-2">
        <div className="flex flex-col w-full px-1">
          {/* Badges en haut */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="bg-green-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
              {lots.length} {tGlobal(lots.length > 1 ? 'Appartements' : 'Appartement')}
            </span>
            <div className="flex gap-1">
              {hasGarden && (
                <span className="bg-green-100 border border-green-400 text-green-700 rounded-full px-2 py-0.5 text-[10px] font-bold">🌸 {t("jardin")}</span>
              )}
              {hasRooftop && (
                <span className="bg-blue-100 border border-blue-400 text-blue-700 rounded-full px-2 py-0.5 text-[10px] font-bold">🏙️ {t("rooftop")}</span>
              )}
            </div>
          </div>
          {/* Image + cœur */}
          <div className="relative overflow-hidden">
            {imageNode}
            <button
              onClick={() => handleToggleFavorite(project.id)}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition"
              aria-label="favorite"
              style={{ zIndex: 2 }}
            >
              {isFavorite(project.id) ? (
                <FaHeart fill="#bfae9b" size={22} />
              ) : (
                <FaRegHeart fill="#bfae9b" size={22} />
              )}
            </button>
          </div>
          {/* Ligne nom projet à gauche, promoteur à droite */}
          <div className="flex flex-row items-center justify-between px-4 pt-2 pb-1">
            <span className="text-base font-bold text-gray-900 truncate text-left max-w-[60%]">{project.name || <span className="italic text-gray-400">Non renseigné</span>}</span>
            <span className="text-xs text-gray-500 font-medium text-right truncate max-w-[38%]">by {project.compagny && project.compagny !== 'null' ? project.compagny : 'Non renseigné'}</span>
          </div>
          {/* Bouton détail discret en bas à droite */}
          <div className="flex justify-end px-4 pb-2">
            <Link href={`/${project.country ? project.country.toLowerCase() : 'fr'}/detailproject/${project.id}`} className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-3 py-1 transition-all duration-200 text-xs font-semibold border border-green-200">
              {t('Voir le détail')}
              <PlusIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-gray-50 sm:pt-4 mt-12 text-gray-700 mb-16 px-10">
      <h1 className="text-2xl font-bold mb-6">{t("Vos Favoris")}</h1>
      {loading ? (
        <div className="text-center py-10">{t("Chargement...")}</div>
      ) : favoriteProjects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">{t("Aucun favori enregistré.")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ">
          {favoriteProjects.map(({ project, lots }) => (
            <ProjectCard
              key={project.id}
              project={project}
              lots={lots}
              isFavorite={isProjectFavorite}
              handleToggleFavorite={handleToggleProjectFavorite}
              t={t}
              tGlobal={tGlobal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
