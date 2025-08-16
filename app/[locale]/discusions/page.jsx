"use client";
import React from "react";

export default function Page({ params }) {
  const { locale } = params;
  return <CreatePost locale={locale} />;
}

function CreatePost({ locale }) {
  const [text, setText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [loadingPosts, setLoadingPosts] = React.useState(true);
  const [openThreadPostId, setOpenThreadPostId] = React.useState(null);
  const [answersByPost, setAnswersByPost] = React.useState({}); // postId -> answers[]
  const [replyByPost, setReplyByPost] = React.useState({}); // postId -> text
  const [sendingReplyFor, setSendingReplyFor] = React.useState(null);
  const [profilesById, setProfilesById] = React.useState({});
  const [postVotes, setPostVotes] = React.useState({}); // postId -> sum
  const [answerVotes, setAnswerVotes] = React.useState({}); // answerId -> sum
  const [category, setCategory] = React.useState('all'); // all | announcements | projects
  const [projects, setProjects] = React.useState([]); // {id, name, city, user_id}
  const [projectSearch, setProjectSearch] = React.useState("");
  const [projectFilterId, setProjectFilterId] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('qa'); // qa | announcement
  const [expandedProjectId, setExpandedProjectId] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = React.useState(false);
  const [isMainAdmin, setIsMainAdmin] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = React.useState({});
  const [showCreatePostModal, setShowCreatePostModal] = React.useState(false);
  // pas d'association projet dans le formulaire
  const supabaseRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  // Liste d'icônes organisées par catégories
  const emojiCategories = {
    'Immobilier': ['🏠', '🏡', '🏢', '🏗️', '🏘️', '🏛️', '🏰', '🏚️', '🏭', '🏬', '🏪', '🏫', '🏦', '🏨', '🏤', '⛪'],
    'Outils': ['🔨', '🔧', '🪛', '⚒️', '🛠️', '⚙️', '🔩', '📐', '📏', '📊', '📈', '📉', '💡', '🔌', '🔋', '🧰'],
    'Transport': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🚁', '✈️', '🚀', '⛽', '🚏', '🚇', '🚊', '🚝', '🚄', '🚅', '🚆', '🚂', '🚃', '🚋'],
    'Nature': ['🌱', '🌿', '🍃', '🌳', '🌲', '🌴', '🌵', '🌾', '🌺', '🌻', '🌹', '🌷', '🌸', '💐', '🌼', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒', '🌑', '🌝', '🌛', '🌜', '🌚', '🌞', '☀️', '⭐', '🌟', '💫', '✨', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌪️', '🌫️', '🌈', '☂️', '☔', '⚡', '🔥', '💧', '🌊'],
    'Personnes': ['👤', '👥', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍💼', '👨‍💼', '👷‍♀️', '👷‍♂️', '👩‍🔧', '👨‍🔧', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🍳', '👨‍🍳', '👩‍🌾', '👨‍🌾', '👩‍⚕️', '👨‍⚕️', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👮‍♀️', '👮‍♂️', '🕵️‍♀️', '🕵️‍♂️'],
    'Objets': ['📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '📀', '💽', '💾', '💿', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📠', '📺', '📻', '🎵', '🎶', '🎤', '🎧', '📢', '📣', '📯', '🔔', '🔕', '📯', '🎺', '📯', '📢'],
    'Emotions': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    'Symboles': ['✅', '❌', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💯', '💢', '💥', '💦', '💨', '🕳️', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '🔔', '🔕', '📢', '📣', '🔊', '🔉', '🔈', '🔇', '🎵', '🎶', '♾️', '💱', '💲', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '📊', '📈', '📉', '📋', '📌', '📍', '📎', '🔗', '📖', '📚', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️'],
    'Nourriture': ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕']
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = text;
      const newText = currentText.substring(0, start) + emoji + currentText.substring(end);
      setText(newText);
      
      // Restore cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const insertReplyEmoji = (emoji, postId) => {
    const currentReply = replyByPost[postId] || '';
    setReplyByPost(prev => ({ ...prev, [postId]: currentReply + emoji }));
    setShowReplyEmojiPicker(prev => ({ ...prev, [postId]: false }));
  };

  React.useEffect(() => {
    async function loadUser() {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data } = await supabase.auth.getUser();
      const u = data?.user || null;
      setUser(u);
      // Preload current user's profile for immediate badges and admin check
      if (u) {
        const { data: me } = await supabase
          .from('profiles')
          .select('id, is_verified_promoter, compagnie, organization_name, is_moderator')
          .eq('id', u.id)
          .maybeSingle();
        if (me) {
          setProfilesById(prev => ({ ...prev, [me.id]: me }));
          // Check if user is main admin (you can adjust this logic as needed)
          setIsMainAdmin(!!me.is_moderator);
        }
      }
    }
    loadUser();
  }, []);

  React.useEffect(() => {
    async function loadPosts() {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      setLoadingPosts(true);
      let query = supabase
        .from("post")
        .select("id, author_id, type, title, body, created_at, project_id, tab_context")
        .order("created_at", { ascending: false })
        .limit(20);
      if (category === 'announcements') {
        query = query.in('type', ['site_update','ama']);
      } else if (category === 'rules') {
        query = query.eq('type', 'rules');
      } else if (category === 'admin_announcements') {
        query = query.eq('type', 'admin_announcement');
      } else if (category === 'projects' && projectFilterId) {
        query = query.eq('project_id', projectFilterId);
        // Filter by tab when viewing a specific project
        if (activeTab === 'announcement') {
          query = query.eq('tab_context', 'announcement');
        } else if (activeTab === 'qa') {
          query = query.eq('tab_context', 'qa');
        }
      }
      const { data } = await query;
      setPosts(data || []);
      // Preload author profiles for posts to show badges
      const ids = [...new Set((data || []).map(p => p.author_id).filter(Boolean))];
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, is_verified_promoter, compagnie, organization_name')
          .in('id', ids);
        if (profs && profs.length) {
          const map = {};
          for (const p of profs) map[p.id] = p;
          setProfilesById(prev => ({ ...prev, ...map }));
        }
      }
      // Load post votes
      const postIds = (data || []).map(p => p.id);
      await refreshPostVotes(postIds);
      setLoadingPosts(false);
    }
    loadPosts();
  }, [category, projectFilterId, activeTab]);

  // Load projects list for sidebar
  React.useEffect(() => {
    async function loadProjects() {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data } = await supabase
        .from('project')
        .select('id, name, city, user_id')
        .order('name', { ascending: true })
        .limit(200);
      setProjects(data || []);
    }
    loadProjects();
  }, []);

  // pas de synchronisation projet

  const projectMap = React.useMemo(() => {
    const map = {};
    (projects || []).forEach(p => { if (p?.id) map[p.id] = p; });
    return map;
  }, [projects]);

  async function refreshPostVotes(ids) {
    if (!ids || ids.length === 0) return;
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data } = await supabase
      .from('vote')
      .select('target_id, value')
      .eq('target_type', 'post')
      .in('target_id', ids);
    const sum = {};
    for (const v of data || []) sum[v.target_id] = (sum[v.target_id] || 0) + (v.value || 0);
    setPostVotes(prev => ({ ...prev, ...sum }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) { setError("Connexion requise"); return; }
    const content = text.trim();
    if (!content) { setError("Veuillez saisir un message"); return; }
    
    // Check if posting announcement in project context
    if (category === 'projects' && projectFilterId && activeTab === 'announcement') {
      const project = projects.find(p => p.id === projectFilterId);
      if (project && project.user_id !== user.id) {
        setError("Seul le promoteur du projet peut publier des annonces");
        return;
      }
    }
    
    // Check if posting in admin-only categories
    if ((category === 'rules' || category === 'admin_announcements') && !isMainAdmin) {
      setError("Seul l'administrateur principal peut publier dans cette section");
      return;
    }
    
    setSubmitting(true);
    try {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const title = content.split("\n")[0].slice(0, 120) || "Question";
      
      // Determine type and tab_context based on current context
      let postType = "question";
      let tabContext = null;
      
      if (category === 'projects' && projectFilterId) {
        tabContext = activeTab;
        if (activeTab === 'announcement') {
          postType = "announcement";
        }
      } else if (category === 'rules') {
        postType = "rules";
      } else if (category === 'admin_announcements') {
        postType = "admin_announcement";
      }
      
      const { data, error: insErr } = await supabase
        .from("post")
        .insert({
          project_id: category === 'projects' && projectFilterId ? projectFilterId : null,
          author_id: user.id,
          type: postType,
          tab_context: tabContext,
          title,
          body: content,
        })
        .select("id, author_id, type, title, body, created_at, project_id, tab_context")
        .single();
      if (insErr) throw insErr;
      setSuccess(`Message ajouté (id: ${data.id})`);
      setText("");
      setPosts(prev => [data, ...prev]);
      setShowCreatePostModal(false); // Fermer la modal après succès
    } catch (err) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleThread(postId) {
    if (openThreadPostId === postId) { setOpenThreadPostId(null); return; }
    setOpenThreadPostId(postId);
    if (answersByPost[postId]) return; // already loaded
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data, error: selErr } = await supabase
      .from("answer")
      .select("id, author_id, body, is_accepted, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!selErr) {
      setAnswersByPost(prev => ({ ...prev, [postId]: data || [] }));
      const ids = [...new Set((data || []).map(a => a.author_id).filter(Boolean))];
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, is_verified_promoter, compagnie, organization_name')
          .in('id', ids);
        if (profs && profs.length) {
          const map = {};
          for (const p of profs) map[p.id] = p;
          setProfilesById(prev => ({ ...prev, ...map }));
        }
      }
      // Load votes for answers
      const ansIds = (data || []).map(a => a.id);
      await refreshAnswerVotes(ansIds);
    }
  }

  async function submitAnswer(postId) {
    if (!user) { setError("Connexion requise"); return; }
    const body = (replyByPost[postId] || '').trim();
    if (!body) return;
    setSendingReplyFor(postId);
    try {
      const { createClient } = await import("@/utils/supabase/client");
      if (!supabaseRef.current) supabaseRef.current = createClient();
      const supabase = supabaseRef.current;
      const { data, error: insErr } = await supabase
        .from("answer")
        .insert({ post_id: postId, author_id: user.id, body })
        .select("id, author_id, body, is_accepted, created_at")
        .single();
      if (insErr) throw insErr;
      setAnswersByPost(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }));
      await refreshAnswerVotes([data.id]);
      setReplyByPost(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      setError(e?.message || 'Erreur');
    } finally {
      setSendingReplyFor(null);
    }
  }

  async function refreshAnswerVotes(ids) {
    if (!ids || ids.length === 0) return;
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { data } = await supabase
      .from('vote')
      .select('target_id, value')
      .eq('target_type', 'answer')
      .in('target_id', ids);
    const sum = {};
    for (const v of data || []) sum[v.target_id] = (sum[v.target_id] || 0) + (v.value || 0);
    setAnswerVotes(prev => ({ ...prev, ...sum }));
  }

  async function vote(targetType, targetId, delta) {
    if (!user) { setError('Connexion requise'); return; }
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    await supabase
      .from('vote')
      .upsert({ user_id: user.id, target_type: targetType, target_id: targetId, value: delta }, { onConflict: 'user_id,target_type,target_id' });
    if (targetType === 'post') await refreshPostVotes([targetId]);
    else await refreshAnswerVotes([targetId]);
  }

  async function deletePost(postId, authorId) {
    if (!user || user.id !== authorId) { setError('Action non autorisée'); return; }
    if (!confirm('Supprimer ce message ?')) return;
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { error: delErr } = await supabase.from('post').delete().eq('id', postId);
    if (delErr) { setError(delErr.message); return; }
    setPosts(prev => prev.filter(p => p.id !== postId));
    const copy = { ...answersByPost }; delete copy[postId]; setAnswersByPost(copy);
  }

  async function deleteAnswer(answerId, postId, answerAuthorId, postAuthorId) {
    if (!user || (user.id !== answerAuthorId && user.id !== postAuthorId)) { setError('Action non autorisée'); return; }
    if (!confirm('Supprimer cette réponse ?')) return;
    const { createClient } = await import("@/utils/supabase/client");
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;
    const { error: delErr } = await supabase.from('answer').delete().eq('id', answerId);
    if (delErr) { setError(delErr.message); return; }
    setAnswersByPost(prev => ({ ...prev, [postId]: (prev[postId] || []).filter(a => a.id !== answerId) }));
  }

  React.useEffect(() => {
    // Forcer le fond sombre sur toute la page
    document.body.style.backgroundColor = '#2b2d31';
    document.documentElement.style.backgroundColor = '#2b2d31';
    
    // Nettoyer au démontage du composant
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#2b2d31]" style={{ backgroundColor: '#2b2d31' }}>
      <main className="min-h-screen bg-[#2b2d31] max-w-6xl mx-auto p-4 pt-24 md:pt-28 text-gray-100" style={{ backgroundColor: '#2b2d31' }}>
      {/* Header */}
      <section className="mb-6">
        <div className="rounded-2xl bg-[#313338] border border-[#3f4147] p-5">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-100">Discussions</h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">Posez une question et échangez avec la communauté et les promoteurs vérifiés.</p>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#2b2d31]">
        {/* Sidebar */}
        <aside className="md:col-span-3">
          <div className="sticky top-24 space-y-3">
            <div className="bg-[#313338] border border-[#3f4147] rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-200 mb-3">Catégories</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setCategory('all'); setProjectFilterId(null); setExpandedCategories(false); }} className={`text-left px-3 py-2 rounded-lg border ${category==='all'?'border-[#5865F2] text-gray-100 bg-[#2b2d31]':'border-[#3f4147] text-gray-300 hover:bg-[#2b2d31]'}`}>Toutes</button>
                
                {isMainAdmin && (
                  <div className="flex flex-col">
                    <button 
                      onClick={() => {
                        if (expandedCategories) {
                          setExpandedCategories(false);
                          setCategory('all');
                        } else {
                          setExpandedCategories(true);
                        }
                      }} 
                      className={`text-left px-3 py-2 rounded-lg border flex items-center justify-between ${expandedCategories ? 'border-[#5865F2] text-gray-100 bg-[#2b2d31]' : 'border-[#3f4147] text-gray-300 hover:bg-[#2b2d31]'}`}
                    >
                      <span>Admin</span>
                      <span className={`transition-transform ${expandedCategories ? 'rotate-90' : ''}`}>▶</span>
                    </button>
                    
                    {expandedCategories && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        <button
                          onClick={() => { setCategory('rules'); setProjectFilterId(null); }}
                          className={`text-left px-3 py-2 rounded-lg border text-sm ${
                            category === 'rules'
                              ? 'border-[#5865F2] text-gray-100 bg-[#1e1f22]'
                              : 'border-[#3f4147] text-gray-400 hover:bg-[#1e1f22]'
                          }`}
                        >
                          📋 Rules
                        </button>
                        <button
                          onClick={() => { setCategory('admin_announcements'); setProjectFilterId(null); }}
                          className={`text-left px-3 py-2 rounded-lg border text-sm ${
                            category === 'admin_announcements'
                              ? 'border-[#5865F2] text-gray-100 bg-[#1e1f22]'
                              : 'border-[#3f4147] text-gray-400 hover:bg-[#1e1f22]'
                          }`}
                        >
                          📢 Announcements
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#313338] border border-[#3f4147] rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-200 mb-3">Projets</h3>
              <div className="mb-3">
                <input
                  type="text"
                  value={projectSearch}
                  onChange={e => setProjectSearch(e.target.value)}
                  placeholder="Rechercher un projet…"
                  className="w-full border border-[#3f4147] bg-[#1e1f22] text-gray-100 rounded-xl p-2 text-sm placeholder-gray-400 focus:border-[#5865F2] focus:ring-2 focus:ring-[#5865F2]/30 transition"
                />
              </div>
              <div className="flex flex-col gap-2 max-h-[340px] overflow-auto pr-1">
                {(projects || []).filter(pr => {
                  const q = projectSearch.trim().toLowerCase();
                  if (!q) return true;
                  const label = `${pr.name || ''} ${pr.city || ''}`.toLowerCase();
                  return label.includes(q);
                }).map(pr => {
                  const isExpanded = expandedProjectId === pr.id;
                  const label = `${pr.name || 'Projet'}${pr.city ? ' – ' + pr.city : ''}`;
                  const isProjectPromoter = user && pr.user_id === user.id;
                  
                  return (
                    <div key={pr.id} className="flex flex-col">
                      <button 
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedProjectId(null);
                            setCategory('all');
                            setProjectFilterId(null);
                          } else {
                            setExpandedProjectId(pr.id);
                          }
                        }} 
                        className={`text-left px-3 py-2 rounded-lg border flex items-center justify-between ${isExpanded ? 'border-[#5865F2] text-gray-100 bg-[#2b2d31]' : 'border-[#3f4147] text-gray-300 hover:bg-[#2b2d31]'}`}
                      >
                        <span>{label}</span>
                        <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          <button
                            onClick={() => { setCategory('projects'); setProjectFilterId(pr.id); setActiveTab('qa'); }}
                            className={`text-left px-3 py-2 rounded-lg border text-sm ${
                              category === 'projects' && projectFilterId === pr.id && activeTab === 'qa'
                                ? 'border-[#5865F2] text-gray-100 bg-[#1e1f22]'
                                : 'border-[#3f4147] text-gray-400 hover:bg-[#1e1f22]'
                            }`}
                          >
                            Q/A
                          </button>
                          <button
                            onClick={() => { 
                              setCategory('projects'); 
                              setProjectFilterId(pr.id); 
                              setActiveTab('announcement'); 
                            }}
                            className={`text-left px-3 py-2 rounded-lg border text-sm ${
                              category === 'projects' && projectFilterId === pr.id && activeTab === 'announcement'
                                ? 'border-[#5865F2] text-gray-100 bg-[#1e1f22]'
                                : 'border-[#3f4147] text-gray-400 hover:bg-[#1e1f22]'
                            }`}
                          >
                            Annoucement {!isProjectPromoter && <span className="text-xs">(Lecture seule)</span>}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="md:col-span-9 bg-[#2b2d31]">
          {/* Project header - only show when a project is selected */}
          {category === 'projects' && projectFilterId && (
            <div className="mb-6 bg-[#313338] border border-[#3f4147] rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-100">
                  {projectMap[projectFilterId]?.name || 'Projet'} 
                  {projectMap[projectFilterId]?.city && ` – ${projectMap[projectFilterId].city}`}
                  <span className="ml-3 text-sm font-normal text-gray-400">
                    {activeTab === 'announcement' ? '• Annonces' : '• Questions & Réponses'}
                  </span>
                </h2>
                <button
                  onClick={() => { setCategory('all'); setProjectFilterId(null); setExpandedProjectId(null); }}
                  className="text-gray-400 hover:text-gray-200 text-sm underline"
                >
                  Retour aux discussions
                </button>
              </div>
            </div>
          )}
          
          {/* Bouton pour créer un nouveau post */}
          {(() => {
            // Check if user can create in current context
            const canCreate = user && (
              // Not in project context OR
              (category !== 'projects') ||
              // In project Q/A (anyone can create) OR  
              (category === 'projects' && activeTab === 'qa') ||
              // In project announcement AND user is the promoter OR
              (category === 'projects' && activeTab === 'announcement' && 
               projects.find(p => p.id === projectFilterId)?.user_id === user.id) ||
              // In admin categories AND user is admin
              ((category === 'rules' || category === 'admin_announcements') && isMainAdmin)
            );
            
            if (!user) {
              return (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#313338] rounded-xl border border-[#3f4147] text-gray-400">
                    <span>🔒</span>
                    <span>Vous devez être connecté pour publier.</span>
                    <a className="underline text-blue-400 hover:text-blue-300" href={`/${locale}/login`}>Se connecter</a>
                  </div>
                </div>
              );
            }
            
            if (!canCreate && category === 'projects' && activeTab === 'announcement') {
              return (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#313338] rounded-xl border border-[#3f4147] text-gray-400">
                    <span>🏗️</span>
                    <span>Seul le promoteur peut publier des annonces sur ce projet.</span>
                  </div>
                </div>
              );
            }
            
            if (!canCreate && (category === 'rules' || category === 'admin_announcements')) {
              return (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#313338] rounded-xl border border-[#3f4147] text-gray-400">
                    <span>👮‍♂️</span>
                    <span>Seul l'administrateur peut publier dans cette section.</span>
                  </div>
                </div>
              );
            }
            
            if (!canCreate) return null;
            
            return (
              <div className="mb-6 text-center">
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-2xl font-medium transition-all hover:shadow-lg"
                >
                  <span className="text-lg">✏️</span>
                  <span>
                    {category === 'projects' && projectFilterId && activeTab === 'announcement' ? 'Nouvelle annonce' :
                     category === 'rules' ? 'Nouvelle règle' :
                     category === 'admin_announcements' ? 'Nouvelle annonce administrative' :
                     'Nouvelle discussion'}
                  </span>
                </button>
              </div>
            );
          })()}

          <section className="mt-8 bg-[#2b2d31]">
        <h2 className="text-lg font-semibold mb-2 text-gray-200">
          {category === 'projects' && projectFilterId && activeTab === 'announcement' 
            ? 'Annonces du projet' 
            : category === 'projects' && projectFilterId && activeTab === 'qa'
            ? 'Questions & Réponses'
            : category === 'rules'
            ? 'Règles de la communauté'
            : category === 'admin_announcements'
            ? 'Annonces administratives'
            : 'Derniers messages'}
        </h2>
        {loadingPosts ? (
          <div className="text-gray-500 text-sm">Chargement…</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-600 text-sm">Aucun message pour le moment.</div>
        ) : (
          <div className="flex flex-col gap-3 bg-[#2b2d31]">
            {posts.map(p => {
              const isOpen = openThreadPostId === p.id;
              const answers = answersByPost[p.id] || [];
              return (
                <div key={p.id} className={`p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 ${
                  p.type === 'announcement' || p.type === 'admin_announcement' 
                    ? 'bg-gradient-to-r from-amber-950/20 to-[#313338] border-amber-800/50' 
                    : p.type === 'rules'
                    ? 'bg-gradient-to-r from-red-950/20 to-[#313338] border-red-800/50'
                    : 'bg-[#313338] border-[#3f4147] hover:border-[#5865F2]/30'
                }`}>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${
                        p.type === 'announcement' || p.type === 'admin_announcement' ? '📢' :
                        p.type === 'rules' ? '📋' :
                        p.type === 'question' ? '❓' :
                        p.type === 'advice' ? '💡' :
                        '💬'
                      }`}></span>
                      <span className="text-gray-300 font-medium">{new Date(p.created_at).toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-1 bg-gray-600 rounded-full"></div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      p.type === 'announcement' ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50' :
                      p.type === 'admin_announcement' ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50' :
                      p.type === 'rules' ? 'bg-red-900/40 text-red-200 border border-red-700/50' :
                      p.type === 'question' ? 'bg-blue-900/40 text-blue-200 border border-blue-700/50' :
                      p.type === 'advice' ? 'bg-green-900/40 text-green-200 border border-green-700/50' :
                      'bg-gray-700/40 text-gray-300 border border-gray-600/50'
                    }`}>
                      {
                        p.type === 'announcement' ? 'Annonce' :
                        p.type === 'rules' ? 'Règle' :
                        p.type === 'admin_announcement' ? 'Annonce Admin' :
                        p.type === 'question' ? 'Question' :
                        p.type === 'advice' ? 'Conseil' :
                        p.type
                      }
                    </span>
                    {p.tab_context && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        p.tab_context === 'announcement' 
                          ? 'bg-orange-900/40 text-orange-200 border border-orange-700/50' 
                          : 'bg-purple-900/40 text-purple-200 border border-purple-700/50'
                      }`}>
                        {p.tab_context === 'announcement' ? '🏗️ Projet' : '🤝 Discussion'}
                      </span>
                    )}
                  </div>
                  
                  {/* Badges auteur et projet */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {(() => {
                      const prof = profilesById[p.author_id] || {};
                      const isVerified = !!prof.is_verified_promoter;
                      const company = prof.compagnie || prof.organization_name;
                      if (p.author_id) {
                        return (
                          <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e1f22] border border-[#3f4147]">
                              <div className={`w-3 h-3 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                              <span className="text-sm text-gray-300 font-medium">
                                {company ? company : (isVerified ? 'Promoteur' : ((p.author_id || '').slice(0,8) + '…'))}
                              </span>
                              {isVerified && (
                                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full border border-green-700/50">
                                  ✓ Vérifié
                                </span>
                              )}
                            </div>
                            {p.project_id && projectMap[p.project_id] && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/30 border border-blue-800/50">
                                <span className="text-sm">🏢</span>
                                <span className="text-sm text-blue-200 font-medium">
                                  {projectMap[p.project_id]?.name}{projectMap[p.project_id]?.city ? ' – ' + projectMap[p.project_id]?.city : ''}
                                </span>
                              </div>
                            )}
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  {/* Contenu du post */}
                  {p.body && (
                    <div className="mb-4">
                      {/* Afficher le titre seulement s'il est différent du début du body */}
                      {(() => {
                        const bodyStart = p.body.split('\n')[0].slice(0, 120);
                        const showTitle = p.title && p.title !== bodyStart && !p.body.startsWith(p.title);
                        
                        return showTitle ? (
                          <h3 className={`text-lg font-bold mb-3 leading-tight ${
                            p.type === 'announcement' || p.type === 'admin_announcement' ? 'text-amber-100' : 
                            p.type === 'rules' ? 'text-red-100' : 
                            p.type === 'question' ? 'text-blue-100' :
                            p.type === 'advice' ? 'text-green-100' :
                            'text-gray-100'
                          }`}>
                            {p.title}
                          </h3>
                        ) : null;
                      })()}
                      
                      <div className="text-gray-200 whitespace-pre-line leading-relaxed bg-[#1e1f22]/50 rounded-xl p-4 border border-[#3f4147]/50">
                        {p.body}
                      </div>
                    </div>
                  )}
                  {/* Post actions */}
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-[#3f4147]/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#1e1f22] rounded-xl border border-[#3f4147]">
                        <button 
                          onClick={() => vote('post', p.id, 1)} 
                          className="px-3 py-2 text-gray-300 hover:text-green-400 hover:bg-green-950/20 rounded-l-xl transition-all" 
                          title="J'aime"
                        >
                          👍
                        </button>
                        <span className="px-3 py-2 text-gray-200 font-medium border-x border-[#3f4147]">
                          {postVotes[p.id] || 0}
                        </span>
                        <button 
                          onClick={() => vote('post', p.id, -1)} 
                          className="px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-950/20 rounded-r-xl transition-all" 
                          title="Je n'aime pas"
                        >
                          👎
                        </button>
                      </div>
                      
                      {/* Compteur de réponses */}
                      {p.type !== 'announcement' && p.type !== 'admin_announcement' && p.type !== 'rules' && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1f22] rounded-xl border border-[#3f4147] text-gray-300">
                          <span>💬</span>
                          <span className="text-sm">{answers.length} réponse{answers.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    {user && user.id === p.author_id && (
                      <button 
                        onClick={() => deletePost(p.id, p.author_id)} 
                        className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all text-sm"
                      >
                        <span>🗑️</span>
                        Supprimer
                      </button>
                    )}
                  </div>
                  {/* Bouton réponses pour les discussions */}
                  {p.type !== 'announcement' && p.type !== 'admin_announcement' && p.type !== 'rules' && (
                    <button
                      onClick={() => toggleThread(p.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl transition-all font-medium text-sm"
                    >
                      <span>{isOpen ? '👁️' : '💭'}</span>
                      {isOpen ? 'Masquer les réponses' : 'Voir les réponses'}
                    </button>
                  )}
                  {isOpen && p.type !== 'announcement' && p.type !== 'admin_announcement' && p.type !== 'rules' ? (
                    <div className="mt-3 border-t border-[#3f4147] pt-3">
                      {answers.length === 0 ? (
                        <div className="text-sm text-gray-400">Aucune réponse pour l'instant.</div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {answers.map(a => {
                            const prof = profilesById[a.author_id] || {};
                            const isVerified = !!prof.is_verified_promoter;
                            const company = prof.compagnie || prof.organization_name;
                            const label = company ? company : (isVerified ? 'Promoteur' : ((a.author_id || '').slice(0,8) + '…'));
                            const initial = (isVerified ? (company || 'P') : (a.author_id || 'U'))
                              .toString().trim().charAt(0).toUpperCase();
                            const isPostAuthor = a.author_id === p.author_id;
                            return (
                              <div key={a.id} className={`p-4 rounded-2xl border transition-all ${
                                a.is_accepted 
                                  ? 'border-green-600/50 bg-gradient-to-r from-green-950/20 to-[#313338]' 
                                  : 'border-[#3f4147] bg-[#313338] hover:border-[#5865F2]/30'
                              }`}>
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                    isVerified 
                                      ? 'bg-green-600 text-white border-green-500' 
                                      : a.is_accepted
                                      ? 'bg-yellow-600 text-white border-yellow-500'
                                      : 'bg-[#1e1f22] text-gray-300 border-[#3f4147]'
                                  }`}>
                                    {isVerified ? '✓' : a.is_accepted ? '⭐' : initial}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                      <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleString()}</span>
                                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1e1f22] border border-[#3f4147]">
                                        <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        <span className="text-sm text-gray-300 font-medium">{label}</span>
                                      </div>
                                      {isVerified && (
                                        <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full border border-green-700/50">
                                          🏢 Promoteur vérifié
                                        </span>
                                      )}
                                      {isPostAuthor && (
                                        <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full border border-amber-700/50">
                                          ✏️ Auteur du post
                                        </span>
                                      )}
                                      {a.is_accepted && (
                                        <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full border border-yellow-700/50">
                                          ⭐ Réponse acceptée
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-gray-200 whitespace-pre-line mb-3 leading-relaxed bg-[#1e1f22]/30 rounded-xl p-3 border border-[#3f4147]/30">{a.body}</div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center bg-[#1e1f22] rounded-xl border border-[#3f4147]">
                                        <button 
                                          onClick={() => vote('answer', a.id, 1)} 
                                          className="px-3 py-1.5 text-gray-300 hover:text-green-400 hover:bg-green-950/20 rounded-l-xl transition-all" 
                                          title="J'aime"
                                        >
                                          👍
                                        </button>
                                        <span className="px-3 py-1.5 text-gray-200 font-medium border-x border-[#3f4147]">
                                          {answerVotes[a.id] || 0}
                                        </span>
                                        <button 
                                          onClick={() => vote('answer', a.id, -1)} 
                                          className="px-3 py-1.5 text-gray-300 hover:text-red-400 hover:bg-red-950/20 rounded-r-xl transition-all" 
                                          title="Je n'aime pas"
                                        >
                                          👎
                                        </button>
                                      </div>
                                      {(user && (user.id === a.author_id || user.id === p.author_id)) && (
                                        <button 
                                          onClick={() => deleteAnswer(a.id, p.id, a.author_id, p.author_id)} 
                                          className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all text-sm"
                                        >
                                          <span>🗑️</span>
                                          Supprimer
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-[#3f4147]/50">
                        {!user ? (
                          <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1f22] rounded-xl border border-[#3f4147] text-gray-400">
                            <span>🔒</span>
                            <span className="text-sm">Connectez-vous pour répondre.</span>
                          </div>
                        ) : (
                          <div className="bg-[#1e1f22] rounded-2xl border border-[#3f4147] p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span>💭</span>
                              <span className="text-sm font-medium text-gray-300">Ajouter une réponse</span>
                            </div>
                            <div className="relative">
                              <textarea
                                className="w-full border border-[#3f4147] bg-[#313338] text-gray-100 placeholder-gray-400 focus:border-[#5865F2] focus:ring-2 focus:ring-[#5865F2]/30 rounded-xl p-3 min-h-[100px] transition resize-none"
                                placeholder="Partagez votre réponse ou votre expérience..."
                                value={replyByPost[p.id] || ''}
                                onChange={e => setReplyByPost(prev => ({ ...prev, [p.id]: e.target.value }))}
                              />
                              <button
                                type="button"
                                onClick={() => setShowReplyEmojiPicker(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                                className="absolute bottom-3 right-3 p-1.5 hover:bg-[#3f4147] rounded-lg transition-colors text-sm"
                                title="Ajouter un emoji"
                              >
                                😊
                              </button>
                              
                              {/* Reply Emoji Picker */}
                              {showReplyEmojiPicker[p.id] && (
                                <div className="absolute bottom-full right-0 mb-2 w-80 max-h-64 bg-[#1e1f22] border border-[#3f4147] rounded-2xl shadow-xl z-50 overflow-hidden">
                                  <div className="p-3 border-b border-[#3f4147]">
                                    <h4 className="text-sm font-medium text-gray-300">Choisir un emoji</h4>
                                  </div>
                                  <div className="max-h-48 overflow-y-auto">
                                    {Object.entries(emojiCategories).map(([categoryName, emojis]) => (
                                      <div key={categoryName} className="p-3 border-b border-[#3f4147]/50 last:border-b-0">
                                        <h5 className="text-xs font-medium text-gray-400 mb-2">{categoryName}</h5>
                                        <div className="grid grid-cols-8 gap-1">
                                          {emojis.map((emoji) => (
                                            <button
                                              key={emoji}
                                              onClick={() => insertReplyEmoji(emoji, p.id)}
                                              className="w-8 h-8 flex items-center justify-center hover:bg-[#3f4147] rounded-lg transition-colors text-lg"
                                              title={emoji}
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500">
                                {(replyByPost[p.id] || '').length} caractères
                              </span>
                              <button
                                onClick={() => submitAnswer(p.id)}
                                disabled={sendingReplyFor === p.id || !(replyByPost[p.id] || '').trim()}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-all ${
                                  sendingReplyFor === p.id || !(replyByPost[p.id] || '').trim()
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-[#5865F2] hover:bg-[#4752C4] hover:shadow-lg'
                                }`}
                              >
                                <span>{sendingReplyFor === p.id ? '⏳' : '📤'}</span>
                                {sendingReplyFor === p.id ? 'Envoi…' : 'Répondre'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
          </section>
        </div>
      </div>
      </main>
      
      {/* Modal de création de post */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#313338] rounded-2xl border border-[#3f4147] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#3f4147]">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-3">
                <span className="text-2xl">✏️</span>
                {category === 'projects' && projectFilterId && activeTab === 'announcement' ? 'Nouvelle annonce' :
                 category === 'rules' ? 'Nouvelle règle' :
                 category === 'admin_announcements' ? 'Nouvelle annonce administrative' :
                 'Nouvelle discussion'}
              </h2>
              <button
                onClick={() => {
                  setShowCreatePostModal(false);
                  setError(null);
                  setSuccess(null);
                  setShowEmojiPicker(false);
                }}
                className="p-2 hover:bg-[#3f4147] rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Context info */}
                {category === 'projects' && projectFilterId && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-950/30 border border-blue-800/50 rounded-xl text-blue-200">
                    <span>🏢</span>
                    <span className="text-sm">
                      {projectMap[projectFilterId]?.name}{projectMap[projectFilterId]?.city ? ' – ' + projectMap[projectFilterId].city : ''}
                      {activeTab === 'announcement' ? ' (Annonce)' : ' (Q/A)'}
                    </span>
                  </div>
                )}
                
                {(category === 'rules' || category === 'admin_announcements') && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200">
                    <span>{category === 'rules' ? '📋' : '📢'}</span>
                    <span className="text-sm">
                      {category === 'rules' ? 'Section Administration - Règles' : 'Section Administration - Annonces'}
                    </span>
                  </div>
                )}
                
                {/* Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    className="w-full border border-[#3f4147] bg-[#1e1f22] text-gray-100 placeholder-gray-400 focus:border-[#5865F2] focus:ring-2 focus:ring-[#5865F2]/30 rounded-xl p-4 min-h-[200px] transition resize-none"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={
                      category === 'projects' && projectFilterId && activeTab === 'announcement' ? 'Rédigez votre annonce pour informer la communauté...' :
                      category === 'rules' ? 'Rédigez la règle de la communauté...' :
                      category === 'admin_announcements' ? 'Rédigez l\'annonce administrative...' :
                      'Posez votre question ou partagez votre message avec la communauté...'
                    }
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute bottom-4 right-4 p-2 hover:bg-[#3f4147] rounded-lg transition-colors"
                    title="Ajouter un emoji"
                  >
                    😊
                  </button>
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 w-80 max-h-64 bg-[#1e1f22] border border-[#3f4147] rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-[#3f4147]">
                        <h4 className="text-sm font-medium text-gray-300">Choisir un emoji</h4>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {Object.entries(emojiCategories).map(([categoryName, emojis]) => (
                          <div key={categoryName} className="p-3 border-b border-[#3f4147]/50 last:border-b-0">
                            <h5 className="text-xs font-medium text-gray-400 mb-2">{categoryName}</h5>
                            <div className="grid grid-cols-8 gap-1">
                              {emojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => insertEmoji(emoji)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[#3f4147] rounded-lg transition-colors text-lg"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Messages d'erreur/succès */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-800/50 rounded-xl text-red-200">
                    <span>❌</span>
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-950/30 border border-green-800/50 rounded-xl text-green-200">
                    <span>✅</span>
                    <span className="text-sm">{success}</span>
                  </div>
                )}
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#3f4147]">
                  <span className="text-xs text-gray-500">
                    {text.length} caractères
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreatePostModal(false);
                        setError(null);
                        setSuccess(null);
                        setShowEmojiPicker(false);
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-gray-200 rounded-xl border border-[#3f4147] hover:bg-[#3f4147] transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={!user || submitting || !text.trim()}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-white font-medium transition-all ${
                        !user || submitting || !text.trim()
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-[#5865F2] hover:bg-[#4752C4] hover:shadow-lg'
                      }`}
                    >
                      <span>{submitting ? '⏳' : '📤'}</span>
                      {submitting ? 'Publication...' : (
                        category === 'projects' && projectFilterId && activeTab === 'announcement' ? 'Publier l\'annonce' :
                        category === 'rules' ? 'Publier la règle' :
                        category === 'admin_announcements' ? 'Publier l\'annonce' :
                        'Publier'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


