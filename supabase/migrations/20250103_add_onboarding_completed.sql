-- =============================================================================
-- Migration: Adicionar coluna onboarding_completed à tabela profiles
-- =============================================================================
-- Data: 2025-11-03
-- Descrição: Adiciona a coluna onboarding_completed para rastrear se o usuário
--            completou o processo de onboarding inicial
-- =============================================================================

-- Adicionar coluna onboarding_completed (padrão: false)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- Criar índice para melhor performance em queries que filtram por onboarding_completed
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Comentário na coluna para documentação
COMMENT ON COLUMN profiles.onboarding_completed IS
'Indica se o usuário completou o processo de onboarding inicial';

-- =============================================================================
-- ROLLBACK (caso precise reverter)
-- =============================================================================
-- Para reverter esta migration, execute:
--
-- DROP INDEX IF EXISTS idx_profiles_onboarding_completed;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS onboarding_completed;
-- =============================================================================
