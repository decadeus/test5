import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { companies } from "@/utils/companies";
import { countryData } from "@/utils/countryData";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FiUpload, FiGlobe, FiMail, FiPhone } from "react-icons/fi";
import { useLanguage } from "@/app/LanguageContext";

// Fonction utilitaire pour nettoyer les guillemets en début/fin de chaîne
function cleanQuotes(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^"+|"+$/g, '').trim();
}

// Types et constantes
const FEATURES = {
  swim: "swim",
  cctv: "cctv", 
  entrance: "entrance",
  bike: "bike",
  disabled: "disabled",
  child: "child",
  fitness: "fitness",
};

const CURRENCIES = ["EUR", "PLN"];

const STYLES = {
  bginput: "bg-gray-100 text-black",
  label: "text-gray-900 mb-1",
  input: "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px]",
  textarea: "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm",
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

// --- NOUVEAU : Composant pour les onglets de langue ---
const LanguageTabs = ({ supportedLangs, activeLang, setActiveLang }) => (
  <div className="flex items-center border-b border-gray-200 mb-4">
    {supportedLangs.map((lang) => (
      <button
        key={lang.code}
        onClick={() => setActiveLang(lang.code)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeLang === lang.code
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {lang.name}
      </button>
    ))}
  </div>
);

// Hook personnalisé pour la gestion du projet
function useProjectData(project, onProjectUpdate) {
  const supabase = createClient();
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const supportedLangs = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "pl", name: "Polski" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
  ];
  const [activeLang, setActiveLang] = useState("fr"); // Langue par défaut

  // Synchronise activeLang avec la langue de la navbar
  useEffect(() => {
    if (language && activeLang !== language) {
      setActiveLang(language);
    }
  }, [language]);

  // Fonction pour générer dynamiquement les champs traduisibles à partir du projet courant
  function getTranslatableFields(project) {
    const fields = {};
    ["name", "fulldescr", "coam", "des"].forEach(field => {
      supportedLangs.forEach(lang => {
        fields[`${field}_${lang.code}`] = project?.[`${field}_${lang.code}`] || "";
      });
    });
    return fields;
  }

  const [formData, setFormData] = useState({
    compagny: project?.compagny || "",
    country: project?.country || "",
    city: project?.city || "",
    lat: project?.lat || "",
    lng: project?.lng || "",
    link: project?.link || "",
    cur: project?.cur || "",
    online: project?.online || false,
    aponsel: project?.aponsel || "",
    // Nouvelles colonnes promoteur
    promoter_last_name: project?.promoter_last_name || "",
    promoter_first_name: project?.promoter_first_name || "",
    promoter_phone: project?.promoter_phone || "",
    promoter_email: project?.promoter_email || "",
    promoter_languages: project?.promoter_languages || [],
    ...getTranslatableFields(project),
    name: project?.name || "",
    fulldescr: project?.fulldescr || "",
    coam: project?.coam || "",
  });
  
  const [features, setFeatures] = useState({
    swim: project?.swim || false,
    cctv: project?.cctv || false,
    entrance: project?.entrance || false,
    bike: project?.bike || false,
    disabled: project?.disabled || false,
    child: project?.child || false,
    fitness: project?.fitness || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

  // Mise à jour des données quand le projet change
  useEffect(() => {
    console.log("project reçu dans useProjectData :", project);
    setFormData({
      compagny: project?.compagny || "",
      country: project?.country || "",
      city: project?.city || "",
      lat: project?.lat || "",
      lng: project?.lng || "",
      link: project?.link || "",
      cur: project?.cur || "",
      online: project?.online || false,
      aponsel: project?.aponsel || "",
      // Nouvelles colonnes promoteur
      promoter_last_name: project?.promoter_last_name || "",
      promoter_first_name: project?.promoter_first_name || "",
      promoter_phone: project?.promoter_phone || "",
      promoter_email: project?.promoter_email || "",
      promoter_languages: project?.promoter_languages || [],
      ...getTranslatableFields(project),
      name: project?.name || "",
      fulldescr: project?.fulldescr || "",
      coam: project?.coam || "",
    });
    
    setFeatures({
      swim: project?.swim || false,
      cctv: project?.cctv || false,
      entrance: project?.entrance || false,
      bike: project?.bike || false,
      disabled: project?.disabled || false,
      child: project?.child || false,
      fitness: project?.fitness || false,
    });
  }, [project]);

  useEffect(() => {
    setInitialFormData(project ? {
      compagny: project?.compagny || "",
      country: project?.country || "",
      city: project?.city || "",
      lat: project?.lat || "",
      lng: project?.lng || "",
      link: project?.link || "",
      cur: project?.cur || "",
      online: project?.online || false,
      aponsel: project?.aponsel || "",
      promoter_last_name: project?.promoter_last_name || "",
      promoter_first_name: project?.promoter_first_name || "",
      promoter_phone: project?.promoter_phone || "",
      promoter_email: project?.promoter_email || "",
      promoter_languages: project?.promoter_languages || [],
      ...Object.fromEntries(Object.entries(project || {}).filter(([k]) => k.startsWith('name_') || k.startsWith('fulldescr_') || k.startsWith('coam_') || k.startsWith('des_')))
    } : null);
  }, [project]);

  const t = useTranslations("Projet");
  const hasTextChanges = initialFormData && JSON.stringify(formData) !== JSON.stringify(initialFormData);
  const buttonText = isSaving
    ? t("Saving")
    : hasTextChanges
      ? t("EnregistrerModifications", { default: "Enregistrer les modifications" })
      : t("Sauvegarder", { default: "Sauvegarder" });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const saveProject = async () => {
    setIsSaving(true);

    // Utilise la langue de la navbar comme source
    const sourceLang = language || activeLang || "fr";
    const fieldsToTranslate = ["name", "fulldescr", "coam", "des"];
    let updates = {
      compagny: formData.compagny,
      country: formData.country,
      city: formData.city,
      lat: formData.lat,
      lng: formData.lng,
      link: formData.link,
      cur: formData.cur,
      online: formData.online,
      aponsel: formData.aponsel,
      // Nouvelles colonnes promoteur
      promoter_last_name: formData.promoter_last_name,
      promoter_first_name: formData.promoter_first_name,
      promoter_phone: formData.promoter_phone,
      promoter_email: formData.promoter_email,
      promoter_languages: formData.promoter_languages,
      ...features,
    };

    // Traduction automatique de tous les champs multilingues
    for (const field of fieldsToTranslate) {
      const sourceField = `${field}_${sourceLang}`;
      const sourceText = formData[sourceField];
      // Vérifie si le texte a changé par rapport à l'initial
      const initialText = initialFormData ? initialFormData[sourceField] : undefined;
      if (!sourceText || sourceText.trim() === "") continue;
      updates[`${field}_${sourceLang}`] = sourceText;
      // Ne lance la traduction que si le texte a changé
      if (sourceText === initialText) continue;
      const targetLangs = supportedLangs
        .map(l => (typeof l === 'string' ? l : l.code))
        .filter(l => typeof l === 'string' && l && l !== sourceLang && l.trim().length > 0);
      if (targetLangs.length > 0) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sourceText, sourceLang: sourceLang.toLowerCase(), targetLangs: targetLangs.map(l => l.toLowerCase()) })
          });
          const data = await res.json();
          const translations = data.translations || {};
          console.log('Traductions reçues pour', field, ':', translations);
          targetLangs.forEach(l => {
            // Correction robuste pour l'anglais
            let val = translations[l];
            if (l === 'en') {
              if (translations['en']) val = translations['en'];
              else if (translations['en-gb']) val = translations['en-gb'];
              else if (translations['en-us']) val = translations['en-us'];
            }
            if (val) {
              updates[`${field}_${l}`] = cleanQuotes(val);
            }
          });
        } catch (e) {
          console.error(`Erreur lors de la traduction automatique du champ ${field} :`, e);
          alert(`Erreur lors de la traduction automatique du champ ${field}`);
          setIsSaving(false);
          return;
        }
      }
    }

    // Champs principaux pour compatibilité
    updates.name = formData.name_fr || formData.name;
    updates.fulldescr = formData.fulldescr_fr || null;
    updates.coam = formData.coam_fr || null;
    // Filtre les clés invalides
    Object.keys(updates).forEach(key => {
      if (key.includes("undefined")) delete updates[key];
    });

    console.log("Payload envoyé à Supabase :", updates);
    console.log("ID projet :", project.id);

    const { error } = await supabase
      .from("project")
      .update(updates)
      .eq("id", project.id);

    if (error) {
      alert(`Erreur lors de la sauvegarde: ${error.message}`);
      console.error(error);
    } else {
      const { data: updatedProject, error: fetchError } = await supabase
        .from("project")
        .select("*")
        .eq("id", project.id)
        .single();

      if (!fetchError && updatedProject && onProjectUpdate) {
        console.log("Projet rechargé après sauvegarde :", updatedProject);
        onProjectUpdate(updatedProject);
      }
      alert("Données sauvegardées avec succès");
    }

    setIsSaving(false);
  };

  const handleTranslate = async () => {
    const sourceLang = activeLang;
    const sourceTextName = formData[`name_${sourceLang}`];
    const sourceTextFullDescr = formData[`fulldescr_${sourceLang}`];
    const sourceTextCoam = formData[`coam_${sourceLang}`];

    if (!sourceTextName && !sourceTextFullDescr && !sourceTextCoam) {
        alert(`Veuillez remplir les champs de la langue source (${sourceLang}) avant de traduire.`);
        return;
    }

    setIsTranslating(true);
    const targetLangs = supportedLangs
      .map(l => (typeof l === 'string' ? l : l.code))
      .filter(l => typeof l === 'string' && l && l !== sourceLang && l.trim().length > 0);

    if (targetLangs.length === 0) {
      setIsTranslating(false);
      return;
    }

    const textsToTranslate = {
        name: sourceTextName,
        fulldescr: sourceTextFullDescr,
        coam: sourceTextCoam,
    };

    const langMap = { 'EN-GB': 'en', 'EN-US': 'en', 'FR': 'fr', 'PL': 'pl', 'DE': 'de', 'RU': 'ru' };

    for (const key in textsToTranslate) {
        const text = textsToTranslate[key];
        if (text) {
            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, sourceLang, targetLangs }),
                });
                const data = await response.json();
                if (data.translations) {
                    const newFormData = { ...formData };
                    // Mapping explicite : chaque langue va dans la bonne colonne, sauf la langue source
                    Object.entries(data.translations).forEach(([langCode, translatedText]) => {
                        const mappedLang = langMap[langCode.toUpperCase()] || langCode.toLowerCase();
                        if (mappedLang !== sourceLang.toLowerCase()) {
                            newFormData[`${key}_${mappedLang}`] = translatedText;
                        }
                    });
                    setFormData(newFormData);
                }
            } catch (error) {
                console.error(`Erreur de traduction pour le champ ${key}:`, error);
                alert(`La traduction du champ ${key} a échoué.`);
            }
        }
    }
    setIsTranslating(false);
  };

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    let langs = formData.promoter_languages;
    if (typeof langs === "string") {
      try {
        langs = JSON.parse(langs);
      } catch {
        langs = langs ? [langs] : [];
      }
    }
    if (!Array.isArray(langs)) langs = [];
    setSelectedLanguages(langs);
  }, [formData.promoter_languages]);

  const [keywords, setKeywords] = useState("");

  return {
    formData,
    features,
    isSaving,
    updateFormData,
    toggleFeature,
    saveProject,
    supportedLangs,
    activeLang,
    setActiveLang,
    handleTranslate,
    isTranslating,
    initialFormData,
    hasTextChanges,
    buttonText,
    selectedLanguages,
    setSelectedLanguages,
    keywords,
    setKeywords,
  };
}

