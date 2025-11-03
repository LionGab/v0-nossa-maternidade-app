-- =============================================================================
-- Migration: Sistema de Memória MCP (Memory Context Protocol)
-- =============================================================================
-- Data: 2025-11-03
-- Descrição: Cria tabelas e funções para o sistema de memória contextual
--            com embeddings vetoriais para busca semântica
-- =============================================================================

-- Habilitar extensão pgvector para armazenar embeddings vetoriais
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- TABELA: memory_embeddings
-- =============================================================================
-- Armazena memórias com embeddings vetoriais para busca semântica
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('conversation', 'diary', 'post', 'onboarding')),
  content_id TEXT, -- Referência opcional ao conteúdo original
  content_text TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small gera embeddings de 1536 dimensões
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comentários para documentação
COMMENT ON TABLE memory_embeddings IS 'Armazena memórias com embeddings vetoriais para busca semântica';
COMMENT ON COLUMN memory_embeddings.user_id IS 'ID do usuário proprietário da memória';
COMMENT ON COLUMN memory_embeddings.content_type IS 'Tipo de conteúdo: conversation, diary, post, onboarding';
COMMENT ON COLUMN memory_embeddings.content_id IS 'ID opcional do conteúdo original';
COMMENT ON COLUMN memory_embeddings.content_text IS 'Texto da memória';
COMMENT ON COLUMN memory_embeddings.embedding IS 'Embedding vetorial de 1536 dimensões (OpenAI)';
COMMENT ON COLUMN memory_embeddings.metadata IS 'Metadados adicionais em formato JSON';

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_user_id ON memory_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_content_type ON memory_embeddings(content_type);
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_created_at ON memory_embeddings(created_at DESC);

-- Índice HNSW para busca vetorial rápida (Hierarchical Navigable Small World)
-- m=16: número de conexões por nó (padrão, bom equilíbrio entre velocidade e precisão)
-- ef_construction=64: tamanho da lista de candidatos durante construção (padrão)
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_embedding 
ON memory_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- =============================================================================
-- TABELA: ai_memory_context
-- =============================================================================
-- Armazena resumos de períodos para contexto de longo prazo
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_period TEXT NOT NULL CHECK (time_period IN ('weekly', 'monthly', 'custom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT NOT NULL,
  key_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Comentários para documentação
COMMENT ON TABLE ai_memory_context IS 'Armazena resumos de períodos para contexto de longo prazo';
COMMENT ON COLUMN ai_memory_context.user_id IS 'ID do usuário proprietário do contexto';
COMMENT ON COLUMN ai_memory_context.time_period IS 'Tipo de período: weekly, monthly, custom';
COMMENT ON COLUMN ai_memory_context.start_date IS 'Data de início do período';
COMMENT ON COLUMN ai_memory_context.end_date IS 'Data de fim do período';
COMMENT ON COLUMN ai_memory_context.summary IS 'Resumo do período';
COMMENT ON COLUMN ai_memory_context.key_events IS 'Eventos importantes do período em formato JSON';

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ai_memory_context_user_id ON ai_memory_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_context_dates ON ai_memory_context(user_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ai_memory_context_time_period ON ai_memory_context(time_period);

-- =============================================================================
-- FUNÇÃO RPC: search_similar_memories
-- =============================================================================
-- Busca memórias similares usando similaridade de cosseno
-- =============================================================================

CREATE OR REPLACE FUNCTION search_similar_memories(
  query_embedding vector(1536),
  match_user_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  contentText TEXT,
  contentType TEXT,
  metadata JSONB,
  similarity FLOAT,
  createdAt TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    memory_embeddings.id,
    memory_embeddings.content_text AS "contentText",
    memory_embeddings.content_type AS "contentType",
    memory_embeddings.metadata,
    -- Similaridade de cosseno (1 - distância cosseno)
    (1 - (memory_embeddings.embedding <=> query_embedding))::FLOAT AS similarity,
    memory_embeddings.created_at AS "createdAt"
  FROM memory_embeddings
  WHERE 
    memory_embeddings.user_id = match_user_id
    AND (1 - (memory_embeddings.embedding <=> query_embedding)) >= match_threshold
  ORDER BY memory_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Comentário na função para documentação
COMMENT ON FUNCTION search_similar_memories IS 
'Busca memórias similares usando similaridade de cosseno. Retorna apenas memórias do usuário especificado com similaridade >= threshold.';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE memory_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_context ENABLE ROW LEVEL SECURITY;

-- Políticas para memory_embeddings
CREATE POLICY "Users can view their own memories"
  ON memory_embeddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories"
  ON memory_embeddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON memory_embeddings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON memory_embeddings FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para ai_memory_context
CREATE POLICY "Users can view their own context"
  ON ai_memory_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own context"
  ON ai_memory_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own context"
  ON ai_memory_context FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own context"
  ON ai_memory_context FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
-- Para verificar se tudo foi criado corretamente, execute:
--
-- SELECT EXISTS (
--   SELECT FROM pg_extension WHERE extname = 'vector'
-- ) AS vector_enabled;
--
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('memory_embeddings', 'ai_memory_context');
--
-- SELECT routine_name FROM information_schema.routines
-- WHERE routine_schema = 'public'
-- AND routine_name = 'search_similar_memories';
--
-- =============================================================================
-- ROLLBACK (caso precise reverter)
-- =============================================================================
-- Para reverter esta migration, execute:
--
-- DROP FUNCTION IF EXISTS search_similar_memories;
-- DROP TABLE IF EXISTS ai_memory_context CASCADE;
-- DROP TABLE IF EXISTS memory_embeddings CASCADE;
-- DROP EXTENSION IF EXISTS vector CASCADE;
-- =============================================================================
