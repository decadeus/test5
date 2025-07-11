"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Maindata from "./maindata";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiFlowerTulipBold } from "react-icons/pi";
import { useTranslations } from "next-intl";

export default function Projectb({ project, onProjectUpdate }) {
  const supabase = createClient();
  const [projectData, setProjectData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    ref: "",
    bed: "",
    floor: "",
    surface: "",
    price: "",
    garden: false,
    noprice: false,
    rooftop: false,
    des: "",
  });
  const [searchRef, setSearchRef] = useState("");
  const t = useTranslations("Navbar");
  const p = useTranslations("Projet");

  useEffect(() => {
    if (project?.id) fetchProjectData();
    // eslint-disable-next-line
  }, [project]);

  const fetchProjectData = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("*, projectlist(*)")
      .eq("id", project.id)
      .single();
    if (error) {
      // console.error("Erreur chargement projet:", error);
    } else {
      setProjectData(data);
    }
  };

  const handleEdit = (index) => setEditingIndex(index);

  const handleSave = async (index) => {
    const item = projectData.projectlist[index];
    const { error } = await supabase
      .from("projectlist")
      .update(item)
      .eq("id", item.id);

    if (!error) {
      setEditingIndex(null);
      fetchProjectData();
    }
  };

  const handleChange = (e, index, field) => {
    const updated = { ...projectData };
    updated.projectlist[index][field] =
      field === "garden" || field === "noprice" || field === "rooftop"
        ? e.target.checked
        : e.target.value;
    if (field === "price") {
      updated.projectlist[index].noprice = e.target.value === "";
    }
    setProjectData(updated);
  };

  const handleNewChange = (e, field) => {
    const value =
      field === "garden" || field === "noprice" || field === "rooftop"
        ? e.target.checked
        : e.target.value;
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewSave = async () => {
    if (!newItem.ref || !newItem.bed || !newItem.floor || !newItem.surface) {
      alert(p('required_fields_missing'));
      return;
    }
    const newItemToSave = { ...newItem, ide: project.id };
    const { error } = await supabase.from("projectlist").insert(newItemToSave);
    if (!error) {
      setNewItem({
        ref: "",
        bed: "",
        floor: "",
        surface: "",
        price: "",
        garden: false,
        noprice: false,
        rooftop: false,
        des: "",
      });
      fetchProjectData();
    }
  };

  const handleDelete = async (index) => {
    const item = projectData.projectlist[index];
    const { error } = await supabase
      .from("projectlist")
      .delete()
      .eq("id", item.id);

    if (!error) fetchProjectData();
    else console.error("Erreur suppression:", error);
  };

  const filteredList = projectData?.projectlist?.filter(
    (item) => item.ref?.toLowerCase().includes(searchRef.toLowerCase())
  ) || [];

  // Petites colonnes avec bordures visibles et hover ligne
  const colClasses =
    "px-2 py-1 border border-gray-200 text-sm text-center align-middle whitespace-nowrap";
  const inputClasses =
    "w-full border border-gray-300 rounded px-1 text-sm placeholder-gray-400 bg-white text-gray-800";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-16">
      {projectData && (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {projectData.name}
          </h1>
          <Maindata
            project={projectData}
            onProjectUpdate={(updatedProject) => {
              setProjectData(updatedProject);
              if (onProjectUpdate) onProjectUpdate(updatedProject);
            }}
          />

          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder={`${t('search')}: Ref`}
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="p-3 border border-black rounded-md bg-gray-100 placeholder-gray-500 text-gray-800 w-full max-w-xs"
            />
            <p className="text-gray-800 font-semibold text-base">
              {t('number_apartments')}: {filteredList.length}
            </p>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
            <table className="min-w-full table-auto text-sm border-collapse">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className={colClasses + " w-20"}>{t('ref')}</th>
                  <th className={colClasses + " w-12"}>{t('rooms')}</th>
                  <th className={colClasses + " w-12"}>{t('floors')}</th>
                  <th className={colClasses + " w-16"}>{t('surface')}</th>
                  <th className={colClasses + " w-24"}>{t('price')}</th>
                  <th className={colClasses + " w-16"}>{t('hide_price')}</th>
                  <th className={colClasses + " w-16"}>{t('garden')}</th>
                  <th className={colClasses + " w-16"}>Rooftop</th>
                  <th className={colClasses + " w-32"}>{t('special_info')}</th>
                  <th className={colClasses}>{t('action')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Ligne d'ajout */}
                <tr className="hover:bg-gray-50">
                  <td className={colClasses}>
                    <input
                      type="text"
                      value={newItem.ref}
                      onChange={(e) => handleNewChange(e, "ref")}
                      placeholder="Ref"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses}>
                    <input
                      type="number"
                      value={newItem.bed}
                      onChange={(e) => handleNewChange(e, "bed")}
                      placeholder="0"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses}>
                    <input
                      type="number"
                      value={newItem.floor}
                      onChange={(e) => handleNewChange(e, "floor")}
                      placeholder="0"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses}>
                    <input
                      type="number"
                      value={newItem.surface}
                      onChange={(e) => handleNewChange(e, "surface")}
                      placeholder="m²"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses}>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => handleNewChange(e, "price")}
                      placeholder="PLN"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses + " text-center"}>
                    <input
                      type="checkbox"
                      checked={newItem.noprice}
                      onChange={(e) => handleNewChange(e, "noprice")}
                    />
                  </td>
                  <td className={colClasses + " text-center"}>
                    <input
                      type="checkbox"
                      checked={newItem.garden}
                      onChange={(e) => handleNewChange(e, "garden")}
                    />
                  </td>
                  <td className={colClasses + " text-center"}>
                    <input
                      type="checkbox"
                      checked={newItem.rooftop}
                      onChange={(e) => handleNewChange(e, "rooftop")}
                    />
                  </td>
                  <td className={colClasses}>
                    <input
                      type="text"
                      value={newItem.des}
                      onChange={(e) => handleNewChange(e, "des")}
                      placeholder="Info"
                      className={inputClasses}
                    />
                  </td>
                  <td className={colClasses}>
                    <button
                      onClick={handleNewSave}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {p("Ajouter")}
                    </button>
                  </td>
                </tr>
                {/* Lignes existantes */}
                {filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          value={item.ref}
                          onChange={(e) =>
                            handleChange(e, index, "ref")
                          }
                          className={inputClasses}
                        />
                      ) : (
                        <span title={item.ref}>{item.ref || "-"}</span>
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={item.bed}
                          onChange={(e) =>
                            handleChange(e, index, "bed")
                          }
                          className={inputClasses}
                        />
                      ) : (
                        item.bed ?? "-"
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={item.floor}
                          onChange={(e) =>
                            handleChange(e, index, "floor")
                          }
                          className={inputClasses}
                        />
                      ) : (
                        item.floor ?? "-"
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={item.surface}
                          onChange={(e) =>
                            handleChange(e, index, "surface")
                          }
                          className={inputClasses}
                        />
                      ) : (
                        item.surface ?? "-"
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleChange(e, index, "price")
                          }
                          className={inputClasses}
                        />
                      ) : item.noprice ? (
                        <IoMdEyeOff className="mx-auto text-gray-500" />
                      ) : (
                        <span>
                          {(item.price ? item.price.toLocaleString() : "-") +
                            " " +
                            (project.currency || "")}
                        </span>
                      )}
                    </td>
                    <td className={colClasses + " text-center"}>
                      {editingIndex === index ? (
                        <input
                          type="checkbox"
                          checked={item.noprice}
                          onChange={(e) =>
                            handleChange(e, index, "noprice")
                          }
                        />
                      ) : item.noprice ? (
                        <IoMdEyeOff className="mx-auto text-gray-500" />
                      ) : (
                        <IoEye className="mx-auto text-gray-600" />
                      )}
                    </td>
                    <td className={colClasses + " text-center"}>
                      {editingIndex === index ? (
                        <input
                          type="checkbox"
                          checked={item.garden}
                          onChange={(e) =>
                            handleChange(e, index, "garden")
                          }
                        />
                      ) : item.garden ? (
                        <PiFlowerTulipBold className="text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className={colClasses + " text-center"}>
                      {editingIndex === index ? (
                        <input
                          type="checkbox"
                          checked={item.rooftop}
                          onChange={(e) =>
                            handleChange(e, index, "rooftop")
                          }
                        />
                      ) : item.rooftop ? (
                        <PiFlowerTulipBold className="text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <input
                          value={item.des}
                          onChange={(e) =>
                            handleChange(e, index, "des")
                          }
                          className={inputClasses}
                        />
                      ) : (
                        <span title={item.des}>{item.des || "-"}</span>
                      )}
                    </td>
                    <td className={colClasses}>
                      {editingIndex === index ? (
                        <button
                          onClick={() => handleSave(index)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          {p("Sauvegarder")}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-yellow-600 hover:underline mr-2 text-sm"
                          >
                            {p("Modifier2")}
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            {p("Supprimer")}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
