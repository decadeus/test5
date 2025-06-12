'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from "../Navbar";

import React from "react";
import { createClient } from '@/utils/supabase/client';

export default function ApartmentList() {
  const supabase = createClient();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('project')
        .select('id, name, compagny, country, city');

      if (error) {
        console.error("Supabase error:", error);
      } else {
        console.log("Supabase data:", data);
      }

      if (!error && data) {
        setApartments(
          data.map((item) => ({
            id: item.id,
            title: item.name,
            summary: item.compagny,
            price: item.country,
            city: item.city,
            imageUrl: '/images/placeholder.jpg', // temporaire
          }))
        );
      }
    };
    fetchProjects();
  }, []);

  const [selectedCity, setSelectedCity] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApartments = apartments.filter(a => {
    const matchesCity = selectedCity === 'Tous' || a.city === selectedCity;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="bg-green-100/10 min-h-screen w-full">
        <div
          className="w-full h-[400px] bg-cover bg-center mb-8 shadow-md"
          style={{ backgroundImage: 'url(/newheader.png)' }}
        ></div>
        <div className="max-w-6xl mx-auto px-4 mb-4 overflow-x-auto">
          <div className="flex gap-3 whitespace-nowrap">
            {['Tous', ...[...new Set(apartments.map(a => a.city))].sort()].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 border rounded-full transition-colors ${
                  selectedCity === city
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-green-700 border-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="w-full sm:w-1/2 px-4 py-2 border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="min-h-screen">
          <main className="max-w-6xl mx-auto px-4 py-8">
            {apartments.length === 0 && (
              <p className="text-center text-gray-500">Chargement en cours...</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApartments.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">Aucun résultat</p>
              ) : (
                filteredApartments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-green-100/50 text-gray-900 shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    <img
                      src={apt.imageUrl}
                      alt={apt.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col">
                      <h2 className="text-lg font-semibold mb-2">{apt.city}</h2>
                      <h2 className="text-lg font-semibold mb-2">{apt.title}</h2>
                      <p className="text-sm text-gray-600 flex-grow">{apt.summary}</p>
                      <div className="mt-4 text-right font-bold text-green-600">
                        {apt.price}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/fr/DesignTest/Detail/${apt.id}`}>
                          <button className="w-10 h-10 bg-green-600 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:rotate-90 flex items-center justify-center">
                            <PlusIcon className="w-5 h-5 text-white" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}