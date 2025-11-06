-- Migration: AI Response Cache Table
-- Tabela para cache de respostas de IA (evita chamadas repetidas)

CREATE TABLE IF NOT EXISTS ai_response_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('claude', 'gpt4', 'gemini', 'grok', 'perplexity')),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 6),
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,

    -- Índice único para query_hash + provider
    UNIQUE(query_hash, provider)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cache_query_hash ON ai_response_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_provider ON ai_response_cache(provider);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON ai_response_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_created_at ON ai_response_cache(created_at DESC);

-- Comentários
COMMENT ON TABLE ai_response_cache IS 'Cache de respostas de IA para evitar chamadas repetidas';
COMMENT ON COLUMN ai_response_cache.query_hash IS 'Hash SHA256 da query + provider';
COMMENT ON COLUMN ai_response_cache.provider IS 'Provider usado: claude, gpt4, gemini, grok, perplexity';
COMMENT ON COLUMN ai_response_cache.expires_at IS 'Data de expiração do cache (24 horas)';

-- Função para limpar cache expirado (pode ser chamada por cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM ai_response_cache
    WHERE expires_at < now();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_cache() IS 'Limpa cache expirado e retorna número de registros deletados';
