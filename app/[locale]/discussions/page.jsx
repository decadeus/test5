"use client";
import React from "react";

export default function Page({ params }) {
  const { locale } = params;
  return <DiscoverClient locale={locale} />;
}

function DiscoverClient({ locale }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("relevant");
  const supabaseRef = React.useRef(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data: postList } = await supabase
        .from("post")
        .select("id, title, body, project_id, author_id, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      const ids = (postList || []).map(p => p.id);
      let voteSum = {};
      if (ids.length) {
        const { data: votes } = await supabase
          .from("vote")
          .select("target_id, value")
          .eq("target_type", "post")
          .in("target_id", ids);
        for (const v of votes || []) voteSum[v.target_id] = (voteSum[v.target_id] || 0) + (v.value || 0);
      }
      setPosts((postList || []).map(p => ({ ...p, scoreRaw: voteSum[p.id] || 0 })));
      setLoading(false);
    }
    load();
  }, []);

  function computeScore(item) {
    const upMinusDown = item.scoreRaw || 0;
    const ageHours = (Date.now() - new Date(item.created_at).getTime()) / 36e5;
    const k = 1 / 60;
    const base = Math.log10(Math.max(1, Math.abs(upMinusDown))) * Math.sign(upMinusDown);
    return base + ageHours * k;
  }

  function sortPosts(list) {
    if (sortBy === "recent") return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "top") return [...list].sort((a, b) => (b.scoreRaw || 0) - (a.scoreRaw || 0));
    return [...list].sort((a, b) => computeScore(b) - computeScore(a));
  }

  const sorted = sortPosts(posts);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Découvrir</h1>
      <div className="flex items-center justify-end mb-3 gap-2">
        <span className="text-sm">Tri</span>
        <select className="border rounded p-1 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="relevant">Pertinent</option>
          <option value="recent">Récent</option>
          <option value="top">Top</option>
        </select>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : sorted.length === 0 ? (
        <div className="text-gray-600">Aucune discussion.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(p => {
            const href = `/${locale}/discussions/${p.id}`;
            return (
              <a key={p.id} href={href} className="block p-4 bg-white rounded-md border border-gray-200 hover:shadow">
                <div className="text-sm text-gray-500 mb-1">{new Date(p.created_at).toLocaleDateString()}</div>
                <div className="font-semibold line-clamp-2">{p.title}</div>
                {p.body ? <div className="text-sm text-gray-700 mt-1 line-clamp-3">{p.body}</div> : null}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}


