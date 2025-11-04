-- Migration: Maternal News Cache Table
-- Tabela para cache de notícias maternais agregadas

CREATE TABLE IF NOT EXISTS maternal_news_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    news JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,

    -- Índice único para query
    UNIQUE(query)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_news_cache_query ON maternal_news_cache(query);
CREATE INDEX IF NOT EXISTS idx_news_cache_expires_at ON maternal_news_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_news_cache_created_at ON maternal_news_cache(created_at DESC);

-- Comentários
COMMENT ON TABLE maternal_news_cache IS 'Cache de notícias maternais agregadas (Perplexity + Grok)';
COMMENT ON COLUMN maternal_news_cache.query IS 'Query de busca (ex: "maternidade", "amamentação")';
COMMENT ON COLUMN maternal_news_cache.news IS 'JSONB array com notícias: [{title, summary, category, source, ...}]';
COMMENT ON COLUMN maternal_news_cache.expires_at IS 'Data de expiração do cache (6 horas)';

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION cleanup_expired_news_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM maternal_news_cache
    WHERE expires_at < now();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_news_cache() IS 'Limpa cache de notícias expirado e retorna número de registros deletados';
