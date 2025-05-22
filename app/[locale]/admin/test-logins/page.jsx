

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TestLoginsPage() {
  const [logins, setLogins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('test_logins')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setLogins(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test logins</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Mot de passe</th>
            <th className="border px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {logins.map((login) => (
            <tr key={login.id}>
              <td className="border px-4 py-2">{login.email}</td>
              <td className="border px-4 py-2">{login.password}</td>
              <td className="border px-4 py-2">{new Date(login.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}