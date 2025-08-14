"use client";
import React from "react";
import Head from "next/head";

export default function Page({ params }) {
  const { postId, locale } = params;
  return <PostClient postId={postId} locale={locale} />;
}

function PostClient({ postId, locale }) {
  const [post, setPost] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [answerText, setAnswerText] = React.useState("");
  const [error, setError] = React.useState(null);
  const [votes, setVotes] = React.useState({ post: 0, answers: {} });
  const supabaseRef = React.useRef(null);
  const [qaJsonLd, setQaJsonLd] = React.useState(null);
  const [profilesById, setProfilesById] = React.useState({});

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;

      const { data: p } = await supabase
        .from("post")
        .select("id, project_id, author_id, type, title, body, created_at, accepted_answer_id")
        .eq("id", postId)
        .single();
      if (!p) { setLoading(false); return; }

      let { data: ans } = await supabase
        .from("answer")
        .select("id, post_id, author_id, body, is_accepted, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      const { data: postVotes } = await supabase
        .from("vote")
        .select("value")
        .eq("target_type", "post")
        .eq("target_id", postId);
      let pv = 0; for (const v of postVotes || []) pv += v.value || 0;

      const answerIds = (ans || []).map(a => a.id);
      let av = {};
      if (answerIds.length) {
        const { data: aVotes } = await supabase
          .from("vote")
          .select("target_id, value")
          .eq("target_type", "answer")
          .in("target_id", answerIds);
        for (const v of aVotes || []) av[v.target_id] = (av[v.target_id] || 0) + (v.value || 0);
      }

      const authorIds = [p.author_id, ...(ans || []).map(a => a.author_id)].filter(Boolean);
      const uniqueAuthorIds = [...new Set(authorIds)];
      let profMap = {};
      if (uniqueAuthorIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, is_verified_promoter, organization_name")
          .in("id", uniqueAuthorIds);
        for (const pr of profs || []) profMap[pr.id] = pr;
      }

      function computeAnswerScore(a) {
        const base = Math.log10(Math.max(1, Math.abs(av[a.id] || 0))) * Math.sign(av[a.id] || 0);
        const ageHours = (Date.now() - new Date(a.created_at).getTime()) / 36e5;
        const k = 1 / 60;
        const boost = profMap[a.author_id]?.is_verified_promoter ? 0.3 : 0;
        return base + ageHours * k + boost;
      }
      const sortedAns = (ans || []).slice().sort((a, b) => {
        if (a.is_accepted && !b.is_accepted) return -1;
        if (!a.is_accepted && b.is_accepted) return 1;
        return computeAnswerScore(b) - computeAnswerScore(a);
      });

      setPost(p);
      setAnswers(sortedAns);
      setVotes({ post: pv, answers: av });
      setProfilesById(profMap);
      setLoading(false);

      if (p?.type === 'question') {
        const accepted = (sortedAns || []).find(a => a.is_accepted) || null;
        const suggested = (sortedAns || []).filter(a => !a.is_accepted);
        const json = {
          "@context": "https://schema.org",
          "@type": "QAPage",
          "mainEntity": {
            "@type": "Question",
            "name": p.title,
            ...(accepted ? {
              "acceptedAnswer": {
                "@type": "Answer",
                "text": accepted.body,
                "upvoteCount": (av[accepted.id] || 0) + 0,
                "author": profilesById[accepted.author_id]?.is_verified_promoter
                  ? { "@type": "Organization", "name": profilesById[accepted.author_id]?.organization_name || "Promoteur vérifié" }
                  : { "@type": "Person", "name": "Utilisateur" }
              }
            } : {}),
            ...(suggested.length ? {
              "suggestedAnswer": suggested.map(s => ({
                "@type": "Answer",
                "text": s.body,
                "upvoteCount": av[s.id] || 0,
                "author": profilesById[s.author_id]?.is_verified_promoter
                  ? { "@type": "Organization", "name": profilesById[s.author_id]?.organization_name || "Promoteur vérifié" }
                  : { "@type": "Person", "name": "Utilisateur" }
              }))
            } : {})
          }
        };
        setQaJsonLd(json);
      } else {
        setQaJsonLd(null);
      }
    }
    load();
  }, [postId]);

  async function vote(targetType, targetId, value) {
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;
    await supabase.from("vote").upsert({
      user_id: user.user.id,
      target_type: targetType,
      target_id: targetId,
      value,
    }, { onConflict: "user_id,target_type,target_id" });
    setVotes(prev => {
      const copy = { ...prev };
      if (targetType === "post") copy.post = (copy.post || 0) + value;
      else copy.answers = { ...copy.answers, [targetId]: (copy.answers[targetId] || 0) + value };
      return copy;
    });
  }

  async function submitAnswer() {
    setError(null);
    if (!answerText.trim()) return;
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) { setError("Connexion requise"); return; }
    const { error: insErr } = await supabase.from("answer").insert({ post_id: postId, author_id: user.user.id, body: answerText.trim() });
    if (insErr) { setError(insErr.message); return; }
    setAnswerText("");
    const { data: ans } = await supabase
      .from("answer")
      .select("id, post_id, author_id, body, is_accepted, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setAnswers(ans || []);
  }

  async function acceptAnswer(answerId) {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;
      if (user.user.id !== post.author_id) return;
      const { error } = await supabase.from("answer").update({ is_accepted: true }).eq("id", answerId);
      if (!error) setAnswers(prev => prev.map(a => ({ ...a, is_accepted: a.id === answerId ? true : false })));
    } catch {}
  }

  if (loading) return <main className="max-w-3xl mx-auto p-4">Chargement…</main>;
  if (!post) return <main className="max-w-3xl mx-auto p-4">Introuvable</main>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      {qaJsonLd ? (
        <Head>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(qaJsonLd) }} />
        </Head>
      ) : null}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <button aria-label="Upvote" className="px-2" onClick={() => vote("post", post.id, 1)}>▲</button>
          <div className="text-sm font-semibold">{votes.post || 0}</div>
          <button aria-label="Downvote" className="px-2" onClick={() => vote("post", post.id, -1)}>▼</button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {post.body ? <p className="mt-2 whitespace-pre-line text-gray-800">{post.body}</p> : null}
          <div className="text-xs text-gray-500 mt-1">{new Date(post.created_at).toLocaleString()}</div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold mb-3">Réponses</h2>
        <div className="flex flex-col gap-3">
          {answers.map(a => (
            <div key={a.id} className={`p-4 bg-white rounded-md border ${a.is_accepted ? 'border-green-500' : 'border-gray-200'}`}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <button aria-label="Upvote" className="px-2" onClick={() => vote("answer", a.id, 1)}>▲</button>
                  <div className="text-sm font-semibold">{votes.answers[a.id] || 0}</div>
                  <button aria-label="Downvote" className="px-2" onClick={() => vote("answer", a.id, -1)}>▼</button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {a.is_accepted ? <div className="text-xs text-green-700">Meilleure réponse</div> : null}
                    {profilesById[a.author_id]?.is_verified_promoter ? (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
                        Promoteur vérifié{profilesById[a.author_id]?.organization_name ? ` – ${profilesById[a.author_id]?.organization_name}` : ''}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm whitespace-pre-line">{a.body}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(a.created_at).toLocaleString()}</div>
                  {!a.is_accepted ? (
                    <button className="text-xs text-green-700 underline mt-2" onClick={() => acceptAnswer(a.id)}>
                      Accepter comme meilleure réponse
                    </button>
                  ) : null}
                  <button className="text-xs text-red-700 underline mt-2 ml-3" onClick={async () => {
                    const { createClient } = await import("@/utils/supabase/client");
                    if (!supabaseRef.current) supabaseRef.current = createClient();
                    const supabase = supabaseRef.current;
                    const { data: user } = await supabase.auth.getUser();
                    if (!user?.user) return;
                    await supabase.from("report").insert({ reporter_id: user.user.id, target_type: 'answer', target_id: a.id, reason: 'user_report' });
                  }}>Signaler</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md border border-gray-200 p-4 mt-4">
          <h3 className="font-semibold mb-2">Ajouter une réponse</h3>
          <textarea className="border rounded p-2 w-full min-h-[120px]" value={answerText} onChange={e => setAnswerText(e.target.value)} />
          {error ? <div className="text-red-600 text-sm mt-2">{error}</div> : null}
          <div className="mt-2">
            <button onClick={submitAnswer} className="bg-green-700 text-white px-4 py-2 rounded">Publier</button>
          </div>
        </div>
      </section>
    </main>
  );
}


