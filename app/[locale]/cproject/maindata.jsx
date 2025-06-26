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
import { FiUpload, FiGlobe } from "react-icons/fi";
import { useLanguage } from "@/app/LanguageContext";

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

  // Initialiser les champs traduisibles
  const initialTranslatableFields = {
    name: "", des: "", fulldescr: "", coam: "",
  };
  supportedLangs.forEach(lang => {
    Object.keys(initialTranslatableFields).forEach(field => {
        initialTranslatableFields[`${field}_${lang.code}`] = project?.[`${field}_${lang.code}`] || "";
    });
  });

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
    ...initialTranslatableFields,
    name: project?.name || "", // Fallback pour l'ancien champ
    des: project?.des || "",
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

  // Mise à jour des données quand le projet change
  useEffect(() => {
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
      ...initialTranslatableFields,
      name: project?.name || "",
      des: project?.des || "",
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

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const saveProject = async () => {
    setIsSaving(true);

    // Utilise la langue de la navbar comme source
    const sourceLang = language || "fr";
    const supportedLangs = ["fr", "en", "pl", "de", "ru"];
    const sourceField = `des_${sourceLang}`;
    const sourceText = formData[sourceField];
    if (!sourceText || sourceText.trim() === "") {
      alert(`Le champ description (${sourceLang}) est vide.`);
      setIsSaving(false);
      return;
    }
    // Détecte les langues cibles manquantes
    const targetLangs = supportedLangs.filter(l => l !== sourceLang && (!formData[`des_${l}`] || formData[`des_${l}`].trim() === ""));
    let translations = {};
    if (targetLangs.length > 0) {
      try {
        const langMap = { en: "EN", fr: "FR", pl: "PL", de: "DE", ru: "RU" };
        const sourceLangDeepl = langMap[sourceLang] || sourceLang.toUpperCase();
        const targetLangsDeepl = targetLangs.map(l => langMap[l] || l.toUpperCase());
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceText, sourceLang: sourceLangDeepl, targetLangs: targetLangsDeepl })
        });
        const data = await res.json();
        console.log("Réponse DeepL (saveProject) :", data);
        translations = data.translations || {};
        // Mets à jour tous les champs traduits dans formData
        setFormData(prev => {
          const updated = { ...prev };
          targetLangs.forEach(l => {
            if (translations[l]) updated[`des_${l}`] = translations[l];
          });
          return updated;
        });
      } catch (e) {
        console.error('Erreur lors de la traduction automatique :', e);
        alert('Erreur lors de la traduction automatique');
        setIsSaving(false);
        return;
      }
    }
    // Ici, poursuis la logique de sauvegarde Supabase avec tous les champs à jour

    console.log("formData avant sauvegarde :", formData);
    // Construire explicitement le payload pour éviter les erreurs
    const updates = {
      compagny: formData.compagny,
      country: formData.country,
      city: formData.city,
      lat: formData.lat,
      lng: formData.lng,
      link: formData.link,
      cur: formData.cur,
      online: formData.online,
      aponsel: formData.aponsel,
      ...features,
    };

    supportedLangs.forEach(lang => {
      updates[`name_${lang}`] = formData[`name_${lang}`] || null;
      updates[`des_${lang}`] = formData[`des_${lang}`] || null;
      updates[`fulldescr_${lang}`] = formData[`fulldescr_${lang}`] || null;
      updates[`coam_${lang}`] = formData[`coam_${lang}`] || null;
    });

    updates.name = formData.name_fr || formData.name;
    updates.des = formData.des_fr || null;
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
        onProjectUpdate(updatedProject);
      }
      alert("Données sauvegardées avec succès");
    }

    setIsSaving(false);
  };

  const handleTranslate = async () => {
    const sourceLang = activeLang;
    const sourceTextName = formData[`name_${sourceLang}`];
    const sourceTextDes = formData[`des_${sourceLang}`];
    const sourceTextFullDescr = formData[`fulldescr_${sourceLang}`];
    const sourceTextCoam = formData[`coam_${sourceLang}`];

    if (!sourceTextName && !sourceTextDes && !sourceTextFullDescr && !sourceTextCoam) {
        alert(`Veuillez remplir les champs de la langue source (${sourceLang}) avant de traduire.`);
        return;
    }

    setIsTranslating(true);
    const targetLangs = supportedLangs.filter(l => l && l !== sourceLang && typeof l === "string" && l.trim().length > 0);

    if (targetLangs.length === 0) {
      setIsTranslating(false);
      return;
    }

    const textsToTranslate = {
        name: sourceTextName,
        des: sourceTextDes,
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
            className="bg-transparent isIconOnly min-w-fit"
            onClick={onAIGenerate}
          >
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
      const supportedLangs = ["fr", "en", "pl", "de", "ru"];
      const targetLangs = supportedLangs.filter(l => l && l !== language && typeof l === "string" && l.trim().length > 0);
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
          const translateData = await translateRes.json();
          if (translateData.translations && onResult) {
            // Batch update: construit un objet avec toutes les traductions sauf la langue active
            const fields = {
              [`des_${language}`]: data.text,
              ...Object.fromEntries(
                Object.entries(translateData.translations)
                  .filter(([lang]) => lang !== language)
                  .map(([lang, translatedText]) => [
                    `des_${lang}`, translatedText
                  ])
              )
            };
            onResult(fields);
          }
        } catch (err) {
          setError("Erreur lors de la traduction automatique: " + err.message);
        }
      } else if (onResult) {
        // Si pas de traduction, on met à jour juste la langue active
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
    <div className="p-4 bg-white rounded-lg shadow-xl w-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t("IASEO")} ({language.toUpperCase()})</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("IASEODescription")}</p>
      
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full mb-4">
        {isLoading ? "Génération..." : t("LaunchGeneration")}
      </Button>

      {generatedText && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">{t("GeneratedDescription")}</h4>
          <textarea
            className="w-full border rounded p-2 text-gray-700 mb-2"
            rows={4}
            value={generatedText}
            onChange={e => setGeneratedText(e.target.value)}
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

function IASEOFull({ projectData, formData, onResult, onClose }) {
  const { language } = useLanguage();
  const t = useTranslations("Projet");
  const [generatedText, setGeneratedText] = useState("");
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
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGeneratedText(data.choices[0].message.content);
    } catch (e) {
      setError("Failed to generate text. " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    await navigator.clipboard.writeText(generatedText);
    alert("Copié !");
  };

  const handleApply = () => {
    onResult(generatedText, language);
    onClose();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl w-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t("IADESCRIPTION")} ({language.toUpperCase()})</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("IADESCRIPTIONDetail")}</p>
      
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full mb-4">
        {isLoading ? "Génération..." : t("LaunchGeneration")}
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

function IACOMMUNITYEnhanced({ projectData, formData, onResult, onClose }) {
  const { language } = useLanguage();
  const t = useTranslations("Projet");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [communityType, setCommunityType] = useState("calm");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generateCommunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectData.name,
          projectDescription: projectData.fulldescr,
          communityType,
          language: language,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGeneratedText(data.choices[0].message.content);
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
    <div className="p-4 bg-white rounded-lg shadow-xl w-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t("GenerateAmenities")} ({language.toUpperCase()})</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t("CommunityDescription")}</p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t("CommunityType")}
        </label>
        <select
          className="border p-2 rounded"
          value={communityType}
          onChange={(e) => setCommunityType(e.target.value)}
        >
          <option value="calm">{t("CommunityTypeCalm")}</option>
          <option value="active">{t("CommunityTypeActive")}</option>
        </select>
      </div>
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full mb-4">
        {isLoading ? "Génération..." : t("LaunchGeneration")}
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
    >
      <ModalContent>
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={onClose}>
            {t("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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
  } = useProjectData(project, onProjectUpdate);

  const t = useTranslations("Projet");

  const [activeAIModal, setActiveAIModal] = useState(null);
  const handleOpenAI = (modal) => setActiveAIModal(modal);
  const handleCloseAI = () => setActiveAIModal(null);

  const { language } = useLanguage();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{t("FormTitle")}</h2>
        <Button onClick={saveProject} disabled={isSaving}>
          {isSaving ? t("Saving") : t("Sauvegarder")}
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Images du projet</h2>
        <ProjectImages projectId={project.id} />
      </div>
      
      <div className="flex gap-8">
        <div>
          {/* Champs de base */}
          <BasicFields formData={formData} updateFormData={updateFormData} />
          
          {/* Sélecteur pays/ville */}
          <CountryCitySelector formData={formData} updateFormData={updateFormData} />
          
          {/* Fonctionnalités */}
          <FeaturesSection features={features} toggleFeature={toggleFeature} />
          
          {/* Statut en ligne */}
          <OnlineStatus formData={formData} updateFormData={updateFormData} />
          
          <Divider className="my-4" />

          {/* Nom du projet */}
          <TextFieldWithAI
            label={t("NomProjet")}
            value={formData[`name_${activeLang}`] || ""}
            onChange={(value) => updateFormData(`name_${activeLang}`, value)}
            maxLength={50}
            rows={1}
          />

          {/* Description complète */}
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

          {/* Équipements communautaires */}
          <div className="flex flex-col mt-8">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                {t("CommunityAmenities")}
              </h2>
              <Button
                className="bg-transparent isIconOnly min-w-fit"
                onClick={() => handleOpenAI("community")}
              >
                Générer
              </Button>
            </div>
            <TextFieldWithAI
              value={formData[`coam_${activeLang}`] || ""}
              onChange={(value) => updateFormData(`coam_${activeLang}`, value)}
              maxLength={1000}
              rows={9}
            />
          </div>

          {/* Description SEO */}
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

      <Button onClick={saveProject} className="w-full mt-6" disabled={isSaving}>
        {isSaving ? t("Saving") : t("Sauvegarder")}
      </Button>

      {/* Modales IA améliorées */}
      <AIModal
        isOpen={activeAIModal === "community"}
        onClose={handleCloseAI}
      >
        <IACOMMUNITYEnhanced
          projectData={project}
          formData={formData}
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

  async function fetchImages() {
    const { data, error } = await supabase
      .storage
      .from("project")
      .list(`${projectId}/`, { limit: 20, offset: 0 });
    if (error || !data) {
      setImages({});
      return;
    }
    const slotImages = {};
    slots.forEach(num => {
      const prefix = `image${num}-`;
      const file = data.find(f => f.name.startsWith(prefix));
      slotImages[num] = file
        ? supabase.storage.from("project").getPublicUrl(`${projectId}/${file.name}`).data.publicUrl
        : null;
    });
    setImages(slotImages);
  }

  useEffect(() => {
    if (projectId) fetchImages();
    // eslint-disable-next-line
  }, [projectId]);

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
