"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ApartmentDetail() {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apartment, setApartment] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const fetchApartment = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("project")
        .select("id, name, compagny, country, city")
        .eq("id", parseInt(id))
        .single();

      if (!error && data) {
        console.log("Project data:", data);
        setApartment({
          id: data.id,
          title: data.name,
          summary: data.compagny,
          price: data.country,
          city: data.city,
        });

        // Récupérer les images depuis le storage
        const { data: imageList, error: imageError } = await supabase
          .storage
          .from('project')
          .list(`${data.id}/`);

        console.log("Storage list result:", imageList);
        console.log("Storage list error:", imageError);

        if (!imageError && imageList) {
          const onlyFiles = imageList.filter(item => item.name && item.metadata);
          const imageUrls = onlyFiles.map((image) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('project')
              .getPublicUrl(`${data.id}/${image.name}`);
            console.log("Generated URL for image:", image.name, publicUrl);
            return publicUrl;
          });
          console.log("Final image URLs:", imageUrls);
          setImages(imageUrls);
        }
      }
      setLoading(false);
    };

    if (id) fetchApartment();
  }, [id]);

  if (!apartment) return <p>Appartement introuvable</p>;

  return (
    <div className="bg-green-100/10 min-h-screen w-full">
      <div
        className="w-full h-[400px] mb-8 shadow-md flex justify-center items-center relative"
        style={{
          backgroundImage: "url(/appart.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl font-bold mb-2">{apartment.title}</h1>
          <h2 className="text-xl text-black mb-2">{apartment.city}</h2>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-[320px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-2xl shadow-lg bg-white">
            {/* Slider track */}
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="min-w-full h-full flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${apartment.title} - Image ${index + 1}`}
                    className="object-cover w-full h-full rounded-2xl select-none"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
            {/* Flèches */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-2 rounded-full z-20 transition-colors border border-black"
              aria-label="Précédent"
            >
              <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-600 hover:text-white text-green-700 shadow-lg p-2 rounded-full z-20 transition-colors border border-black"
              aria-label="Suivant"
            >
              <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
            {/* Points */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full border-2 border-black transition-all duration-300 ${
                    idx === currentSlide ? "bg-green-600 scale-125 shadow" : "bg-white/80"
                  }`}
                  aria-label={`Aller à la slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune image disponible</p>
            <p className="text-sm text-gray-400 mt-2">ID du projet: {id}</p>
          </div>
        )}

        <p className="mb-4 text-gray-700 mt-8">{apartment.summary}</p>
        <div className="text-xl font-semibold text-green-600 mb-6">
          {apartment.price}
        </div>
        <Link
          href="../List"
          className="text-green-600 underline hover:text-green-800"
        >
          Retour à la liste
        </Link>
      </div>
    </div>
  );
}
