"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Maindata from "./maindata";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiFlowerTulipBold } from "react-icons/pi";
import Select from "./select";
import { useTranslations} from "next-intl";

export default function Projectb({ user }) {
  const supabase = createClient();
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newItem, setNewItem] = useState({
    ref: "",
    bed: "",
    floor: "",
    surface: "",
    price: "",
    garden: false,
    noprice: false,
    des: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  const p = useTranslations("Projet");

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("project")
      .select(`*, projectlist(*)`)
      .eq("ide", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data);
    }
  };

  const handleEdit = (projectIndex, itemIndex) => {
    setEditing({ projectIndex, itemIndex });
  };

  const handleSave = async (projectIndex, itemIndex) => {
    const updatedProject = projects[projectIndex];
    const updatedItem = updatedProject.projectlist[itemIndex];

    const { error } = await supabase
      .from("projectlist")
      .update(updatedItem)
      .eq("id", updatedItem.id);

    if (error) {
      console.error("Error updating item:", error);
    } else {
      setEditing(null);
      fetchProjects();
    }
  };

  const handleChange = (e, projectIndex, itemIndex, field) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].projectlist[itemIndex][field] =
      field === "garden" || field === "noprice"
        ? e.target.checked
        : e.target.value;
    if (field === "price") {
      updatedProjects[projectIndex].projectlist[itemIndex].noprice =
        e.target.value === "";
    }
    setProjects(updatedProjects);
  };

  const handleNewChange = (e, field) => {
    const value =
      field === "garden" || field === "noprice"
        ? e.target.checked
        : e.target.value;
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewSave = async (projectIndex) => {
    if (!newItem.ref || !newItem.bed || !newItem.floor || !newItem.surface) {
      alert("Please fill out all required fields.");
      return;
    }

    const newItemToSave = { ...newItem, ide: projects[projectIndex].id };

    const { error } = await supabase.from("projectlist").insert(newItemToSave);

    if (error) {
      console.error("Error adding new item:", error);
    } else {
      setNewItem({
        ref: "",
        des: "",
        bed: "",
        floor: "",
        surface: "",
        price: "",
        garden: false,
        noprice: false,
      });
      fetchProjects();
    }
  };

  const handleDelete = async (projectIndex, itemIndex) => {
    const itemToDelete = projects[projectIndex].projectlist[itemIndex];

    if (!itemToDelete || !itemToDelete.id) {
      console.error("Item to delete is missing or does not have an ID.");
      return;
    }

    const { error } = await supabase
      .from("projectlist")
      .delete()
      .eq("id", itemToDelete.id);

    if (error) {
      console.error("Error deleting item:", error);
    } else {
      fetchProjects();
    }
  };

  const sortTable = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }

    const sortedProjects = projects.map((project) => ({
      ...project,
      projectlist: [...project.projectlist].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      }),
    }));

    setProjects(sortedProjects);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  // Calculate total number of rows
  const totalRows = projects.reduce(
    (total, project) => total + project.projectlist.length,
    0
  );

  return (
    <div className="w-full px-4 mt-16 ">
      {/* Display total number of rows */}
      <div className="mb-4"></div>

      {projects.map((project, projectIndex) => (
        <div key={projectIndex} className="mb-4">
          <div className="flex flex-col">
            <Maindata
              compagny={project.compagny}
              country={project.country}
              city={project.city}
              name={project.name}
              lat={project.lat}
              lng={project.lng}
              cur={project.currency}
              online={project.online}
              link={project.link}
              user={user}
            />
            <p className="text-[#12171E] text-center font-extrabold text-lg mb-4">
            {p("NombreAppartement")}: {totalRows}
            </p>
          </div>
          <div className="overflow-x-auto ">
            <table className="w-full bg-[#12171E] shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#12171E] text-white">
                <tr className="text-white">
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer "
                    onClick={() => sortTable("ref")}
                  >
                    Ref {getSortIndicator("ref")}
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => sortTable("bed")}
                  >
                    {p("Chambres")} {getSortIndicator("bed")}
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => sortTable("floor")}
                  >
                     {p("Etages")} {getSortIndicator("floor")}
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => sortTable("surface")}
                  >
                     {p("Surface")} {getSortIndicator("surface")}
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer"
                    onClick={() => sortTable("price")}
                  >
                     {p("Prix")} {getSortIndicator("price")}
                  </th>
                  <th className="py-2 px-4 border-b text-center">{p("CacherLePrix")}</th>
                  <th className="py-2 px-4 border-b text-center"> {p("jardin")}</th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer "
                    onClick={() => sortTable("des")}
                  >
                    {p("InfoSpecial")} {getSortIndicator("des")}
                  </th>
                  <th className="py-2 px-4 border-b text-center">{p("Action")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#12171E] text-white">
                  <td className="py-2 px-4 border-b text-left ">
                    <input
                      type="text"
                      value={newItem.ref}
                      onChange={(e) => handleNewChange(e, "ref")}
                      className="p-2 border rounded  text-center text-black w-[130px]"
                      placeholder="ex: AA0302"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right w-[60px]">
                    <input
                      type="number"
                      value={newItem.bed}
                      min={0}
                      onChange={(e) => handleNewChange(e, "bed")}
                      className="p-2 border rounded w-[60px] text-center text-black "
                      placeholder=""
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right w-[60px]">
                    <input
                      type="number"
                      value={newItem.floor}
                      onChange={(e) => handleNewChange(e, "floor")}
                      className="p-2 border rounded w-[60px] text-center text-black"
                      placeholder=""
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right w-[60px]">
                    <input
                      type="number"
                      value={newItem.surface}
                      min={0}
                      onChange={(e) => handleNewChange(e, "surface")}
                      className="p-2 border rounded w-[60px] text-center text-black"
                      placeholder=""
                    />
                  </td>
                  <td
                    className={`py-2 px-4 border-b text-right ${
                      newItem.noprice ? "bg-gray-800" : ""
                    }`}
                  >
                    <input
                    type="number"
                    value={newItem.price || 0}  // Valeur par défaut à 0
                    min={0}  // Valeur minimale à zéro
                    onChange={(e) => handleNewChange(e, "price")}  // Gestionnaire de changement
                    className="p-2 border rounded text-center text-black w-[120px]"
                    disabled={newItem.noprice}  // Désactivation conditionnelle
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="checkbox"
                      checked={newItem.noprice}
                      onChange={(e) => handleNewChange(e, "noprice")}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="checkbox"
                      checked={newItem.garden}
                      onChange={(e) => handleNewChange(e, "garden")}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    <input
                      type="text"
                      value={newItem.des}
                      onChange={(e) => handleNewChange(e, "des")}
                      className="p-2 border rounded w-full text-center text-black"
                      placeholder="ex: - 10%"
                      maxLength={25}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleNewSave(projectIndex)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                     {p("Ajouter")}
                    </button>
                  </td>
                </tr>
                {project.projectlist.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    {editing?.projectIndex === projectIndex &&
                    editing?.itemIndex === itemIndex ? (
                      <>
                        <td className="py-2 px-4 border-b text-left">
                          <input
                            type="text"
                            value={item.ref}
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "ref")
                            }
                            className="w-[130px] p-2 border rounded text-white"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.bed}
                            
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "bed")
                            }
                            className="p-2 border rounded text-right w-[60px]"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.floor}
                            min={0}
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "floor")
                            }
                            className="w-[60px] p-2 border rounded text-right"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.surface}
                            min={0}
                            onChange={(e) =>
                              handleChange(
                                e,
                                projectIndex,
                                itemIndex,
                                "surface"
                              )
                            }
                            className="w-[60px] p-2 border rounded text-right"
                          />
                        </td>
                        <td
                          className={`py-2 px-4 border-b text-right ${
                            item.noprice ? "bg-gray-800" : ""
                          }`}
                        >
                          <input
                            type="number"
                            value={
                              item.price !== undefined && item.price !== null
                                ? item.price
                                : 0
                            } // Si la valeur est définie, afficher sinon laisser vide
                            placeholder="N/A"
                            min={0}
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "price")
                            }
                            className="w-[120px] p-2 border rounded text-right"
                            disabled={item.noprice}
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <input
                            type="checkbox"
                            checked={item.noprice}
                            onChange={(e) =>
                              handleChange(
                                e,
                                projectIndex,
                                itemIndex,
                                "noprice"
                              )
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <input
                            type="checkbox"
                            checked={item.garden}
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "garden")
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-left">
                          <input
                            type="text"
                            value={item.des}
                            onChange={(e) =>
                              handleChange(e, projectIndex, itemIndex, "des")
                            }
                            className="w-full p-2 border rounded"
                            maxLength={25}
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleSave(projectIndex, itemIndex)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                          >
                           {p("Sauvegarder")}
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(projectIndex, itemIndex)
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                          >
                          {p("Supprimer")}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b text-center font-semibold text-white">
                          {item.ref}
                        </td>
                        <td className="py-2 px-4 border-b text-center text-white">
                          {item.bed}
                        </td>
                        <td className="py-2 px-4 border-b text-center text-white">
                          {item.floor}
                        </td>
                        <td className="py-2 px-4 border-b text-center text-white">
                          {item.surface}
                        </td>
                        <td
                          className={`py-2 px-4 border-b text-center text-white ${
                            item.noprice ? "bg-gray-800 text-black" : ""
                          }`}
                        >
                          {item.price || "N/A"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b text-center ${
                            item.noprice ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          <div className="flex items-center justify-center h-full">
                            {item.noprice ? (
                              <IoMdEyeOff className="text-xl" />
                            ) : (
                              <IoEye className="text-xl" />
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b text-center  ">
                          {item.garden ? (
                            <p className="flex justify-center items-center">
                            <PiFlowerTulipBold color="pink" size={20} />
                            </p>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="py-2 px-4 border-b text-center font-semibold text-white">
                          {item.des}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <div className="flex">
                            <button
                              onClick={() =>
                                handleEdit(projectIndex, itemIndex)
                              }
                              className="px-4 py-2 bg-yellow-500 text-white rounded"
                            >
                             {p("Modifier2")}
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(projectIndex, itemIndex)
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                            >
                             {p("Supprimer")}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
