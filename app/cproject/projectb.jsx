"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import AvatarComponent from "@/app/cproject/image";

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
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("project")
      .select(`*, projectlist(*)`)
      .eq("ide", user.id);

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
    updatedProjects[projectIndex].projectlist[itemIndex][field] = field === 'garden' || field === 'noprice' ? e.target.checked : e.target.value;
    if (field === 'price') {
      updatedProjects[projectIndex].projectlist[itemIndex].noprice = e.target.value === "";
    }
    setProjects(updatedProjects);
  };

  const handleNewChange = (e, field) => {
    const value = field === 'garden' || field === 'noprice' ? e.target.checked : e.target.value;
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleNewSave = async (projectIndex) => {
    if (!newItem.ref || !newItem.bed || !newItem.floor || !newItem.surface) {
      alert("Please fill out all required fields.");
      return;
    }

    const newItemToSave = { ...newItem, ide: projects[projectIndex].id };

    const { error } = await supabase
      .from("projectlist")
      .insert(newItemToSave);

    if (error) {
      console.error("Error adding new item:", error);
    } else {
      setNewItem({
        ref: "",
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

  const sortTable = (key) => {
    if (key === 'noprice') return; // Skip sorting for 'noprice'
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedProjects = projects.map(project => ({
      ...project,
      projectlist: [...project.projectlist].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }),
    }));

    setProjects(sortedProjects);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (key === 'noprice') return ''; // Skip sort indicator for 'noprice'
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="w-full p-4">
      <AvatarComponent user={user} />

      {projects.map((project, projectIndex) => (
        <div key={projectIndex} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{project.compagny}</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortTable('ref')}>
                    Ref {getSortIndicator('ref')}
                  </th>
                  <th className="py-2 px-4 border-b text-right cursor-pointer" onClick={() => sortTable('bed')}>
                    Bed {getSortIndicator('bed')}
                  </th>
                  <th className="py-2 px-4 border-b text-right cursor-pointer" onClick={() => sortTable('floor')}>
                    Floor {getSortIndicator('floor')}
                  </th>
                  <th className="py-2 px-4 border-b text-right cursor-pointer" onClick={() => sortTable('surface')}>
                    Surface {getSortIndicator('surface')}
                  </th>
                  <th className="py-2 px-4 border-b text-right cursor-pointer" onClick={() => sortTable('price')}>
                    Price {getSortIndicator('price')}
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    No Price
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    Garden
                  </th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="py-2 px-4 border-b text-left">
                    <input
                      type="text"
                      value={newItem.ref}
                      onChange={(e) => handleNewChange(e, "ref")}
                      className="p-2 border rounded w-full"
                      placeholder="Ref"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <input
                      type="number"
                      value={newItem.bed}
                      onChange={(e) => handleNewChange(e, "bed")}
                      className="p-2 border rounded w-full text-right"
                      placeholder="Bed"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <input
                      type="number"
                      value={newItem.floor}
                      onChange={(e) => handleNewChange(e, "floor")}
                      className="p-2 border rounded w-full text-right"
                      placeholder="Floor"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <input
                      type="number"
                      value={newItem.surface}
                      onChange={(e) => handleNewChange(e, "surface")}
                      className="p-2 border rounded w-full text-right"
                      placeholder="Surface"
                    />
                  </td>
                  <td className={`py-2 px-4 border-b text-right ${newItem.noprice ? 'bg-gray-300' : ''}`}>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => handleNewChange(e, "price")}
                      className="p-2 border rounded w-full text-right"
                      placeholder="Price"
                      disabled={newItem.noprice}
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
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleNewSave(projectIndex)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
                {project.projectlist.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    {editing?.projectIndex === projectIndex && editing?.itemIndex === itemIndex ? (
                      <>
                        <td className="py-2 px-4 border-b text-left">
                          <input
                            type="text"
                            value={item.ref}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "ref")}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.bed}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "bed")}
                            className="w-full p-2 border rounded text-right"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.floor}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "floor")}
                            className="w-full p-2 border rounded text-right"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <input
                            type="number"
                            value={item.surface}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "surface")}
                            className="w-full p-2 border rounded text-right"
                          />
                        </td>
                        <td className={`py-2 px-4 border-b text-right ${item.noprice ? 'bg-gray-300' : ''}`}>
                          <input
                            type="number"
                            value={item.price || ""}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "price")}
                            className="w-full p-2 border rounded text-right"
                            disabled={item.noprice}
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <input
                            type="checkbox"
                            checked={item.noprice}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "noprice")}
                            className="w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <input
                            type="checkbox"
                            checked={item.garden}
                            onChange={(e) => handleChange(e, projectIndex, itemIndex, "garden")}
                            className="w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleSave(projectIndex, itemIndex)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b text-left">{item.ref}</td>
                        <td className="py-2 px-4 border-b text-right">{item.bed}</td>
                        <td className="py-2 px-4 border-b text-right">{item.floor}</td>
                        <td className="py-2 px-4 border-b text-right">{item.surface}</td>
                        <td className={`py-2 px-4 border-b text-right ${item.noprice ? 'bg-gray-300' : ''}`}>
                          {item.price || 'N/A'}
                        </td>
                        <td className={`py-2 px-4 border-b text-center ${item.noprice ? 'text-red-500' : 'text-green-500'}`}>
                          {item.noprice ? 'No Price' : 'Has Price'}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {item.garden ? '✔️' : '❌'}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleEdit(projectIndex, itemIndex)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </button>
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
