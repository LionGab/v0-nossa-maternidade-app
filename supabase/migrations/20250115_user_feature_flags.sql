-- Migration: User Feature Flags Table
-- Tabela para feature flags por usuária e A/B testing

CREATE TABLE IF NOT EXISTS user_feature_flags (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    flags JSONB DEFAULT '{}'::jsonb,
    ab_test_group TEXT DEFAULT 'control' CHECK (ab_test_group IN ('control', 'grok', 'gemini', 'smart')),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Validação de flags
    CONSTRAINT valid_flags CHECK (
        jsonb_typeof(flags) = 'object'
    )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_feature_flags_ab_test_group ON user_feature_flags(ab_test_group);
CREATE INDEX IF NOT EXISTS idx_feature_flags_updated_at ON user_feature_flags(updated_at DESC);

-- Comentários
COMMENT ON TABLE user_feature_flags IS 'Feature flags por usuária para A/B testing';
COMMENT ON COLUMN user_feature_flags.flags IS 'JSONB com flags: use_grok, use_gemini_pro, smart_routing, etc';
COMMENT ON COLUMN user_feature_flags.ab_test_group IS 'Grupo de A/B testing: control, grok, gemini, smart';

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_update_feature_flags_updated_at
    BEFORE UPDATE ON user_feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_flags_updated_at();
