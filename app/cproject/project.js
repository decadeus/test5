 "use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Project({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    ref: "",
    bed: "",
    floor: "",
    surface: "",
    price: "",
    garden: false,
  });
  const [sortColumn, setSortColumn] = useState("ref");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project")
        .select(`*, projectlist(*)`)
        .eq("ide", user?.id);

      if (error) {
        console.error("Error fetching projects:", error);
        setError(error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    }

    if (user?.id) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function handleSaveProject(project) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (error) {
      console.error("Error updating project:", error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id ? { ...p, ...formData, updated_at: new Date().toISOString() } : p
        )
      );
      setEditProject(null);
    }
  }

  async function handleSaveItem(item) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      console.error("Error updating item:", error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === item.ide
            ? {
                ...project,
                projectlist: project.projectlist.map((i) =>
                  i.id === item.id
                    ? { ...i, ...formData, updated_at: new Date().toISOString() }
                    : i
                ),
              }
            : project
        )
      );
      setEditItem(null);
    }
  }

  async function handleDelete(item) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Error deleting item:", error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === item.ide
            ? {
                ...project,
                projectlist: project.projectlist.filter((i) => i.id !== item.id),
              }
            : project
        )
      );
    }
  }

  async function handleAdd(project_id) {
    if (
      !newItem.ref ||
      !newItem.bed ||
      !newItem.floor ||
      !newItem.surface ||
      !newItem.price
    ) {
      console.error("All fields must be filled out.");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("projectlist")
      .insert([{ ...newItem, ide: project_id, updated_at: new Date().toISOString() }])
      .select();

    if (error) {
      console.error("Error adding item:", error);
    } else {
      if (data && data.length > 0) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === project_id
              ? { ...project, projectlist: [...project.projectlist, data[0]] }
              : project
          )
        );
        setNewItem({
          ref: "",
          bed: "",
          floor: "",
          surface: "",
          price: "",
          garden: false,
        });
      } else {
        console.error("No data returned from insert operation.");
      }
    }
  }

  async function handleGardenToggle(item) {
    const supabase = createClient();
    const newGardenValue = !item.garden;
    const { data, error } = await supabase
      .from("projectlist")
      .update({ garden: newGardenValue, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) {
      console.error("Error updating garden value:", error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === item.ide
            ? {
                ...project,
                projectlist: project.projectlist.map((i) =>
                  i.id === item.id
                    ? { ...i, garden: newGardenValue, updated_at: new Date().toISOString() }
                    : i
                ),
              }
            : project
        )
      );
    }
  }

  function handleEditProject(project) {
    setEditProject(project.id);
    setFormData({
      country: project.country,
      city: project.city,
      lng: project.lng,
      lat: project.lat,
      name: project.name,
    });
  }

  function handleEditItem(item) {
    setEditItem(item.id);
    setFormData({
      ref: item.ref,
      bed: item.bed,
      floor: item.floor,
      surface: item.surface,
      price: item.price,
      garden: item.garden,
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleNewItemChange(e) {
    const { name, value, type, checked } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Handle sorting
  function handleSort(column) {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
    setProjects((prevProjects) =>
      prevProjects.map((project) => ({
        ...project,
        projectlist: [...project.projectlist].sort((a, b) => {
          const aValue = a[column];
          const bValue = b[column];
          if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }),
      }))
    );
  }

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error fetching projects: {error.message}</p>;
  }

  const Th = "border border-gray-300 px-4 py-2 bg-gray-200 cursor-pointer";
  const Td = "border border-gray-300 px-4 py-2 text-center";
  const oddRow = "bg-gray-100";
  const evenRow = "bg-white";
  const listmain = "border border-gray-300 px-2 rounded w-fit bg-red-900 justify-center items-center flex text-white";

  return (
    <div className="flex flex-col w-full px-2 text-black bg-blue-950 gap-16 pt-16">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="flex flex-col mb-4">
            {editProject === project.id ? (
              <div className="flex w-fit gap-2">
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-300 px-2  rounded w-fit"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 rounded w-fit"
                />
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="border border-gray-300 px-2  rounded w-fit"
                />
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 rounded w-fit"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 px-2  rounded w-fit"
                />
                <button
                  onClick={() => handleSaveProject(project)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Save Project
                </button>
              </div>
            ) : (
              <div className="flex w-fit gap-2 ">
                <p className={listmain}>{project.compagny}</p>
                <p className={listmain}>{project.country}</p>
                <p className={listmain}>{project.city}</p>
                <p className={listmain}>{project.lng}</p>
                <p className={listmain}>{project.lat}</p>
                <p className={listmain}>{project.name}</p>
                <button
                  onClick={() => handleEditProject(project)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                >
                  Edit Project
                </button>
              </div>
            )}
            <table className="border-collapse w-full mt-4">
              <thead>
                <tr>
                  <th className={Th} onClick={() => handleSort("ref")}>
                    Ref
                  </th>
                  <th className={Th} onClick={() => handleSort("bed")}>
                    Bed
                  </th>
                  <th className={Th} onClick={() => handleSort("floor")}>
                    Floor
                  </th>
                  <th className={Th} onClick={() => handleSort("surface")}>
                    Surface
                  </th>
                  <th className={Th} onClick={() => handleSort("price")}>
                    Price
                  </th>
                  <th className={Th}>Garden</th>
                  <th className={Th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Add Item Row */}
                <tr className={oddRow}>
                  <td className={Td}>
                    <input
                      type="text"
                      name="ref"
                      value={newItem.ref}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className={Td}>
                    <input
                      type="text"
                      name="bed"
                      value={newItem.bed}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className={Td}>
                    <input
                      type="text"
                      name="floor"
                      value={newItem.floor}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className={Td}>
                    <input
                      type="text"
                      name="surface"
                      value={newItem.surface}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className={Td}>
                    <input
                      type="text"
                      name="price"
                      value={newItem.price}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className={Td}>
                    <input
                      type="checkbox"
                      name="garden"
                      checked={newItem.garden}
                      onChange={handleNewItemChange}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                  </td>
                  <td className={Td}>
                    <button
                      onClick={() => handleAdd(project.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>

                {project.projectlist.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? evenRow : oddRow}>
                    {editItem === item.id ? (
                      <>
                        <td className={Td}>
                          <input
                            type="text"
                            name="ref"
                            value={formData.ref}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className={Td}>
                          <input
                            type="text"
                            name="bed"
                            value={formData.bed}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className={Td}>
                          <input
                            type="text"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className={Td}>
                          <input
                            type="text"
                            name="surface"
                            value={formData.surface}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className={Td}>
                          <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        </td>
                        <td className={Td}>
                          <input
                            type="checkbox"
                            name="garden"
                            checked={formData.garden}
                            onChange={handleChange}
                            className="border border-gray-300 px-2 py-1 rounded"
                          />
                        </td>
                        <td className={Td}>
                          <button
                            onClick={() => handleSaveItem(item)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={Td}>{item.ref}</td>
                        <td className={Td}>{item.bed}</td>
                        <td className={Td}>{item.floor}</td>
                        <td className={Td}>{item.surface}</td>
                        <td className={Td}>{item.price}</td>
                        <td className={Td}>
                          <input
                            type="checkbox"
                            checked={item.garden}
                            onChange={() => handleGardenToggle(item)}
                            className="border border-gray-300 px-2 py-1 rounded"
                          />
                        </td>
                        <td className={Td}>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}
