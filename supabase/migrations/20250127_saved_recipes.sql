-- Migration: Tabela saved_recipes
-- Descrição: Armazena receitas salvas pelos usuários

CREATE TABLE IF NOT EXISTS saved_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_title TEXT NOT NULL,
    recipe_content TEXT,
    recipe_ingredients JSONB,
    recipe_instructions JSONB,
    mood TEXT,
    preferences TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_title)
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_created_at ON saved_recipes(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Remover policies existentes (se houver) antes de criar
DROP POLICY IF EXISTS "Users can view own saved recipes" ON saved_recipes;
DROP POLICY IF EXISTS "Users can insert own saved recipes" ON saved_recipes;
DROP POLICY IF EXISTS "Users can delete own saved recipes" ON saved_recipes;

-- Política: usuários só podem ver suas próprias receitas
CREATE POLICY "Users can view own saved recipes"
    ON saved_recipes FOR SELECT
    USING (auth.uid() = user_id);

-- Política: usuários só podem inserir suas próprias receitas
CREATE POLICY "Users can insert own saved recipes"
    ON saved_recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem deletar suas próprias receitas
CREATE POLICY "Users can delete own saved recipes"
    ON saved_recipes FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_saved_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente (se houver) antes de criar
DROP TRIGGER IF EXISTS trigger_update_saved_recipes_updated_at ON saved_recipes;

CREATE TRIGGER trigger_update_saved_recipes_updated_at
    BEFORE UPDATE ON saved_recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_recipes_updated_at();
