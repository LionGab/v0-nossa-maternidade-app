-- =============================================================================
-- Migration: Criar tabelas e funções para MCP (Memory Context Protocol)
-- =============================================================================
-- Data: 2025-01-03
-- Descrição: Cria as tabelas memory_embeddings e ai_memory_context, além da
--            função RPC search_similar_memories para busca semântica
-- =============================================================================

-- Habilitar extensão pgvector se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- Tabela: memory_embeddings
-- =============================================================================
CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('conversation', 'diary', 'post', 'onboarding')),
  content_id TEXT,
  content_text TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_user_id ON memory_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_created_at ON memory_embeddings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_content_type ON memory_embeddings(content_type);

-- Índice HNSW para busca vetorial rápida
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_embedding ON memory_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- =============================================================================
-- Tabela: ai_memory_context
-- =============================================================================
CREATE TABLE IF NOT EXISTS ai_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  time_period TEXT NOT NULL CHECK (time_period IN ('weekly', 'monthly', 'custom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT NOT NULL,
  key_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CHECK (end_date >= start_date)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_memory_context_user_id ON ai_memory_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_context_dates ON ai_memory_context(start_date DESC, end_date DESC);

-- =============================================================================
-- Função RPC: search_similar_memories
-- =============================================================================
CREATE OR REPLACE FUNCTION search_similar_memories(
  query_embedding VECTOR(1536),
  match_user_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  content_text TEXT,
  content_type TEXT,
  metadata JSONB,
  similarity FLOAT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    me.id,
    me.content_text,
    me.content_type,
    me.metadata,
    1 - (me.embedding <=> query_embedding) AS similarity,
    me.created_at
  FROM memory_embeddings me
  WHERE me.user_id = match_user_id
    AND 1 - (me.embedding <=> query_embedding) >= match_threshold
  ORDER BY me.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE memory_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_context ENABLE ROW LEVEL SECURITY;

-- Políticas para memory_embeddings
CREATE POLICY "Users can view their own memory embeddings"
  ON memory_embeddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory embeddings"
  ON memory_embeddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory embeddings"
  ON memory_embeddings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory embeddings"
  ON memory_embeddings FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para ai_memory_context
CREATE POLICY "Users can view their own memory context"
  ON ai_memory_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory context"
  ON ai_memory_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory context"
  ON ai_memory_context FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory context"
  ON ai_memory_context FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- Comentários para documentação
-- =============================================================================
COMMENT ON TABLE memory_embeddings IS 'Armazena memórias com embeddings vetoriais para busca semântica';
COMMENT ON TABLE ai_memory_context IS 'Armazena resumos de períodos para contexto de longo prazo';
COMMENT ON FUNCTION search_similar_memories IS 'Busca memórias similares usando busca vetorial com pgvector';

-- =============================================================================
-- ROLLBACK (caso precise reverter)
-- =============================================================================
-- Para reverter esta migration, execute:
--
-- DROP POLICY IF EXISTS "Users can delete their own memory context" ON ai_memory_context;
-- DROP POLICY IF EXISTS "Users can update their own memory context" ON ai_memory_context;
-- DROP POLICY IF EXISTS "Users can insert their own memory context" ON ai_memory_context;
-- DROP POLICY IF EXISTS "Users can view their own memory context" ON ai_memory_context;
-- DROP POLICY IF EXISTS "Users can delete their own memory embeddings" ON memory_embeddings;
-- DROP POLICY IF EXISTS "Users can update their own memory embeddings" ON memory_embeddings;
-- DROP POLICY IF EXISTS "Users can insert their own memory embeddings" ON memory_embeddings;
-- DROP POLICY IF EXISTS "Users can view their own memory embeddings" ON memory_embeddings;
-- DROP FUNCTION IF EXISTS search_similar_memories;
-- DROP TABLE IF EXISTS ai_memory_context;
-- DROP TABLE IF EXISTS memory_embeddings;
-- =============================================================================