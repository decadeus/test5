import React, { useState, useEffect } from "react";
import ProjectImages from "./ProjectImages";
import { createClient } from "@/utils/supabase/client";

import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { companies } from "@/utils/companies";
import { countryData } from "@/utils/countryData";
import { useTranslations } from "next-intl";
import IASEO from "./iaseo";
import IASEOTitle from "./iaseotitle";
import IAGENERALE from "./iagenerale";
import IACOMMUNITY from "./iacommunity";
import { FaQuestionCircle } from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function Maindata({ project, onProjectUpdate }) {
  const supabase = createClient();
  const t = useTranslations("Projet");

  // Contrôle local via les props projet (pas besoin de fetch initial)
  const [editableCompagny, setEditableCompagny] = useState(
    project?.compagny || ""
  );

  const [editableName, setEditableName] = useState(project?.name || "");
  const [editableCountry, setEditableCountry] = useState(
    project?.country || ""
  );
  const [editableCity, setEditableCity] = useState(project?.city || "");
  const [editableLat, setEditableLat] = useState(project?.lat || "");
  const [editableLng, setEditableLng] = useState(project?.lng || "");
  const [editableLink, setEditableLink] = useState(project?.link || "");
  const [editableCurrency, setEditableCurrency] = useState(
    project?.cur || ""
  );
  const [isOnline, setIsOnline] = useState(project?.online || false);
  const [editableDes, setEditableDes] = useState(project?.des || "");
  const [editableCoam, setEditableCoam] = useState(project?.coam || "");
  const [editableAponsel, setEditableAponsel] = useState(
    project?.aponsel || ""
  );
  const [editableFulldescr, setEditableFulldescr] = useState(
    project?.fulldescr || ""
  );
  const [editableTitle, setEditableTitle] = useState(project?.title || "");
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

  // Update les états quand le projet change
  useEffect(() => {
    setEditableCompagny(project?.compagny || "");
    setEditableName(project?.name || "");
    setEditableCountry(project?.country || "");
    setEditableCity(project?.city || "");
    setEditableLat(project?.lat || "");
    setEditableLng(project?.lng || "");
    setEditableLink(project?.link || "");
    setEditableCurrency(project?.cur || "");
    setIsOnline(project?.online || false);
    setEditableDes(project?.des || "");
    setEditableCoam(project?.coam || "");
    setEditableTitle(project?.title || "");
    setEditableFulldescr(project?.fulldescr || "");
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

  const [openModalCommunity, setOpenModalCommunity] = useState(false);
  const [openModalSEO, setOpenModalSEO] = useState(false);
  const [openModalSEOTitle, setOpenModalSEOTitle] = useState(false);
  const [openModalGenerale, setOpenModalGenerale] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    if (
      !editableCompagny ||
      !editableName ||
      !editableCountry ||
      !editableCity ||
      !editableLat ||
      !editableLng
    ) {
      alert("All fields are required.");
      setIsSaving(false);
      return;
    }

    // Construire l'objet updates sans inclure pricetype vide
    const updates = {
      compagny: editableCompagny,
      name: editableName,
      country: editableCountry,
      city: editableCity,
      lat: editableLat,
      lng: editableLng,
      cur: editableCurrency,
      link: editableLink,
      des: editableDes,
      coam: editableCoam,
      title: editableTitle,
      fulldescr: editableFulldescr,
      online: isOnline,
      ...features,
    };
    // N'inclure pricetype que s'il est défini et non vide
    if (project.pricetype) {
      updates.pricetype = project.pricetype;
    }

    const { error } = await supabase
      .from("project")
      .update(updates)
      .eq("id", project.id); // C'EST BIEN project.id ICI

    if (error) {
      console.error("❌ Supabase update error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      alert("Failed to save data.");
    } else {
      // Recharger le projet et appeler onProjectUpdate
      const { data: updatedProject, error: fetchError } = await supabase
        .from("project")
        .select("*")
        .eq("id", project.id)
        .single();

      if (!fetchError && updatedProject && onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }

      alert("Data successfully saved");
    }

    setIsSaving(false);
  };
  const toggleFeature = (feature) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [feature]: !prevFeatures[feature],
    }));
  };

  const CountryCitySelector = ({
    editableCountry,
    setEditableCountry,
    editableCity,
    setEditableCity,
  }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
      if (editableCountry && countryData[editableCountry]) {
        setCities(countryData[editableCountry]);
      } else {
        setCities([]);
      }
    }, [editableCountry]);

    const handleCountryChange = (e) => {
      const selectedCountry = e.target.value;
      setEditableCountry(selectedCountry);

      // Ensure city is cleared when switching countries
      if (countryData[selectedCountry]) {
        setEditableCity(countryData[selectedCountry][0]);
      } else {
        setEditableCity("");
      }
    };

    const handleCityChange = (e) => {
      setEditableCity(e.target.value);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-black w-[900px]">
        <div className="flex flex-col">
          <label className="text-black mb-1">{t("Pays")}</label>
          <select
            value={editableCountry}
            onChange={handleCountryChange}
            className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px] ${bginput} `}
          >
            <option value="__">__</option>
            {Object.keys(countryData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col ">
          <label className="text-black mb-1">{t("Ville")}</label>
          <select
            value={editableCity}
            onChange={handleCityChange}
            className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px] ${bginput}`}
            disabled={!editableCountry}
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
  };

  const bginput = "bg-gray-100 text-black";
  const label = "text-gray-900 mb-1";

  // Fonction pour obtenir la langue en fonction du pays
  const getLanguageFromCountry = (country) => {
    switch (country) {
      case 'France':
        return 'fr';
      case 'Polska':
        return 'pl';
      case 'Deutschland':
        return 'de';
      default:
        return 'fr'; // Langue par défaut
    }
  };

  return (
    <div className=" mt-10 p-6 bg-white rounded-lg flex flex-col justify-center items-center mb-8 text-black">
      <div className="mb-8 w-full">
        <ProjectImages
          projectId={project?.id}
          projectName={project?.name}
          projectCity={project?.city}
        />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">{editableName}</h2>
      <div className="flex gap-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <div className="flex flex-col mb-4">
              <label className="text-black mb-1">{t("COMPAGNIE")}</label>
              <select
                value={editableCompagny}
                onChange={(e) => setEditableCompagny(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px] ${bginput}`}
              >
                <option value="" disabled>
                  {t("SELECT_COMPAGNIE")}
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="">
            <CountryCitySelector
              editableCountry={editableCountry}
              setEditableCountry={setEditableCountry}
              editableCity={editableCity}
              setEditableCity={setEditableCity}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <div className="flex flex-col">
              <label className={`${label}`}>{t("LATITUDE")}</label>
              <input
                type="text"
                value={editableLat}
                onChange={(e) => setEditableLat(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput} `}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black mb-1">{t("LONGITUDE")}</label>
              <input
                type="text"
                value={editableLng}
                onChange={(e) => setEditableLng(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput}`}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black mb-1">{t("MONNAIE")}</label>
              <select
                value={editableCurrency}
                onChange={(e) => setEditableCurrency(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px] ${bginput}`}
              >
                <option value="EUR">EUR</option>
                <option value="PLN">PLN</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-black mb-1">{t("LIEN")}</label>
              <input
                type="text"
                value={editableLink}
                onChange={(e) => setEditableLink(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput}`}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center"></div>
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
                  <p className="ml-2 capitalize truncate">{t(feature)}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-col pb-4 mt-8">
            <div className="flex flex-col pt-4">
              <label className="text-black mb-1 flex">
                {t("PROJET_EN_LIGNE")}
                <span className="text-black flex items-center ml-2">
                  <span>{isOnline ? t("ONLINE") : t("OFFLINE")}</span>
                  {isOnline ? (
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
                checked={isOnline}
                onChange={() => setIsOnline(!isOnline)}
                className="hidden"
              />
              <label
                htmlFor="onlineSwitch"
                className="flex items-center cursor-pointer"
                aria-label={t("TOGGLE_ONLINE_STATUS")}
              >
                <div
                  className={`w-10 h-6 flex items-center rounded-full p-1 ${
                    isOnline ? "bg-green-500" : "bg-red-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isOnline ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Séparateur visuel avant la section Description */}
          <div className="flex items-center gap-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-700">{t("DESCRIPTION")}</h3>
            <Divider className="flex-1 bg-gray-300 h-[1px]" />
          </div>

          {/* Bloc description + SEO refait en flex */}
          <div className="flex flex-col gap-8 mt-8">
            {/* Bloc pleine largeur : description + community, ENCADRÉ */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
              <div className="flex flex-col gap-8 w-full">
                {/* Description du projet */}
                <div className="flex flex-col bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                      {t("DESCRIPTION_PROJET")}
                    </h2>
                    <Button
                      className="bg-transparent isIconOnly min-w-fit"
                      onClick={() => setOpenModalGenerale(true)}
                    >
                      🤖 {t("GENERER_IA")}
                    </Button>
                  </div>
                  <textarea
                    value={
                      editableFulldescr.length > 1500
                        ? editableFulldescr.slice(0, 1500)
                        : editableFulldescr
                    }
                    onChange={(e) => setEditableFulldescr(e.target.value.slice(0, 1500))}
                    rows="14"
                    className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bginput} mt-2`}
                  />
                  <span className="text-gray-400 text-sm mt-1">
                    {editableFulldescr ? editableFulldescr.length : 0}/1500 {t("CARACTERES")}
                  </span>
                </div>

                {/* Community Amenities */}
                <div className="flex flex-col bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                      {t("COMMUNITY_AMENITIES")}
                    </h2>
                    <Button
                      className="bg-transparent isIconOnly min-w-fit"
                      onClick={() => setOpenModalCommunity(true)}
                    >
                      🤖 {t("GENERER_IA")}
                    </Button>
                  </div>
                  <textarea
                    value={
                      editableCoam && editableCoam.length > 1000
                        ? editableCoam.slice(0, 1000)
                        : editableCoam
                    }
                    onChange={(e) => setEditableCoam(e.target.value.slice(0, 1000))}
                    rows="9"
                    className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bginput} mt-2`}
                  />
                  <span className="text-gray-400 text-sm mt-1">
                    {editableCoam ? editableCoam.length : 0}/1000 {t("CARACTERES")}
                  </span>
                </div>
              </div>
            </div>

            {/* Section SEO encadrée */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm mt-6">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-700">SEO</h3>
                <Divider className="flex-1 bg-gray-300 h-[1px]" />
              </div>
              <div className="flex flex-wrap gap-8">
                {/* SEO Title */}
                <div className="flex-1 min-w-[300px] bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="flex flex-col">
                    <div className="w-full flex items-center justify-between mb-2">
                      <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                        {t("DesSEOTitle")}
                      </h2>
                      <Button
                        className="bg-transparent isIconOnly min-w-fit"
                        onClick={() => setOpenModalSEOTitle(true)}
                      >
                        🤖 {t("GENERER_IA")}
                      </Button>
                    </div>
                    <textarea
                      value={editableTitle}
                      onChange={(e) => setEditableTitle(e.target.value.slice(0, 60))}
                      placeholder={t("PLACEHOLDER_SEO_TITLE")}
                      rows="2"
                      className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bginput}`}
                    />
                    <span className="text-gray-400 text-sm mt-1">
                      {editableTitle ? editableTitle.length : 0}/60 {t("CARACTERES")}
                    </span>
                  </div>
                </div>

                {/* SEO Description */}
                <div className="flex-1 min-w-[300px] bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="flex flex-col">
                    <div className="w-full flex items-center justify-between mb-2">
                      <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                        {t("DesSEO")}
                      </h2>
                      <Button
                        className="bg-transparent isIconOnly min-w-fit"
                        onClick={() => setOpenModalSEO(true)}
                      >
                        🤖 {t("GENERER_IA")}
                      </Button>
                    </div>
                    <textarea
                      value={editableDes}
                      onChange={(e) => setEditableDes(e.target.value.slice(0, 150))}
                      placeholder={t("PLACEHOLDER_SEO_DESCRIPTION")}
                      rows="3"
                      className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bginput}`}
                    />
                    <span className="text-gray-400 text-sm mt-1">
                      {editableDes ? editableDes.length : 0}/150 {t("CARACTERES")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-10 p-4 border border-yellow-300 bg-yellow-50 rounded-md text-center">
        <p className="text-sm text-yellow-800 mb-3">
          {t("SAVE_REMINDER")}
        </p>
        <button
          onClick={handleSave}
          className={`brownbg text-black px-6 py-2 rounded-md ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSaving}
        >
          {isSaving ? t("SAVING") : t("SAUVEGARDER")}
        </button>
      </div>

      {/* Modales IA */}
      <Modal 
        isOpen={openModalSEOTitle} 
        onClose={() => setOpenModalSEOTitle(false)}
        size="sm"
        className="min-h-[200px]"
      >
        <ModalContent>
          <ModalHeader className="text-xl">{t("MODAL_TITLE_SEO")}</ModalHeader>
          <ModalBody>
            <IASEOTitle 
              project={{...project, langue: getLanguageFromCountry(editableCountry)}}
              onClose={(text) => {
                if (text) {
                  setEditableTitle(text);
                }
                setOpenModalSEOTitle(false);
              }} 
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={openModalSEO} onClose={() => setOpenModalSEO(false)}>
        <ModalContent>
          <ModalHeader>{t("MODAL_TITLE_SEO_DESCRIPTION")}</ModalHeader>
          <ModalBody>
            <IASEO 
              project={{...project, langue: getLanguageFromCountry(editableCountry)}}
              onClose={() => setOpenModalSEO(false)} 
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={openModalGenerale} onClose={() => setOpenModalGenerale(false)}>
        <ModalContent>
          <ModalHeader>{t("MODAL_TITLE_DESCRIPTION")}</ModalHeader>
          <ModalBody>
            <IAGENERALE project={{...project, langue: getLanguageFromCountry(editableCountry)}} onClose={() => setOpenModalGenerale(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={openModalCommunity} onClose={() => setOpenModalCommunity(false)}>
        <ModalContent>
          <ModalHeader>{t("MODAL_TITLE_COMMUNITY")}</ModalHeader>
          <ModalBody>
            <IACOMMUNITY project={{...project, langue: getLanguageFromCountry(editableCountry)}} onClose={() => setOpenModalCommunity(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
