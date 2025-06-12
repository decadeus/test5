'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ApartmentDetail() {
  const { id } = useParams();

  const [apartment, setApartment] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchApartment = async () => {
      const { data, error } = await supabase
        .from('project')
        .select('id, name, compagny, country, city')
        .eq('id', parseInt(id))
        .single();

      if (!error && data) {
        setApartment({
          id: data.id,
          title: data.name,
          summary: data.compagny,
          price: data.country,
          city: data.city,
          imageUrl: '/images/placeholder.jpg',
        });
      }
    };

    if (id) fetchApartment();
  }, [id]);

  if (!apartment) return <p>Appartement introuvable</p>;

  return (
    <div className="bg-green-100/10 min-h-screen w-full">
      <div
        className="w-full h-[400px] mb-8 shadow-md"
        style={{ 
          backgroundImage: 'url(/appart.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="max-w-6xl mx-auto px-4 mb-4 overflow-x-auto">
      <img src={apartment.imageUrl} alt={apartment.title} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-2xl font-bold mb-2">{apartment.title}</h1>
      <h2 className="text-xl text-green-700 mb-2">{apartment.city}</h2>
      <p className="mb-4 text-gray-700">{apartment.summary}</p>
      <div className="text-xl font-semibold text-green-600 mb-6">{apartment.price}</div>
      <Link href="../List" className="text-green-600 underline hover:text-green-800">
        Retour à la liste
      </Link>
    </div>
    </div>
  );
}
