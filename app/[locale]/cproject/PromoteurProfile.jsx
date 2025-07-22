import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";

export default function PromoteurProfile({ user }) {
  const supabase = createClient();
  const [compagnie, setCompagnie] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      setSuccess("");
      const { data, error } = await supabase
        .from("profiles")
        .select("compagnie, avatar_url")
        .eq("id", user.id)
        .single();
      if (error) {
        setError("Erreur lors du chargement du profil");
      } else if (data) {
        setCompagnie(data.compagnie || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user?.id]);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("profiles")
      .update({ compagnie, avatar_url: avatarUrl })
      .eq("id", user.id)
      .single();
    if (error) {
      setError("Erreur lors de la sauvegarde");
    } else {
      // Synchroniser le nom de la compagnie dans tous les projets de l'utilisateur
      const { error: projectError } = await supabase
        .from("project")
        .update({ compagny: compagnie })
        .eq("user_id", user.id);
      if (projectError) {
        setSuccess("Profil mis à jour, mais erreur lors de la synchronisation des projets.");
      } else {
        setSuccess("Profil et projets mis à jour !");
      }
    }
    setLoading(false);
  }

  const avatarInputRef = useRef(null);
  async function handleAvatarUpload(e) {
    const files = e.target.files;
    if (!files.length || !user?.id) return;
    const file = files[0];
    // Vérification type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Seuls les fichiers PNG, JPG, JPEG ou WEBP sont autorisés.");
      return;
    }
    // Vérification taille
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("La taille maximale autorisée est de 3 Mo.");
      return;
    }
    setError("");
    try {
      // Supprimer l'ancienne photo si elle existe
      if (avatarUrl) {
        // avatarUrl peut être un lien complet ou un chemin relatif
        let oldPath = avatarUrl;
        // Si c'est une URL publique, extraire le chemin relatif après '/object/public/promoteur/'
        const match = avatarUrl.match(/\/object\/public\/promoteur\/(.+)$/);
        if (match && match[1]) {
          oldPath = match[1];
        } else if (avatarUrl.startsWith('promoteur/')) {
          oldPath = avatarUrl.replace('promoteur/', '');
        }
        // Supprime l'ancien fichier du bucket promoteur
        const { error: removeError } = await supabase.storage.from('promoteur').remove([oldPath]);
        if (removeError) {
          console.warn('Erreur lors de la suppression de l\'ancienne photo:', removeError.message);
        }
      }
      // Upload nouvelle photo
      const ext = file.name.split('.').pop();
      const name = `${user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('promoteur').upload(name, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage.from('promoteur').getPublicUrl(name);
      const publicUrl = urlData.publicUrl;
      setAvatarUrl(publicUrl);
      // Mettre à jour le profil
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      setSuccess("Photo de profil mise à jour !");
    } catch (err) {
      setError(err.message || "Erreur lors de l'upload de l'avatar");
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Promoteur</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200 bg-gray-100 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">Aucun avatar</span>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            title="Uploader/Remplacer la photo de profil"
          >
            <FaUpload size={24} color="#222" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">Nom de la compagnie</label>
        <Input
          type="text"
          value={compagnie}
          onChange={e => setCompagnie(e.target.value)}
          placeholder="Nom de la compagnie"
          className="border rounded px-3 py-2"
        />
      </div>
      <Button type="submit" className="bg-blue-600 text-white rounded-lg py-2 mt-4" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
} 