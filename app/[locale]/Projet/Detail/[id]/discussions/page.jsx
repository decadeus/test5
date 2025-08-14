"use client";
import React from "react";

export default function Page({ params }) {
  const { id: projectId, locale } = params;
  return <DiscussionsClient projectId={projectId} locale={locale} />;
}

function DiscussionsClient({ projectId, locale }) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("relevant"); // relevant | recent | top
  const [newPost, setNewPost] = React.useState({ type: "question", title: "", body: "" });
  const [error, setError] = React.useState(null);
  const supabaseRef = React.useRef(null);
  const [authorProfiles, setAuthorProfiles] = React.useState({}); // id -> { is_verified_promoter, organization_name }

  // Prefill from query params
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const title = params.get("title");
      const type = params.get("type");
      const body = params.get("body");
      setNewPost(prev => ({
        type: type && ["question","advice","site_update","ama"].includes(type) ? type : prev.type,
        title: title || prev.title,
        body: body || prev.body,
      }));
    } catch {}
  }, []);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;

      const { data: postList, error: postErr } = await supabase
        .from("post")
        .select("id, author_id, type, title, body, created_at, accepted_answer_id")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (postErr) {
        setError(postErr.message);
      }

      const postIds = (postList || []).map(p => p.id);
      let votesByPost = {};
      if (postIds.length) {
        const { data: votes } = await supabase
          .from("vote")
          .select("target_id, value")
          .eq("target_type", "post")
          .in("target_id", postIds);
        for (const v of votes || []) votesByPost[v.target_id] = (votesByPost[v.target_id] || 0) + (v.value || 0);
      }

      const enriched = (postList || []).map(p => ({ ...p, scoreRaw: votesByPost[p.id] || 0 }));

      // Try to fetch promoter verification flags; ignore errors if columns missing
      const authorIds = [...new Set(enriched.map(p => p.author_id).filter(Boolean))];
      let profilesMap = {};
      if (authorIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, is_verified_promoter, organization_name")
          .in("id", authorIds);
        for (const pr of profs || []) profilesMap[pr.id] = pr;
      }
      setAuthorProfiles(profilesMap);
      setPosts(enriched);
      setLoading(false);
    }
    load();
  }, [projectId]);

  function computeScore(item) {
    const upMinusDown = item.scoreRaw || 0;
    const ageHours = (Date.now() - new Date(item.created_at).getTime()) / 36e5;
    const k = 1 / 60; // ~1/60 smoothness
    const base = Math.log10(Math.max(1, Math.abs(upMinusDown))) * Math.sign(upMinusDown);
    const promoterBoost = authorProfiles[item.author_id]?.is_verified_promoter ? 0.3 : 0;
    return base + ageHours * k + promoterBoost;
  }

  function sortPosts(list) {
    if (sortBy === "recent") return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "top") return [...list].sort((a, b) => (b.scoreRaw || 0) - (a.scoreRaw || 0));
    return [...list].sort((a, b) => computeScore(b) - computeScore(a));
  }

  async function submitPost() {
    setError(null);
    if (!newPost.title.trim()) { setError("Titre requis"); return; }
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) { setError("Connexion requise"); return; }
    const insert = {
      project_id: projectId,
      author_id: user.user.id,
      type: newPost.type,
      title: newPost.title.trim(),
      body: newPost.body.trim() || null,
    };
    const { error: insErr } = await supabase.from("post").insert(insert);
    if (insErr) { setError(insErr.message); return; }
    setNewPost({ type: newPost.type, title: "", body: "" });
    // refresh
    const { data: postList } = await supabase
      .from("post")
      .select("id, author_id, type, title, body, created_at, accepted_answer_id")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setPosts(postList || []);
  }

  function PostCard({ post }) {
    const [score, setScore] = React.useState(post.scoreRaw || 0);
    const [reportMsg, setReportMsg] = React.useState(null);

    async function vote(value) {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;
      const payload = { user_id: user.user.id, target_type: "post", target_id: post.id, value };
      const { error: upErr } = await supabase.from("vote").upsert(payload, { onConflict: "user_id,target_type,target_id" });
      if (!upErr) setScore(prev => prev + value); // optimistic
    }

    async function report() {
      setReportMsg(null);
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) { setReportMsg("Connexion requise"); return; }
      const { error: rErr } = await supabase.from("report").insert({
        reporter_id: user.user.id,
        target_type: "post",
        target_id: post.id,
        reason: "user_report",
      });
      setReportMsg(rErr ? rErr.message : "Signalement envoyé");
    }

    const href = `/${locale}/discussions/${post.id}`;
    const isVerified = authorProfiles[post.author_id]?.is_verified_promoter;
    const org = authorProfiles[post.author_id]?.organization_name;
    return (
      <div className="flex gap-3 p-4 bg-white rounded-md border border-gray-200">
        <div className="flex flex-col items-center">
          <button aria-label="Upvote" className="px-2" onClick={() => vote(1)}>▲</button>
          <div className="text-sm font-semibold">{score}</div>
          <button aria-label="Downvote" className="px-2" onClick={() => vote(-1)}>▼</button>
        </div>
        <div className="flex-1">
          <a className="font-semibold hover:underline" href={href}>{post.title}</a>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(post.created_at).toLocaleString()} • {post.type}
            {isVerified ? (
              <span className="ml-2 inline-block text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
                Promoteur vérifié{org ? ` – ${org}` : ''}
              </span>
            ) : null}
          </div>
          {post.body ? <p className="text-sm mt-2 whitespace-pre-line text-gray-800">{post.body}</p> : null}
          <div className="mt-2 flex items-center gap-3">
            <button onClick={report} className="text-xs text-red-700 underline">Signaler</button>
            {reportMsg ? <span className="text-xs text-gray-500">{reportMsg}</span> : null}
          </div>
        </div>
      </div>
    );
  }

  const sorted = sortPosts(posts);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discussions du projet</h1>
      <div id="ask" className="bg-white rounded-md border border-gray-200 p-4 mb-6">
        <h2 className="font-semibold mb-3">Poser une question</h2>
        <div className="flex flex-col gap-3">
          <label className="text-sm">Type</label>
          <select className="border rounded p-2" value={newPost.type} onChange={e => setNewPost(v => ({ ...v, type: e.target.value }))}>
            <option value="question">Question</option>
            <option value="advice">Conseil/retour</option>
            <option value="site_update">Actu chantier</option>
            <option value="ama">AMA promoteur</option>
          </select>
          <input placeholder="Titre" className="border rounded p-2" value={newPost.title} onChange={e => setNewPost(v => ({ ...v, title: e.target.value }))} />
          <textarea placeholder="Détail (optionnel)" className="border rounded p-2 min-h-[100px]" value={newPost.body} onChange={e => setNewPost(v => ({ ...v, body: e.target.value }))} />
          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          <div>
            <button onClick={submitPost} className="bg-green-700 text-white px-4 py-2 rounded">Publier</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">{sorted.length} discussions</div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Tri</span>
          <select className="border rounded p-1 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="relevant">Pertinent</option>
            <option value="recent">Récent</option>
            <option value="top">Top</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : sorted.length === 0 ? (
        <div className="text-gray-600">Aucune discussion pour l’instant.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </main>
  );
}


