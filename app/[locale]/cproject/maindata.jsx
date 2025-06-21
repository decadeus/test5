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
import { FiUpload } from "react-icons/fi";

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

// Hook personnalisé pour la gestion du projet
function useProjectData(project, onProjectUpdate) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    compagny: project?.compagny || "",
    name: project?.name || "",
    country: project?.country || "",
    city: project?.city || "",
    lat: project?.lat || "",
    lng: project?.lng || "",
    link: project?.link || "",
    cur: project?.cur || "",
    online: project?.online || false,
    des: project?.des || "",
    coam: project?.coam || "",
    aponsel: project?.aponsel || "",
    fulldescr: project?.fulldescr || "",
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
      name: project?.name || "",
      country: project?.country || "",
      city: project?.city || "",
      lat: project?.lat || "",
      lng: project?.lng || "",
      link: project?.link || "",
      cur: project?.cur || "",
      online: project?.online || false,
      des: project?.des || "",
      coam: project?.coam || "",
      aponsel: project?.aponsel || "",
      fulldescr: project?.fulldescr || "",
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

    // Validation des champs requis
    const requiredFields = ['compagny', 'name', 'country', 'city', 'lat', 'lng'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert("Tous les champs sont requis.");
      setIsSaving(false);
      return;
    }

    const updates = {
      ...formData,
      ...features,
    };

    // Inclure pricetype seulement s'il est défini
    if (project.pricetype) {
      updates.pricetype = project.pricetype;
    }

    const { error } = await supabase
      .from("project")
      .update(updates)
      .eq("id", project.id);

    if (error) {
      alert("Erreur lors de la sauvegarde.");
    } else {
      // Recharger le projet
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

  return {
    formData,
    features,
    isSaving,
    updateFormData,
    toggleFeature,
    saveProject,
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

// Composant IA spécialisé pour les descriptions SEO courtes
function IASEOShort({ projectData, onResult, onClose }) {
  const [resultat, setResultat] = useState("");
  const [chargement, setChargement] = useState(false);
  const [langue, setLangue] = useState("fr");
  const t = useTranslations("IAComponents");

  const handleGenerate = async () => {
    setChargement(true);

    try {
      const response = await fetch("/api/generateSEO", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDescription: projectData?.fulldescr || "",
          communityAmenities: projectData?.coam || "",
          nomProjet: projectData?.name || "",
          ville: projectData?.city || "",
          langue: langue,
          type: "short",
        }),
      });

      const data = await response.json();
      setResultat(data.text);
    } catch (error) {
      console.error("Erreur génération IA:", error);
      setResultat(t("generationError"));
    } finally {
      setChargement(false);
    }
  };

  const handleCopy = async () => {
    if (resultat) {
      try {
        await navigator.clipboard.writeText(resultat);
        alert(t("copySuccess"));
      } catch (err) {
        console.error("Erreur de copie :", err);
      }
    }
  };

  const handleApply = () => {
    if (resultat && onResult) {
      onResult(resultat);
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">{t("seoShortTitle")}</h2>

      <div className="text-center text-gray-600">
        <p>
          {t.rich("seoShortDescription", {
            bold: (chunks) => <span className="font-semibold">{chunks}</span>,
          })}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <select
          className="border p-2 rounded"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
        >
          <option value="fr">{t("french")}</option>
          <option value="en">{t("english")}</option>
          <option value="de">{t("german")}</option>
          <option value="pl">{t("polish")}</option>
          <option value="ru">{t("russian")}</option>
        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 transition mx-auto"
          disabled={chargement}
        >
          {chargement ? t("generationInProgress") : t("launchGeneration")}
        </button>
      </div>

      {resultat && (
        <div className="bg-gray-100 p-4 rounded border flex flex-col gap-4">
          <h3 className="text-lg font-semibold">
            {t("generatedSEODescription")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{resultat}</p>
          <p className="text-sm text-gray-500">
            {t("length", { count: resultat.length })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white rounded p-2 hover:bg-green-700 transition"
            >
              {t("copyText")}
            </button>
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
            >
              {t("applyToField")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant IA spécialisé pour les descriptions complètes
function IASEOFull({ projectData, onResult, onClose }) {
  const [motsCles, setMotsCles] = useState("");
  const [langue, setLangue] = useState("fr");
  const [resultat, setResultat] = useState("");
  const [chargement, setChargement] = useState(false);
  const t = useTranslations("IAComponents");

  const handleGenerate = async () => {
    setChargement(true);

    try {
      const response = await fetch("/api/generateSEO", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomProjet: projectData?.name || "",
          ville: projectData?.city || "",
          types: "T1 à T5", // Valeur par défaut
          atouts:
            motsCles ||
            Object.keys(projectData?.features || {})
              .filter((k) => projectData.features[k])
              .join(", "),
          style: "moderne",
          publicCible: "investisseurs et familles",
          langue: langue,
          type: "full", // Indique que c'est pour une description complète
        }),
      });

      const data = await response.json();
      setResultat(data.text);
    } catch (error) {
      console.error("Erreur génération IA:", error);
      setResultat(t("generationError"));
    } finally {
      setChargement(false);
    }
  };

  const handleCopy = async () => {
    if (resultat) {
      try {
        await navigator.clipboard.writeText(resultat);
        alert(t("copySuccess"));
      } catch (err) {
        console.error("Erreur de copie :", err);
      }
    }
  };

  const handleApply = () => {
    if (resultat && onResult) {
      onResult(resultat);
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">
        {t("seoFullTitle")}
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("keywordsAndAdvantages")}
          </label>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            placeholder={t("keywordsAdvantagesPlaceholder")}
            value={motsCles}
            onChange={(e) => setMotsCles(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("keywordsAdvantagesHelp")}
          </p>
        </div>

        <select
          className="border p-2 rounded"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
        >
          <option value="fr">{t("french")}</option>
          <option value="en">{t("english")}</option>
          <option value="de">{t("german")}</option>
          <option value="pl">{t("polish")}</option>
          <option value="ru">{t("russian")}</option>
        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 transition"
          disabled={chargement}
        >
          {chargement
            ? t("generationInProgress")
            : t("generateFullDescription")}
        </button>
      </div>

      {resultat && (
        <div className="bg-gray-100 p-4 rounded border flex flex-col gap-4">
          <h3 className="text-lg font-semibold">
            {t("generatedFullDescription")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{resultat}</p>
          <p className="text-sm text-gray-500">
            {t("length", { count: resultat.length })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white rounded p-2 hover:bg-green-700 transition"
            >
              {t("copyText")}
            </button>
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
            >
              {t("applyToField")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant IA amélioré pour les équipements communautaires
function IACOMMUNITYEnhanced({ projectData, onResult, onClose }) {
  const [listEquipement, setListEquipement] = useState("");
  const [detail, setDetail] = useState("");
  const [langue, setLangue] = useState("fr");
  const [resultat, setResultat] = useState("");
  const [chargement, setChargement] = useState(false);
  const t = useTranslations("IAComponents");
  const p = useTranslations("Projet");

  // Pré-remplir avec les équipements du projet
  useEffect(() => {
    if (projectData?.features) {
      const equipements = Object.keys(projectData.features)
        .filter((key) => projectData.features[key])
        .map((key) => p(key));
      setListEquipement(equipements.join(", "));
    }
  }, [projectData, p]);

  const handleGenerate = async () => {
    setChargement(true);

    try {
      const response = await fetch("/api/generateCommunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listEquipement, detail, langue }),
      });

      const data = await response.json();
      setResultat(data.text);
    } catch (error) {
      console.error("Erreur génération IA:", error);
      setResultat(t("generationError"));
    } finally {
      setChargement(false);
    }
  };

  const handleCopy = async () => {
    if (resultat) {
      try {
        await navigator.clipboard.writeText(resultat);
        alert(t("copySuccess"));
      } catch (err) {
        console.error("Erreur de copie :", err);
      }
    }
  };

  const handleApply = () => {
    if (resultat && onResult) {
      onResult(resultat);
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">
        {t("communityTitle")}
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("internalAmenities")}
          </label>
          <input
            className="w-full border p-2 rounded"
            placeholder={t("internalAmenitiesPlaceholder")}
            value={listEquipement}
            onChange={(e) => setListEquipement(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("additionalDetails")}
          </label>
          <textarea
            className="w-full border p-2 rounded"
            rows="2"
            placeholder={t("additionalDetailsPlaceholder")}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        <select
          className="border p-2 rounded"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
        >
          <option value="fr">{t("french")}</option>
          <option value="en">{t("english")}</option>
          <option value="de">{t("german")}</option>
          <option value="pl">{t("polish")}</option>
          <option value="ru">{t("russian")}</option>
        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 transition"
          disabled={chargement}
        >
          {chargement ? t("generationInProgress") : t("generateDescription")}
        </button>

        {resultat && (
          <div className="bg-gray-100 p-4 rounded border flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{t("generatedDescription")}</h3>
            <p className="text-gray-700 whitespace-pre-line">{resultat}</p>
            <p className="text-sm text-gray-500">
              {t("length", { count: resultat.length })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="bg-green-600 text-white rounded p-2 hover:bg-green-700 transition"
              >
                {t("copyText")}
              </button>
              <button
                onClick={handleApply}
                className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
              >
                {t("applyToField")}
              </button>
            </div>
          </div>
        )}
      </div>
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
  const f = useTranslations("Projet");
  const [openModalCommunity, setOpenModalCommunity] = useState(false);
  const [openModalSEO, setOpenModalSEO] = useState(false);
  const [openModalFullDescription, setOpenModalFullDescription] = useState(false);

  const {
    formData,
    features,
    isSaving,
    updateFormData,
    toggleFeature,
    saveProject,
  } = useProjectData(project, onProjectUpdate);

  // Préparer les données du projet pour les générateurs IA
  const projectDataForAI = {
    ...formData,
    features
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-lg flex flex-col justify-center items-center mb-8 text-black">
      <ProjectImages projectId={project.id} />
      
      <h2 className="text-2xl font-semibold text-black mb-4">
        {f("Modifier")}
      </h2>
      
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
            label={f("NomProjet")}
            value={formData.name}
            onChange={(value) => updateFormData('name', value)}
            maxLength={50}
            rows={1}
          />

          {/* Description complète */}
          <TextFieldWithAI
            label={f("DesPro")}
            value={formData.fulldescr}
            onChange={(value) => updateFormData('fulldescr', value)}
            maxLength={1500}
            rows={13}
            onAIGenerate={() => setOpenModalFullDescription(true)}
            aiButtonText={f("GenerateFullDescription")}
            projectData={projectDataForAI}
          />

          {/* Équipements communautaires */}
          <div className="flex flex-col mt-8">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                {f("CommunityAmenities")}
              </h2>
              <Button
                className="bg-transparent isIconOnly min-w-fit"
                onClick={() => setOpenModalCommunity(true)}
              >
                {f("GenerateAmenities")}
              </Button>
            </div>
            <TextFieldWithAI
              value={formData.coam}
              onChange={(value) => updateFormData('coam', value)}
              maxLength={1000}
              rows={9}
            />
          </div>

          {/* Description SEO */}
          <TextFieldWithAI
            label={f("DesSEO")}
            value={formData.des}
            onChange={(value) => updateFormData('des', value)}
            maxLength={150}
            rows={2}
            onAIGenerate={() => setOpenModalSEO(true)}
            aiButtonText={f("GenerateSEO")}
            projectData={projectDataForAI}
          />
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <button
        onClick={saveProject}
        className={`mt-8 brownbg text-black px-6 py-2 rounded-md ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSaving}
      >
        {isSaving ? f("Saving") : f("Sauvegarder")}
      </button>

      {/* Modales IA améliorées */}
      <AIModal
        isOpen={openModalCommunity}
        onClose={() => setOpenModalCommunity(false)}
      >
        <IACOMMUNITYEnhanced 
          projectData={projectDataForAI}
          onResult={(text) => updateFormData('coam', text)}
          onClose={() => setOpenModalCommunity(false)}
        />
      </AIModal>

      <AIModal
        isOpen={openModalSEO}
        onClose={() => setOpenModalSEO(false)}
      >
        <IASEOShort 
          projectData={projectDataForAI}
          onResult={(text) => updateFormData('des', text)}
          onClose={() => setOpenModalSEO(false)}
        />
      </AIModal>

      <AIModal
        isOpen={openModalFullDescription}
        onClose={() => setOpenModalFullDescription(false)}
      >
        <IASEOFull 
          projectData={projectDataForAI}
          onResult={(text) => updateFormData('fulldescr', text)}
          onClose={() => setOpenModalFullDescription(false)}
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
