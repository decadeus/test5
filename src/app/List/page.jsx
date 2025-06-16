'use client';

import { useState } from 'react';

const List = () => {
  const [items] = useState([
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
    { id: 4, title: 'Item 4', description: 'Description for item 4' },
    { id: 5, title: 'Item 5', description: 'Description for item 5' },
    { id: 6, title: 'Item 6', description: 'Description for item 6' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des éléments</h1>
      
      {/* Grid container avec responsive design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
            
            {/* Bouton responsive */}
            <button className="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
              Voir plus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List; 