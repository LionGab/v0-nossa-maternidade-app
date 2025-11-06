-- Migration: Tabela api_cache
-- Descrição: Cache de respostas de API para reduzir custos e latência

CREATE TABLE IF NOT EXISTS api_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL UNIQUE,
    cache_data JSONB NOT NULL,
    endpoint TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Índice para busca rápida por key
    UNIQUE(cache_key)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_endpoint ON api_cache(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires_at ON api_cache(expires_at);

-- Índice para limpeza automática de cache expirado
-- Removido índice com predicate NOW() porque NOW() não é IMMUTABLE
-- A função cleanup_expired_cache() já faz a limpeza baseada em expires_at

-- RLS (Row Level Security) - Cache é público (pode ser compartilhado entre usuários)
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- Remover policy existente (se houver) antes de criar
DROP POLICY IF EXISTS "Anyone can read valid cache" ON api_cache;

-- Política: Todos podem ler cache válido
CREATE POLICY "Anyone can read valid cache"
    ON api_cache FOR SELECT
    USING (expires_at > NOW());

-- Política: Apenas sistema pode inserir/atualizar cache (via service role)
-- (Não permitir inserts diretos de usuários para segurança)

-- Função para limpar cache expirado (executar periodicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM api_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON TABLE api_cache IS 'Cache de respostas de API para reduzir custos e latência';
COMMENT ON COLUMN api_cache.cache_key IS 'Chave única do cache (hash do request)';
COMMENT ON COLUMN api_cache.cache_data IS 'Dados da resposta em cache (JSON)';
COMMENT ON COLUMN api_cache.endpoint IS 'Endpoint da API que gerou o cache';
COMMENT ON COLUMN api_cache.expires_at IS 'Data de expiração do cache';
