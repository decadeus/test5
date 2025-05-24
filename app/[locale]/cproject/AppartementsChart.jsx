import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

// Exemple de données : à générer dynamiquement depuis Supabase
const data = [
  { date: '2025-05-01', entrees: 3, sorties: 1 },
  { date: '2025-05-02', entrees: 2, sorties: 0 },
  { date: '2025-05-03', entrees: 4, sorties: 3 },
];

export default function AppartementsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sorties" stroke="#f87171" name="Vendus/Retirés" />
      </LineChart>
    </ResponsiveContainer>
  );
}