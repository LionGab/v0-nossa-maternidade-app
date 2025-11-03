-- =============================================================================
-- FIX SIMPLES: Adicionar coluna onboarding_completed
-- =============================================================================
-- COPIE E COLE EXATAMENTE COMO ESTÁ (sem modificar nada)
-- =============================================================================

-- Adicionar a coluna
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Mensagem de sucesso (ignore se der erro - não é crítico)
COMMENT ON COLUMN profiles.onboarding_completed IS 'Indica se o usuário completou o onboarding';