// Composant pour le sélecteur pays/ville
function CountryCitySelector({ formData, updateFormData }) {
  const [cities, setCities] = useState([]);
  const f = useTranslations("Projet");

  useEffect(() => {
    if (formData.country && countryData[formData.country]) {
      setCities(countryData[formData.country]);
    } else {
      setCities([]);
    }
  }, [formData.country]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    updateFormData('country', selectedCountry);

    // Réinitialiser la ville quand on change de pays
    if (countryData[selectedCountry]) {
      updateFormData('city', countryData[selectedCountry][0]);
    } else {
      updateFormData('city', "");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-black w-[900px]">
      <div className="flex flex-col">
        <label className="text-black mb-1">{f("Pays")}</label>
        <select
          value={formData.country}
          onChange={handleCountryChange}
          className={`${STYLES.input} ${STYLES.bginput}`}
        >
          <option value="__">__</option>
          {Object.keys(countryData).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">{f("Ville")}</label>
        <select
          value={formData.city}
          onChange={(e) => updateFormData('city', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
          disabled={!formData.country}
        >
          <option value="">__</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Composant pour les champs de base
function BasicFields({ formData, updateFormData }) {
  const f = useTranslations("Projet");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
      <div className="flex flex-col mb-4">
        <label className="text-black mb-1">{f("Compagnie")}</label>
        <select
          value={formData.compagny}
          onChange={(e) => updateFormData('compagny', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
        >
          <option value="" disabled>
            {f("Compagnie")}
          </option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={`${STYLES.label}`}>{f("Latitude")}</label>
        <input
          type="text"
          value={formData.lat}
          onChange={(e) => updateFormData('lat', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">{f("Longitude")}</label>
        <input
          type="text"
          value={formData.lng}
          onChange={(e) => updateFormData('lng', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">{f("Monnaie")}</label>
        <select
          value={formData.cur}
          onChange={(e) => updateFormData('cur', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
        >
          {CURRENCIES.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">{f("Link")}</label>
        <input
          type="text"
          value={formData.link}
          onChange={(e) => updateFormData('link', e.target.value)}
          className={`${STYLES.input} ${STYLES.bginput}`}
        />
      </div>
    </div>
  );
}

// Composant pour les informations du promoteur
export function ProjectMainForm({ projectId, formData, updateFormData, images, setImages, fetchImages }) {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const supabase = createClient();
  const f = useTranslations("Projet");

  // Mapping natif pour les langues
  const availableLanguages = Object.entries(NATIVE_LANG_LABELS).map(([code, name]) => ({ code, name }));

  useEffect(() => {
    let langs = formData.promoter_languages;
    if (typeof langs === "string") {
      try {
        langs = JSON.parse(langs);
      } catch {
        langs = langs ? [langs] : [];
      }
    }
    if (!Array.isArray(langs)) langs = [];
    setSelectedLanguages(langs);
  }, [formData.promoter_languages]);

  // --- Bloc langues promoteur ---
  const toggleLanguage = (langCode) => {
    const newSelectedLanguages = selectedLanguages.includes(langCode)
      ? selectedLanguages.filter(lang => lang !== langCode)
      : [...selectedLanguages, langCode];
    setSelectedLanguages(newSelectedLanguages);
    updateFormData('promoter_languages', newSelectedLanguages);
  };

  // --- Bloc avatar promoteur ---
  const avatarInputRef = useRef(null);
  async function handleAvatarUpload(e) {
    const files = e.target.files;
    if (!files.length || !projectId) return;
    const file = files[0];
    try {
      // Upload avatar dans Supabase Storage (prefix image6-)
      const ext = file.name.split('.').pop();
      const prefix = `image6-`;
      const name = `${prefix}${Date.now()}.${ext}`;
      // Supprimer anciens avatars
      const { data: existingFiles } = await supabase.storage.from('project').list(`${projectId}/`, { limit: 20 });
      if (existingFiles) {
        const toDelete = existingFiles.filter(f => f.name.startsWith(prefix)).map(f => `${projectId}/${f.name}`);
        if (toDelete.length > 0) await supabase.storage.from('project').remove(toDelete);
      }
      // Upload
      const { error } = await supabase.storage.from('project').upload(`${projectId}/${name}`, file, { upsert: true });
      if (error) throw error;
      // Stocker le chemin (comme pour les autres images)
      updateFormData('promoter_avatar_url', `${projectId}/${name}`);
      // Rafraîchir les images pour affichage instantané
      if (fetchImages) await fetchImages();
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }

  // --- Bloc images du projet ---
  const slots = [1, 2, 3, 4, 5, 6];
  async function handleUpload(e, slotNum) {
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Seuls les fichiers PNG, JPG ou JPEG sont autorisés.");
      return;
    }
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("La taille maximale autorisée est de 3 Mo.");
      return;
    }
    const ext = file.name.split('.').pop();
    const prefix = `image${slotNum}-`;
    const name = `${prefix}${Date.now()}.${ext}`;
    const { data: existingFiles, error: listError } = await supabase
      .storage
      .from("project")
      .list(`${projectId}/`, { limit: 20, offset: 0 });
    if (!listError && existingFiles) {
      const toDelete = existingFiles
        .filter(f => f.name.startsWith(prefix))
        .map(f => `${projectId}/${f.name}`);
      if (toDelete.length > 0) {
        await supabase.storage.from("project").remove(toDelete);
      }
    }
    const { error } = await supabase
      .storage
      .from("project")
      .upload(`${projectId}/${name}`, file, { upsert: true });
    if (error) alert("Erreur upload: " + error.message);
    setTimeout(() => {
      fetchImages();
    }, 1000);
  }

  // --- Render ---
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200 shadow-sm mb-8">
      {/* Bloc avatar promoteur en haut du formulaire */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center rounded-full border-2 border-blue-200 bg-white overflow-hidden mb-2">
          {images[6] ? (
            <img
              src={images[6]}
              alt="Avatar promoteur"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xs text-gray-400">No imagees</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            title="Uploader/Remplacer la photo du promoteur"
          >
            <FiUpload size={24} color="#222" />
          </button>
        </div>
      </div>
      {/* --- Formulaire promoteur --- */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Informations du Promoteur</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Nom *</label>
          <input
            type="text"
            value={formData.promoter_last_name || ""}
            onChange={(e) => updateFormData('promoter_last_name', e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du promoteur"
          />
        </div>
        {/* Prénom */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Prénom *</label>
          <input
            type="text"
            value={formData.promoter_first_name || ""}
            onChange={(e) => updateFormData('promoter_first_name', e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Prénom du promoteur"
          />
        </div>
        {/* Téléphone */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Téléphone *</label>
          <input
            type="tel"
            value={formData.promoter_phone || ""}
            onChange={(e) => updateFormData('promoter_phone', e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Téléphone du promoteur"
          />
        </div>
        {/* Email */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Email *</label>
          <input
            type="email"
            value={formData.promoter_email || ""}
            onChange={(e) => updateFormData('promoter_email', e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email du promoteur"
          />
        </div>
      </div>
      {/* Langues parlées */}
      <div className="mt-6">
        <label className="text-gray-700 font-medium mb-3 block">Langues parlées *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => toggleLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                selectedLanguages.includes(lang.code)
                  ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${
                selectedLanguages.includes(lang.code)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedLanguages.includes(lang.code) && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
        {selectedLanguages.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            Langues sélectionnées : {selectedLanguages.map(code =>
              availableLanguages.find(lang => lang.code === code)?.name
            ).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour les fonctionnalités
function FeaturesSection({ features, toggleFeature }) {
  const f = useTranslations("Projet");

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {Object.keys(features).map((feature) => (
        <div className="relative flex items-center pr-12" key={feature}>
          <input
            type="checkbox"
            id={`${feature}Switch`}
            checked={features[feature]}
            onChange={() => toggleFeature(feature)}
            className="hidden"
          />
          <label
            htmlFor={`${feature}Switch`}
            className="flex items-center cursor-pointer w-full"
            aria-label={`Toggle ${feature} feature`}
          >
            <div
              className={`w-10 h-6 flex-shrink-0 flex items-center rounded-full p-1 ${
                features[feature] ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  features[feature] ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <p className="ml-2 capitalize truncate">{f(feature)}</p>
          </label>
        </div>
      ))}
    </div>
  );
}

// Composant pour le statut en ligne
function OnlineStatus({ formData, updateFormData }) {
  const f = useTranslations("Projet");

  return (
    <div className="flex flex-col pb-4 mt-8">
      <div className="flex flex-col pt-4">
        <label className="text-black mb-1 flex">
          {f("ProjetEnLigne")}
          <span className="text-black flex items-center ml-2">
            <span>{formData.online ? "online" : "offline"}</span>
            {formData.online ? (
              <IoEye className="ml-2 text-xl text-green-600" />
            ) : (
              <IoMdEyeOff className="ml-2 text-xl text-red-600" />
            )}
          </span>
        </label>
      </div>

      <div className="relative flex">
        <input
          type="checkbox"
          id="onlineSwitch"
          checked={formData.online}
          onChange={() => updateFormData('online', !formData.online)}
          className="hidden"
        />
        <label
          htmlFor="onlineSwitch"
          className="flex items-center cursor-pointer"
          aria-label="Toggle project online status"
        >
          <div
            className={`w-10 h-6 flex items-center rounded-full p-1 ${
              formData.online ? "bg-green-500" : "bg-red-600"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                formData.online ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </div>
  );
}

// Composant pour les champs de texte avec IA
function TextFieldWithAI({
  label,
  value,
  onChange,
  maxLength,
  rows = 2,
  onAIGenerate,
  aiButtonText,
  projectData = null, // Ajout des données du projet
  placeholder,
  readOnly,
}) {
  const f = useTranslations("Projet");

  return (
    <div className="flex flex-col mt-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
          {label}
        </h2>
        {onAIGenerate && (
          <Button
            className="flex items-center gap-2 bg-transparent min-w-fit"
            onClick={onAIGenerate}
          >
            <span role="img" aria-label="ia">🤖</span>
            {aiButtonText}
          </Button>
        )}
      </div>
      <textarea
        value={value.length > maxLength ? value.slice(0, maxLength) : value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={rows}
        className={`${STYLES.textarea} ${STYLES.bginput} mt-2`}
        placeholder={placeholder || f("FieldPlaceholder")}
        readOnly={readOnly}
      />
      <span className="text-gray-400 text-sm mt-1">
        {value ? value.length : 0}/{maxLength} {f("Characters")}
      </span>
    </div>
  );
}

// --- MODALES IA RESTAURÉES AVEC SÉLECTEUR DE LANGUE ---

function IASEOShort({ projectData, formData, onResult, onClose }) {
  const { language } = useLanguage();
  const t = useTranslations("Projet");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generateSEO', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomProjet: projectData.name,
          projectDescription: projectData.fulldescr,
          communityAmenities: projectData.coam,
          ville: projectData.city || "",
          langue: language,
          type: "short"
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGeneratedText(data.text);
      // Traduction automatique dans les autres langues
      const supportedLangs = ["fr", "en", "pl", "de", "ru", "uk"];
      const targetLangs = supportedLangs.filter(l => typeof l === 'string' && l && l !== language && l.trim().length > 0);
      if (data.text && targetLangs.length > 0) {
        try {
          const translateRes = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: data.text,
              sourceLang: language,
              targetLangs,
            }),
          });
          if (!translateRes.ok) {
            const errorText = await translateRes.text();
            console.error('Erreur API /api/translate:', translateRes.status, errorText);
            setError(`Erreur API /api/translate: ${translateRes.status} ${errorText}`);
            if (onResult) onResult({ [`des_${language}`]: data.text });
            return;
          }
          const translateData = await translateRes.json();
          if (translateData.translations && onResult) {
            // Batch update: construit un objet avec toutes les traductions sauf la langue active
            const fields = {
              [`des_${language}`]: data.text,
              ...Object.fromEntries(
                Object.entries(translateData.translations)
                  .filter(([lang]) => lang !== language)
                  .map(([lang, translatedText]) => [
                    `des_${lang}`, cleanQuotes(translatedText)
                  ])
              )
            };
            onResult(fields);
          }
        } catch (err) {
          setError("Erreur lors de la traduction automatique: " + err.message);
          if (onResult) onResult({ [`des_${language}`]: data.text });
        }
      } else if (onResult) {
        onResult({ [`des_${language}`]: data.text });
      }
    } catch (e) {
      setError("Failed to generate text. " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      alert("Copié !");
    } catch (err) {
      alert("Erreur de copie");
    }
  };

  const handleApply = () => {
    console.log("handleApply SEO, language:", language);
    if (onResult) {
      onResult({ [`des_${language}`]: generatedText });
    }
    onClose();
  };

  return (
    <div className="p-4 py-10 bg-white rounded-lg shadow-md w-[600px]">
      {/* <h3 className="text-xl font-bold text-gray-800">{t("IASEO")} ({language.toUpperCase()})</h3> */}
      {/* <p className="text-sm text-gray-600 mb-4">{t("IASEODescription")}</p> */}
      
      {/* Bouton de génération : affiché uniquement si pas encore généré */}
      {!generatedText && (
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full mb-4 mt-10 flex items-center justify-center gap-2"
        >
          <span role="img" aria-label="ia">🤖</span>
          {isLoading ? t("Generating") : t("GenerateWithAI")}
        </Button>
      )}

      {generatedText && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">{t("GeneratedDescription")}</h4>
          <textarea
            className="w-full border rounded p-2 text-gray-700 mb-2"
            rows={4}
            value={generatedText}
            onChange={e => setGeneratedText(e.target.value)}
          />
          <Button onClick={handleApply} className="w-full mt-4 bg-blue-600 text-white">
            {t("ApplyToField")}
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

function IASEOFull({ projectData, formData, onResult, onClose, initialText }) {
  const { language } = useLanguage();
  const t = useTranslations("Projet");
  const [generatedText, setGeneratedText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generateFull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectData.name,
          language: language,
          userPrompt: userPrompt.trim(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const mainText = data.choices[0].message.content;
      setGeneratedText(mainText);
      setEditedText(mainText);

      // Traduction automatique dans les autres langues UNIQUEMENT si le texte a changé
      const supportedLangs = ["fr", "en", "pl", "de", "uk"];
      const targetLangs = supportedLangs.filter(l => typeof l === 'string' && l && l !== language && l.trim().length > 0);
      if (mainText && targetLangs.length > 0 && (!initialText || mainText !== initialText)) {
        try {
          const translateRes = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: mainText,
              sourceLang: language,
              targetLangs,
            }),
          });
          if (!translateRes.ok) {
            const errorText = await translateRes.text();
            console.error('Erreur API /api/translate:', translateRes.status, errorText);
            setError(`Erreur API /api/translate: ${translateRes.status} ${errorText}`);
            if (onResult) onResult({ [`fulldescr_${language}`]: cleanQuotes(mainText) });
            return;
          }
          const translateData = await translateRes.json();
          if (translateData.translations && onResult) {
            // Batch update: construit un objet avec toutes les traductions sauf la langue active
            const fields = {
              [`fulldescr_${language}`]: cleanQuotes(mainText),
              ...Object.fromEntries(
                Object.entries(translateData.translations)
                  .filter(([lang]) => lang !== language)
                  .map(([lang, translatedText]) => [
                    `fulldescr_${lang}`, cleanQuotes(translatedText)
                  ])
              )
            };
            onResult(fields);
          } else if (onResult) {
            onResult({ [`fulldescr_${language}`]: cleanQuotes(mainText) });
          }
        } catch (err) {
          setError("Erreur lors de la traduction automatique: " + err.message);
          if (onResult) onResult({ [`fulldescr_${language}`]: cleanQuotes(mainText) });
        }
      } else if (onResult) {
        onResult({ [`fulldescr_${language}`]: cleanQuotes(mainText) });
      }
    } catch (e) {
      setError("Failed to generate text. " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!editedText) return;
    await navigator.clipboard.writeText(editedText);
    alert("Copié !");
  };

  const handleApply = () => {
    onResult(editedText, language);
    onClose();
  };

  return (
    <div className="p-4 py-10 bg-white rounded-lg shadow-md w-[600px]">
      {/* <h3 className="text-xl font-bold text-gray-800">{t("IADESCRIPTION")} ({language.toUpperCase()})</h3> */}
      {/* <p className="text-sm text-gray-600 mb-4">{t("IADESCRIPTIONDetail")}</p> */}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Indications ou mots-clés pour la génération
        </label>
        <textarea
          className="border p-2 rounded w-full min-h-[60px]"
          placeholder="Ex : résidence haut de gamme, vue mer, proche centre-ville, etc."
          value={userPrompt}
          onChange={e => setUserPrompt(e.target.value)}
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full mb-4 flex items-center justify-center gap-2">
        <span role="img" aria-label="ia">🤖</span>
        {isLoading ? "Génération..." : "Générer avec l'IA"}
      </Button>

      {generatedText && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">{t("GeneratedDescription")}</h4>
          <textarea
            className="w-full border rounded p-2 text-gray-700 mb-2"
            rows={6}
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
          />
          <Button onClick={handleCopy} className="w-full mt-4">
            {t("CopyText")}
          </Button>
          <Button onClick={handleApply} className="w-full mt-4 bg-blue-600 text-white">
            {t("ApplyToField")}
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

function IACOMMUNITYEnhanced({ projectData, features, onResult, onClose }) {
  const { language } = useLanguage();
  const t = useTranslations("Projet");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keywords, setKeywords] = useState("");

  // Liste des équipements sélectionnés (features)
  const featureLabels = {
    swim: "Piscine",
    bike: "Parking Vélo",
    fitness: "Salle de sport",
    cctv: "Vidéosurveillance",
    entrance: "Réception à l'entrée",
    disabled: "Accès handicapé",
    child: "Espace enfants"
  };
  const selectedFeatures = Object.keys(features)
    .filter((key) => featureLabels[key] && features[key])
    .map((key) => featureLabels[key]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    // Fusion des équipements sélectionnés et du textarea
    const allEquipments = [...selectedFeatures];
    if (keywords.trim()) {
      allEquipments.push(keywords.trim());
    }
    const listEquipement = allEquipments.join(", ");

    try {
      const response = await fetch("/api/generateCommunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listEquipement,
          detail: "-",
          langue: language,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const mainText = data.choices ? data.choices[0].message.content : data.text;
      setGeneratedText(mainText);

      // Traduction automatique dans les autres langues
      const supportedLangs = ["fr", "en", "pl", "de", "uk"];
      const targetLangs = supportedLangs.filter(l => typeof l === 'string' && l && l !== language && l.trim().length > 0);
      if (mainText && targetLangs.length > 0) {
        try {
          const translateRes = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: mainText,
              sourceLang: language,
              targetLangs,
            }),
          });
          if (!translateRes.ok) {
            const errorText = await translateRes.text();
            console.error('Erreur API /api/translate:', translateRes.status, errorText);
            setError(`Erreur API /api/translate: ${translateRes.status} ${errorText}`);
            if (onResult) onResult({ [`coam_${language}`]: mainText });
            return;
          }
          const translateData = await translateRes.json();
          if (translateData.translations && onResult) {
            // Batch update: construit un objet avec toutes les traductions sauf la langue active
            const fields = {
              [`coam_${language}`]: cleanQuotes(mainText),
              ...Object.fromEntries(
                Object.entries(translateData.translations)
                  .filter(([lang]) => lang !== language)
                  .map(([lang, translatedText]) => [
                    `coam_${lang}`, cleanQuotes(translatedText)
                  ])
              )
            };
            onResult(fields);
          } else if (onResult) {
            onResult({ [`coam_${language}`]: mainText });
          }
        } catch (err) {
          setError("Erreur lors de la traduction automatique: " + err.message);
          if (onResult) onResult({ [`coam_${language}`]: mainText });
        }
      } else if (onResult) {
        onResult({ [`coam_${language}`]: mainText });
      }
    } catch (e) {
      setError("Failed to generate text. " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    alert("Copié !");
  };

  const handleApply = () => {
    if (onResult && language) {
      console.log("handleApply community, language:", language);
      onResult(generatedText, language);
    } else {
      alert("Erreur : langue non définie pour la sauvegarde des équipements communautaires.");
    }
    onClose();
  };

  return (
    <div className="p-4 py-10 bg-white rounded-lg shadow-md w-[600px]">
      {/* <h3 className="text-xl font-bold text-gray-800">{t("GenerateAmenities")} ({language.toUpperCase()})</h3> */}
      {/* <p className="text-sm text-gray-600 mb-4">{t("CommunityDescription")}</p> */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Liste des équipements ou mots-clés
        </label>
        <textarea
          className="border p-2 rounded w-full min-h-[60px]"
          placeholder="Ex : piscine, salle de sport, aire de jeux, sécurité, parking, jardin"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-2">
          La génération du texte prend aussi en compte les équipements sélectionnés dans le projet (ex : Piscine, parking vélo, etc.).
        </p>
      </div>
      <Button
        className="flex items-center gap-2 bg-transparent min-w-fit"
        onClick={handleGenerate}
        disabled={isLoading}
      >
        <span role="img" aria-label="ia">🤖</span>
        {isLoading ? t("Generating") : t("GenerateWithAI")}
      </Button>

      {generatedText && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">{t("GeneratedDescription")}</h4>
          <p className="text-gray-700 whitespace-pre-line">{generatedText}</p>
          <Button onClick={handleCopy} className="w-full mt-4">
            {t("CopyText")}
          </Button>
          <Button onClick={handleApply} className="w-full mt-4 bg-blue-600 text-white">
            {t("ApplyToField")}
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

// Composant pour les modales IA
function AIModal({ isOpen, onClose, children }) {
  const t = useTranslations("IAComponents");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="lg"
      scrollBehavior="inside"
      hideCloseButton
      className="flex items-center justify-center !bg-transparent !shadow-none !border-none"
      backdropClassName="bg-black/30 backdrop-blur-sm"
    >
      <ModalContent className="relative rounded-2xl shadow-2xl bg-white p-0 max-w-lg w-full">
        {/* Croix de fermeture en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl z-20"
          aria-label="Fermer"
          type="button"
        >
          &times;
        </button>
        <ModalBody className="p-8 pt-4 pb-4 flex flex-col items-center justify-center">
          {children}
        </ModalBody>
        <ModalFooter className="flex justify-center pb-6 pt-0 border-none bg-transparent">
          <Button color="danger" onClick={onClose} className="rounded-xl px-8 py-2 text-base font-semibold">
            {t("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Remettre ProjectRecapCard comme fonction interne non exportée
function ProjectRecapCard({ formData, images }) {
  const t = useTranslations('Projet');
  // Utilise images[6] comme source de l'avatar
  const avatarUrl = images && images[6] ? images[6] : null;
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
    <div className="bg-white border border-gray-100 rounded-3xl shadow-md px-10 py-12 w-[370px] flex flex-col items-center transition-all duration-300 my-8 mt-12 mb-12 hover:shadow-2xl hover:shadow-gray-200/40">
      <div className="flex items-center justify-center gap-4">
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
      <div>
      {/* Prénom + Nom promoteur */}
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-700 hover:to-gray-900 text-black font-bold px-6 py-2 rounded-full shadow shadow-gray-100/30 transition mb-4 mt-2 text-base tracking-wide hover:border-gray-900"
        >
          <FiGlobe className="text-lg" />
          {t('PlusInfosProjet') || "Plus d'infos sur le projet"}
        </a>
      )}
      {/* Icônes email et téléphone premium */}
      <div className="flex gap-6 justify-center mt-3 mb-1">
        <div className="rounded-full bg-gray-700 border border-gray-200 shadow p-3 flex items-center justify-center hover:bg-gray-100 transition">
          <FiMail className="text-2xl text-white" title={t('Email') || "Email"} />
        </div>
        <div className="rounded-full bg-gray-700 border border-gray-200 shadow p-3 flex items-center justify-center hover:bg-gray-100 transition">
          <FiPhone className="text-2xl text-white" title={t('Telephone') || "Téléphone"} />
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function Maindata({ project, onProjectUpdate }) {
  const {
    formData,
    features,
    isSaving,
    updateFormData,
    toggleFeature,
    saveProject,
    supportedLangs,
    activeLang,
    setActiveLang,
    handleTranslate,
    isTranslating,
    initialFormData,
    hasTextChanges,
    buttonText,
    selectedLanguages,
    setSelectedLanguages,
    keywords,
    setKeywords,
  } = useProjectData(project, onProjectUpdate);

  const t = useTranslations("Projet");

  const [activeAIModal, setActiveAIModal] = useState(null);
  const handleOpenAI = (modal) => setActiveAIModal(modal);
  const handleCloseAI = () => setActiveAIModal(null);

  const { language } = useLanguage();

  const [images, setImages] = useState({});

  const fetchImages = async () => {
    if (!project?.id) return;
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("project").list(`${project.id}`);
    if (!error && data) {
      const slots = [1,2,3,4,5,6];
      const imgs = {};
      for (let slot of slots) {
        const file = data.find(f => f.name.startsWith(`image${slot}-`));
        if (file) {
          const { data: urlData } = supabase.storage.from("project").getPublicUrl(`${project.id}/${file.name}`);
          imgs[slot] = urlData.publicUrl;
        }
      }
      setImages(imgs);
    } else {
      setImages({});
    }
  };

  useEffect(() => { fetchImages(); }, [project?.id]);

  const tableRef = useRef(null);
  const [hideSticky, setHideSticky] = useState(false);

  useEffect(() => {
    if (!tableRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setHideSticky(entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );
    observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, [tableRef]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Titre principal */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{formData.name || t("NomProjet")}</h1>
      <p className="text-lg text-gray-500 mb-8">{t("FormTitle")}</p>

      {/* Début zone sticky locale */}
      <div className="relative">
        <div className="space-y-10">
          {/* Zone principale : formulaire + fiche promoteur */}
          <div className="flex flex-col md:flex-row gap-10 mb-16">
            {/* Formulaire principal */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <ProjectMainForm projectId={project.id} formData={formData} updateFormData={updateFormData} images={images} setImages={setImages} fetchImages={fetchImages} />
            </div>
            {/* Fiche promoteur */}
            <div className="w-full md:w-[370px]">
              <ProjectRecapCard formData={formData} images={images} />
            </div>
          </div>

          {/* Section infos complémentaires (champs de base, pays/ville, features, etc.) */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-16">
            <div className="flex flex-col gap-8">
              <BasicFields formData={formData} updateFormData={updateFormData} />
              <CountryCitySelector formData={formData} updateFormData={updateFormData} />
              <FeaturesSection features={features} toggleFeature={toggleFeature} />
              <OnlineStatus formData={formData} updateFormData={updateFormData} />
              <Divider className="my-4" />
              <TextFieldWithAI
                label={t("DesPro")}
                value={formData[`fulldescr_${activeLang}`] || ""}
                onChange={(value) => updateFormData(`fulldescr_${activeLang}`, value)}
                rows={6}
                onAIGenerate={() => handleOpenAI("seo_full")}
                aiButtonText={t("IADESCRIPTION")}
                projectData={project}
                placeholder={t("FieldPlaceholder")}
              />
              <div className="flex flex-col mt-8">
                <div className="w-full flex items-center justify-between">
                  <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                    {t("CommunityAmenities")}
                  </h2>
                  <Button
                    className="flex items-center gap-2 bg-transparent min-w-fit"
                    onClick={() => handleOpenAI("community")}
                  >
                    <span role="img" aria-label="ia">🤖</span>
                    {t("GenerateWithAI")}
                  </Button>
                </div>
                <TextFieldWithAI
                  value={formData[`coam_${activeLang}`] || ""}
                  onChange={(value) => updateFormData(`coam_${activeLang}`, value)}
                  maxLength={1000}
                  rows={9}
                />
              </div>
              <TextFieldWithAI
                label={t("DesSEO")}
                value={formData[`des_${activeLang}`] || ""}
                onChange={(value) => updateFormData(`des_${activeLang}`, value)}
                maxLength={160}
                onAIGenerate={() => handleOpenAI("seo_short")}
                aiButtonText={t("IASEO")}
                projectData={project}
                placeholder={t("DesSEOExplication")}
              />
            </div>
          </div>
        </div>
        {/* Bouton Enregistrer sticky local */}
        <div className="sticky bottom-0 left-0 w-full flex justify-center py-4 z-30 ">
          <Button onClick={saveProject} className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-md w-11/12" disabled={isSaving}>
            {buttonText}
          </Button>
        </div>
      </div>
      {/* Fin zone sticky locale */}

      {/* Galerie d'images dans une carte premium */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-16" ref={tableRef}>
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h2l.4 2M7 7h10l1 2h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg>
          Images du projet
        </h2>
        <ProjectImages projectId={project.id} />
      </div>

      {/* Modales IA améliorées */}
      <AIModal
        isOpen={activeAIModal === "community"}
        onClose={handleCloseAI}
      >
        <IACOMMUNITYEnhanced
          projectData={project}
          features={features}
          onResult={(text, lang) => updateFormData(`coam_${lang}`, text)}
          onClose={handleCloseAI}
        />
      </AIModal>

      <AIModal
        isOpen={activeAIModal === "seo_short"}
        onClose={handleCloseAI}
      >
        <IASEOShort 
          projectData={project}
          formData={formData}
          onResult={async (fields) => {
            // 1. Injection dans la bonne colonne (ex: des_pl)
            Object.entries(fields).forEach(([field, value]) => {
              if (!field.includes("undefined")) updateFormData(field, value);
            });
            // 2. Traduction automatique dans les autres langues vides
            const mainLang = Object.keys(fields)[0].split('_')[1];
            const mainText = Object.values(fields)[0];
            const supportedLangs = ["fr", "en", "pl", "de", "ru"];
            const targetLangs = supportedLangs.filter(l => l !== mainLang && (!formData[`des_${l}`] || formData[`des_${l}`].trim() === ""));
            if (mainText && targetLangs.length > 0) {
              const langMap = { en: "EN", fr: "FR", pl: "PL", de: "DE", ru: "RU" };
              const sourceLangDeepl = langMap[mainLang] || mainLang.toUpperCase();
              const targetLangsDeepl = targetLangs.map(l => langMap[l] || l.toUpperCase());
              try {
                const res = await fetch('/api/translate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: mainText, sourceLang: sourceLangDeepl, targetLangs: targetLangsDeepl })
                });
                const data = await res.json();
                if (data.translations) {
                  Object.entries(data.translations).forEach(([lang, translatedText]) => {
                    if (lang !== mainLang) {
                      updateFormData(`des_${lang}`, translatedText);
                    }
                  });
                }
              } catch (e) {
                alert('Erreur lors de la traduction automatique après génération IA');
              }
            }
          }}
          onClose={handleCloseAI}
        />
      </AIModal>

      <AIModal
        isOpen={activeAIModal === "seo_full"}
        onClose={handleCloseAI}
      >
        <IASEOFull 
          projectData={project}
          formData={formData}
          onResult={(text, lang) => updateFormData(`fulldescr_${lang}`, text)}
          onClose={handleCloseAI}
          initialText={formData.fulldescr}
        />
      </AIModal>
    </div>
  );
}

// Composant pour la gestion des images (inchangé)
export function ProjectImages({ projectId, className = "" }) {
  const [images, setImages] = useState({}); // {slot: url}
  const supabase = createClient();
  const fileInputRefs = useRef([null, null, null, null, null]);

  // Génère les slots image1- à image5-
  const slots = [1, 2, 3, 4, 5];

  // Fonction pour charger les images du projet
  const fetchImages = async () => {
    if (!projectId) return;
    const { data, error } = await supabase.storage.from("project").list(`${projectId}`);
    if (!error && data) {
      const imgs = {};
      for (let slot of slots) {
        const file = data.find(f => f.name.startsWith(`image${slot}-`));
        if (file) {
          const { data: urlData } = supabase.storage.from("project").getPublicUrl(`${projectId}/${file.name}`);
          imgs[slot] = urlData.publicUrl;
        }
      }
      setImages(imgs);
    } else {
      setImages({});
    }
  };

  useEffect(() => { fetchImages(); }, [projectId]);

  async function handleUpload(e, slotNum) {
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];

    // 1. Vérifier le type de fichier
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Seuls les fichiers PNG, JPG ou JPEG sont autorisés.");
      return;
    }

    // 2. Vérifier la taille (3 Mo max)
    const maxSize = 3 * 1024 * 1024; // 3 Mo
    if (file.size > maxSize) {
      alert("La taille maximale autorisée est de 3 Mo.");
      return;
    }

    const ext = file.name.split('.').pop();
    const prefix = `image${slotNum}-`;
    const name = `${prefix}${Date.now()}.${ext}`;
    

    // 1. Supprimer les anciennes images du slot
    const { data: existingFiles, error: listError } = await supabase
      .storage
      .from("project")
      .list(`${projectId}/`, { limit: 20, offset: 0 });
    if (!listError && existingFiles) {
      const toDelete = existingFiles
        .filter(f => f.name.startsWith(prefix))
        .map(f => `${projectId}/${f.name}`);
      if (toDelete.length > 0) {
        await supabase.storage.from("project").remove(toDelete);
      }
    }

    // 2. Uploader la nouvelle image
    const { error } = await supabase
      .storage
      .from("project")
      .upload(`${projectId}/${name}`, file, { upsert: true });
    if (error) alert("Erreur upload: " + error.message);

    setTimeout(() => {
      if (fileInputRefs.current[slotNum - 1]) fileInputRefs.current[slotNum - 1].value = "";
      fetchImages();
    }, 1000);
  }

  return (
    <>
      <div className="flex w-full gap-4">
        {/* Image 1 à gauche */}
        <div
          className={
            "w-1/2 h-[300px] relative flex items-center justify-center rounded " +
            (images[1]
              ? " bg-white"
              : "border-2 border-dashed border-gray-300 bg-gray-50")
          }
        >
          {images[1] ? (
            <img
              src={images[1]}
              alt={`Projet ${projectId} - image1`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={el => (fileInputRefs.current[0] = el)}
            onChange={e => handleUpload(e, 1)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRefs.current[0]?.click()}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            title="Uploader/Remplacer l'image"
          >
            <FiUpload size={24} color="#222" />
          </button>
        </div>
        {/* Images 2 à 5 à droite */}
        <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-[300px]">
          {[2, 3, 4, 5].map((num, idx) => (
            <div
              key={num}
              className={
                "relative w-full h-full flex items-center justify-center rounded " +
                (images[num]
                  ? " bg-white"
                  : "border-2 border-dashed border-gray-300 bg-gray-50")
              }
            >
              {images[num] ? (
                <img
                  src={images[num]}
                  alt={`Projet ${projectId} - image${num}`}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                ref={el => (fileInputRefs.current[num - 1] = el)}
                onChange={e => handleUpload(e, num)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current[num - 1]?.click()}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
                title="Uploader/Remplacer l'image"
              >
                <FiUpload size={24} color="#222" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
