-- =============================================================================
-- Migration Completa: Setup Inicial do MVP
-- =============================================================================
-- Data: 2025-01-03
-- Descrição: Cria todas as estruturas necessárias para o MVP funcionar
-- Projeto: https://mnszbkeuerjcevjvdqme.supabase.co
-- =============================================================================

-- =============================================================================
-- 1. Adicionar coluna onboarding_completed à tabela profiles
-- =============================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL;

-- Criar índice para melhor performance em queries que filtram por onboarding_completed
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
ON profiles(onboarding_completed);

-- Comentário na coluna para documentação
COMMENT ON COLUMN profiles.onboarding_completed IS
'Indica se o usuário completou o processo de onboarding inicial';

-- =============================================================================
-- 2. Criar função para criar profile automaticamente
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    created_at,
    updated_at,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW(),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  -- Inicializar gamificação
  INSERT INTO public.user_gamification (
    user_id,
    points,
    level,
    streak_days,
    last_activity_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    0,
    1,
    0,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. Criar trigger para executar função ao criar usuário
-- =============================================================================

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 4. Verificar se tudo foi criado corretamente
-- =============================================================================

-- Verificar se a coluna existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'onboarding_completed'
  ) THEN
    RAISE EXCEPTION 'Coluna onboarding_completed não foi criada';
  END IF;
END $$;

-- Verificar se a função existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'handle_new_user'
  ) THEN
    RAISE EXCEPTION 'Função handle_new_user não foi criada';
  END IF;
END $$;

-- Verificar se o trigger existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE EXCEPTION 'Trigger on_auth_user_created não foi criado';
  END IF;
END $$;

-- =============================================================================
-- ROLLBACK (caso precise reverter)
-- =============================================================================
-- Para reverter esta migration, execute:
--
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP INDEX IF EXISTS idx_profiles_onboarding_completed;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS onboarding_completed;
-- =============================================================================
