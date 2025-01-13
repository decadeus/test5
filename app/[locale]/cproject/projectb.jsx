"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Maindata from "./maindata";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiFlowerTulipBold } from "react-icons/pi";
import Select from "./select";
import { useTranslations } from "next-intl";

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
  const [searchRef, setSearchRef] = useState(""); // État pour la recherche

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

  // Filtrer les projets en fonction de la recherche "ref"
  const filteredProjects = projects.map((project) => ({
    ...project,
    projectlist: project.projectlist.filter((item) =>
      item.ref.toLowerCase().includes(searchRef.toLowerCase())
    ),
  }));

  // Calculer le nombre total de lignes
  const totalRows = filteredProjects.reduce(
    (total, project) => total + project.projectlist.length,
    0
  );

  return (
    <div className="w-full px-4 mt-16 ">
      {/* Champ de recherche */}

      {/* Afficher le nombre total d'appartements */}

      {filteredProjects.map((project, projectIndex) => (
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
              des={project.des}
              user={user}
            />
          </div>
          <div className="overflow-x-auto ">
            <div className="mb-4 flex justify-center items-center gap-12">
              <input
                type="text"
                placeholder={`${p("Rechercher:")} Ref`}
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="p-2 border-black border-1 rounded w-fit text-black"
              />
              <p className="text-[#12171E] text-center font-extrabold text-lg">
                {p("NombreAppartement")}: {totalRows}
              </p>
            </div>
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
                  <th className="py-2 px-4 border-b text-center">
                    {p("CacherLePrix")}
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    {p("jardin")}
                  </th>
                  <th
                    className="py-2 px-4 border-b text-center cursor-pointer "
                    onClick={() => sortTable("des")}
                  >
                    {p("InfoSpecial")} {getSortIndicator("des")}
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    {p("Action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#12171E] text-white">
                  <td className="py-2 px-4 border-b text-center ">
                    <input
                      type="text"
                      value={newItem.ref}
                      onChange={(e) => handleNewChange(e, "ref")}
                      className="p-2 border rounded  text-center text-black w-[130px]"
                      placeholder="ex: A001"
                      maxLength="10"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center ">
                    <input
                      type="number"
                      value={newItem.bed}
                      onChange={(e) => handleNewChange(e, "bed")}
                      className="p-2 border rounded  text-center text-black w-[70px]"
                      placeholder="ex: 1"
                      min="0" 
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center ">
                    <input
                      type="number"
                      value={newItem.floor}
                      onChange={(e) => handleNewChange(e, "floor")}
                      className="p-2 border rounded  text-center text-black w-[70px]"
                      placeholder="ex: 1"
                      min="0" 
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center ">
                    <input
                      type="number"
                      value={newItem.surface}
                      onChange={(e) => handleNewChange(e, "surface")}
                      className="p-2 border rounded  text-center text-black w-[100px]"
                      placeholder="ex: 65.10"
                      min="0" 
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center mx-auto">
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => handleNewChange(e, "price")}
                      className="p-2 border rounded  text-center text-black w-[130px]"
                      placeholder="ex: 250000"
                      min="0" 
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center mx-auto ">
                    <input
                      type="checkbox"
                      checked={newItem.noprice}
                      onChange={(e) => handleNewChange(e, "noprice")}
                      className="w-5 h-5 "
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center mx-auto">
                    <input
                      type="checkbox"
                      checked={newItem.garden}
                      onChange={(e) => handleNewChange(e, "garden")}
                      className="w-5 h-5 "
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center ">
                    <input
                      type="text"
                      value={newItem.des}
                      onChange={(e) => handleNewChange(e, "des")}
                      className="p-2 border rounded  text-center text-black w-[130px]"
                      maxLength="25"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left ">
                    <button
                      className="brownbg text-white px-4 py-2 rounded"
                      onClick={() => handleNewSave(projectIndex)}
                    >
                      {p("Ajouter")}
                    </button>
                  </td>
                </tr>

                {project.projectlist.map((item, itemIndex) => (
                  <tr key={itemIndex} className="bg-[#12171E] text-white">
                    <td className="py-2 px-4 border-b text-center ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="text"
                          value={item.ref}
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "ref")
                          }
                          className="p-2 border rounded  text-center text-black w-[130px]"
                          maxLength="10"
                        />
                      ) : (
                        <p className="text-center">{item.ref}</p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="number"
                          value={item.bed}
                          min="0" 
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "bed")
                          }
                          className="p-2 border rounded  text-center text-black w-[70px]"
                        />
                      ) : (
                        <p className="text-center">{item.bed}</p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="number"
                          value={item.floor}
                          min="0" 
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "floor")
                          }
                          className="p-2 border rounded  text-center text-black w-[70px]"
                        />
                      ) : (
                        <p className="text-center">{item.floor}</p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="number"
                          value={item.surface}
                          min="0" 
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "surface")
                          }
                          className="p-2 border rounded  text-center text-black w-[100px]"
                        />
                      ) : (
                        <p className="text-center">{item.surface}</p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="number"
                          value={item.price}
                          min="0" 
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "price")
                          }
                          className="p-2 border rounded  text-center text-black w-[130px]"
                        />
                      ) : item.noprice ? (
                        <IoMdEyeOff size={20} className="mx-auto" />
                      ) : (
                        <p className="text-center">
                          {item.price.toLocaleString()} {project.currency}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="checkbox"
                          checked={item.noprice}
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "noprice")
                          }
                          className="w-5 h-5 "
                        />
                      ) : item.noprice ? (
                        <IoMdEyeOff size={20} className="mx-auto text-center" />
                      ) : (
                        <IoEye size={20} className="mx-auto" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="checkbox"
                          checked={item.garden}
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "garden")
                          }
                          className="w-5 h-5"
                        />
                      ) : item.garden ? (
                        <PiFlowerTulipBold
                          size={20}
                          className="mx-auto text-green-500"
                        />
                      ) : null}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <input
                          type="text"
                          value={item.des}
                          onChange={(e) =>
                            handleChange(e, projectIndex, itemIndex, "des")
                          }
                          className="p-2 border rounded  text-center text-black w-[130px]"
                          maxLength="25"
                        />
                      ) : (
                        item.des
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-left ">
                      {editing &&
                      editing.projectIndex === projectIndex &&
                      editing.itemIndex === itemIndex ? (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => handleSave(projectIndex, itemIndex)}
                        >
                          {p("Sauvegarder")}
                        </button>
                      ) : (
                        <>
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleEdit(projectIndex, itemIndex)}
                          >
                            {p("Modifier2")}
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              handleDelete(projectIndex, itemIndex)
                            }
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
        </div>
      ))}
    </div>
  );
}
