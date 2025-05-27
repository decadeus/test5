'use client';
import { useState, useEffect } from "react";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useCustomCursor from "./useCustomCursor";
import Statistics from "./Statistics";
import { createClient } from "@/utils/supabase/client";

function ProjectCard({ item, setShowCursor, setCursorLink }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    async function fetchMainImage() {
      const { data: files, error } = await supabase.storage.from("project").list(item.id);
      if (error || !files) return;

      const match = files
        .filter(f => f.name.startsWith("image1-"))
        .sort((a, b) => b.name.localeCompare(a.name))[0];

      if (match) {
        const path = `${item.id}/${match.name}`;
        const { data, error: downloadError } = await supabase.storage.from("project").download(path);
        if (!downloadError && data) {
          const blobUrl = URL.createObjectURL(data);
          setImageUrl(blobUrl);
        }
      }
    }
    fetchMainImage();
  }, [item.id]);

  // If you use supabase.storage.from("project").download(imageUrl) somewhere with a full URL, replace as specified.
  // Example usage (uncomment and adapt if you need to download the image file):
  // if (imageUrl) {
  //   const path = imageUrl.replace("https://igoqwthxpqjrnflhpkil.supabase.co/storage/v1/object/public/", "");
  //   const { data, error } = await supabase.storage.from("project").download(path);
  // }

  return (
    <div
      className="flex flex-col w-[250px] sm:w-[200px] md:w-[250px] lg:w-[350px] xl:w-[450px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-white transition-shadow duration-1000 hover:shadow-xl hover:shadow-slate-950"
      onMouseEnter={() => {
        setShowCursor(true);
        setCursorLink(item.link);
      }}
      onMouseLeave={() => {
        setShowCursor(false);
        setCursorLink("");
      }}
    >
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-[150px] sm:h-24 md:h-28 lg:h-[200px] xl:h-80">
          <Avatar url={imageUrl} width={270} height={196} className="rounded-sm" alt={item.name} />
        </div>
        <div className="mt-4">
          <p className="text-gray-700 font-satisfy font-extrabold text-2xl sm:text-lg lg:text-3xl">
            {item.name}
          </p>
          <p className="text-gray-700 text-[12px]">{item.adresse}</p>
          <p className="text-gray-700 text-[12px]">{item.city}, {item.country}</p>
          {item.des && (
            <p className="text-gray-700 text-sm pt-4">
              {item.des.length > 300 ? item.des.substring(0, 300) + "..." : item.des}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}

export default function ScrollProjectList({ projects, t, uniqueCompanies, uniqueIdeas, totalApartments }) {
  const { showCursor, setShowCursor, cursorLink, setCursorLink, CursorComponent } =
    useCustomCursor(t("EnSavoirPlus"));

  // Added state and effect to load images for todos (assuming todos is projects here)
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const supabase = createClient();

    async function fetchImages() {
      const newImageUrls = {};

      await Promise.all(projects.map(async (todo) => {
        const { data: files, error } = await supabase.storage.from("project").list(todo.id);
        if (error || !files) return;

        const match = files
          .filter((f) => f.name.startsWith("image1-"))
          .sort((a, b) => b.name.localeCompare(a.name))[0];

        if (match) {
          const path = `${todo.id}/${match.name}`;
          const { data: fileData, error: downloadError } = await supabase.storage.from("project").download(path);
          if (!downloadError && fileData) {
            const blobUrl = URL.createObjectURL(fileData);
            newImageUrls[todo.id] = blobUrl;
          }
        }
      }));

      setImageUrls(newImageUrls);
    }

    fetchImages();
  }, [projects]);

  return (
    <div className="flex flex-col justify-center mx-auto w-[350px] sm:w-[550px] md:w-[700px] lg:w-[950px] xl:w-[1100px] overflow-x-auto relative pt-24">
      <h2 className="font-macondo text-black text-4xl">{t("TitleNew")}</h2>

      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 ml-4">
            {projects
  .filter((p) => p.online)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 5)
  .map((item) => (
    <ProjectCard
      key={item.id}
      item={item}
      setShowCursor={setShowCursor}
      setCursorLink={setCursorLink}
      url={imageUrls[item.id]}
    />
))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" className="ScrollAreaScrollbar">
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </ScrollArea.Root>

      {showCursor && (
        <div className="hidden sm:block">
          <CursorComponent />
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Statistics
          uniqueCompanies={uniqueCompanies}
          uniqueIdeas={uniqueIdeas}
          totalApartments={totalApartments}
        />
      </div>
    </div>
  );
}