import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarComponent from "../cproject/image";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { companies } from "@/utils/companies";
import { countryData } from "@/utils/countryData";
import { useTranslations } from "next-intl";
import IASEO from "./iaseo";
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
import { FiDownload, FiUpload } from "react-icons/fi";


export default function Maindata({ project, onProjectUpdate }) {
  const supabase = createClient();
  const f = useTranslations("Projet");

  // Contrôle local via les props projet (pas besoin de fetch initial)
  const [editableCompagny, setEditableCompagny] = useState(
    project?.compagny || ""
  );
  const [user, setUser] = useState(null);

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
    setEditableAponsel(project?.aponsel || "");
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
      aponsel: editableAponsel,
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
      <div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-black w-[900px]">
       
        <div className="flex flex-col">
          <label className="text-black mb-1">{f("Pays")}</label>
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
          <label className="text-black mb-1">{f("Ville")}</label>
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
      </div>
    );
  };

  const bginput = "bg-gray-100 text-black";
  const label = "text-gray-900 mb-1";

  return (
    <div className=" mt-10 p-6 bg-white rounded-lg flex flex-col justify-center items-center mb-8 text-black">
    <ProjectImages projectId={project.id} />
      <h2 className="text-2xl font-semibold text-black mb-4">
        {f("Modifier")}
      </h2>
      <div className="flex gap-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <div className="flex flex-col mb-4">
              <label className="text-black mb-1">{f("Compagnie")}</label>
              <select
                value={editableCompagny}
                onChange={(e) => setEditableCompagny(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-[42px] ${bginput}`}
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
          </div>
          <div>
            <CountryCitySelector
              editableCountry={editableCountry}
              setEditableCountry={setEditableCountry}
              editableCity={editableCity}
              setEditableCity={setEditableCity}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <div className="flex flex-col">
              <label className={`${label}`}>{f("Latitude")}</label>
              <input
                type="text"
                value={editableLat}
                onChange={(e) => setEditableLat(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput} `}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black mb-1">{f("Longitude")}</label>
              <input
                type="text"
                value={editableLng}
                onChange={(e) => setEditableLng(e.target.value)}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput}`}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black mb-1">{f("Monnaie")}</label>
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
              <label className="text-black mb-1">{f("Link")}</label>
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
                  <p className="ml-2 capitalize truncate">{f(feature)}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-col pb-4 mt-8">
            <div className="flex flex-col pt-4">
              <label className="text-black mb-1 flex">
                {f("ProjetEnLigne")}
                <span className="text-black flex items-center ml-2">
                  <span>{isOnline ? "online" : "offline"}</span>{" "}
                  {/* Corrected this line */}
                  {isOnline ? (
                    <IoEye className="ml-2 text-xl text-green-600" />
                  ) : (
                    <IoMdEyeOff className="ml-2 text-xl text-red-600" />
                  )}
                </span>
              </label>
            </div>

            <div className="relative flex  ">
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
                aria-label="Toggle project online status"
              >
                <div
                  className={`w-10 h-6 flex  items-center rounded-full p-1 ${
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
          <Divider className="my-4" />

          <div className="flex flex-col  ">
            <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
              {f("NomProjet")}
            </h2>
            <input
              type="text"
              value={
                editableName && editableName.length > 50
                  ? editableName.slice(0, 50)
                  : editableName
              }
              onChange={(e) => setEditableName(e.target.value)}
              className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500  text-xl ${bginput} mt-2`}
            />
            <span className="text-gray-400 text-sm mt-1">
              {editableName ? editableName.length : 0}/50 characters
            </span>
          </div>

          <div className="flex flex-col mt-8 ">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                {f("DesPro")}
              </h2>
              <Popover placement="right">
                <PopoverTrigger>
                  <Button className="bg-transparent isIconOnly min-w-fit">
                    🤖 Générer avec l'IA
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <p className="text-tiny w-[300px]">
                      {f("DesSEOExplication")}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <textarea
              value={
                editableFulldescr.length > 1500
                  ? editableFulldescr.slice(0, 1500)
                  : editableFulldescr
              }
              onChange={(e) =>
                setEditableFulldescr(e.target.value.slice(0, 1500))
              }
              rows="13"
              className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${bginput} mt-2`}
            />
            <span className="text-gray-400 text-sm mt-1">
              {editableFulldescr ? editableFulldescr.length : 0}/1500 characters
            </span>
          </div>
          <div className="flex flex-col mt-8 ">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                Community Amenities
              </h2>
              <>
                <Button
                  className="bg-transparent isIconOnly min-w-fit"
                  onClick={() => setOpenModalCommunity(true)}
                >
                  🤖 Générer avec l'IA
                </Button>
                <Modal
                  isOpen={openModalCommunity}
                  onClose={() => setOpenModalCommunity(false)}
                  backdrop="blur"
                  size="lg"
                  scrollBehavior="inside"
                >
                  <ModalContent>
                    <ModalHeader>Générateur IA</ModalHeader>
                    <ModalBody>
                      <IACOMMUNITY />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={() => setOpen(false)}>
                        Fermer
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
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
              {editableCoam ? editableCoam.length : 0}/1000 characters
            </span>
          </div>
          <div className="flex flex-col mt-8 ">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-700">
                {f("DesSEO")}
              </h2>
              <>
                <Button
                  className="bg-transparent isIconOnly min-w-fit"
                  onClick={() => setOpenModalSEO(true)}
                >
                  🤖 Générer avec l'IA
                </Button>

                <Modal
                  isOpen={openModalSEO}
                  onClose={() => setOpenModalSEO(false)}
                  backdrop="blur"
                  size="lg"
                  scrollBehavior="inside"
                >
                  <ModalContent>
                    <ModalHeader>Générateur IA</ModalHeader>
                    <ModalBody>
                      <IASEO />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onClick={() => setOpen(false)}>
                        Fermer
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            </div>
            <textarea
              value={
                editableDes.length > 150
                  ? editableDes.slice(0, 150)
                  : editableDes
              }
              onChange={(e) => setEditableDes(e.target.value.slice(0, 150))}
              rows="2"
              className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${bginput}`}
            />
            <span className="text-gray-400 text-sm mt-1">
              {editableDes ? editableDes.length : 0}/150 characters
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        className={`mt-8 brownbg text-black px-6 py-2 rounded-md ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSaving}
      >
        {isSaving ? f("Saving") : f("Sauvegarder")}
      </button>
    </div>
  );
}

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
