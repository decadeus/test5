-- Migration pour ajouter les colonnes promoteur à la table project
-- Exécutez cette requête dans l'éditeur SQL de Supabase

-- Ajout des colonnes pour les informations du promoteur
ALTER TABLE project 
ADD COLUMN promoter_last_name VARCHAR(100),
ADD COLUMN promoter_first_name VARCHAR(100),
ADD COLUMN promoter_phone VARCHAR(20),
ADD COLUMN promoter_email VARCHAR(255),
ADD COLUMN promoter_languages TEXT[] DEFAULT '{}';

-- Ajout de commentaires pour documenter les colonnes
COMMENT ON COLUMN project.promoter_last_name IS 'Nom de famille du promoteur';
COMMENT ON COLUMN project.promoter_first_name IS 'Prénom du promoteur';
COMMENT ON COLUMN project.promoter_phone IS 'Numéro de téléphone du promoteur';
COMMENT ON COLUMN project.promoter_email IS 'Adresse email du promoteur';
COMMENT ON COLUMN project.promoter_languages IS 'Tableau des codes de langues parlées par le promoteur (ex: ["fr", "en", "pl"])';

-- Création d'un index sur l'email pour les recherches
CREATE INDEX IF NOT EXISTS idx_project_promoter_email ON project(promoter_email);

-- Ajout de contraintes de validation (optionnel)
ALTER TABLE project 
ADD CONSTRAINT check_promoter_email_format 
CHECK (promoter_email IS NULL OR promoter_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Exemple de données de test (optionnel - à supprimer en production)
-- INSERT INTO project (id, promoter_last_name, promoter_first_name, promoter_phone, promoter_email, promoter_languages)
-- VALUES 
--   (1, 'Dupont', 'Jean', '+33 1 23 45 67 89', 'jean.dupont@exemple.com', ARRAY['fr', 'en']),
--   (2, 'Smith', 'John', '+44 20 7946 0958', 'john.smith@example.com', ARRAY['en', 'fr', 'de']);

-- Vérification de la structure (requête de test)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'project' 
-- AND column_name LIKE 'promoter_%'
-- ORDER BY column_name; 