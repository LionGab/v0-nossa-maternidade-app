-- Migration: AI Performance Metrics Table
-- Tabela para rastrear métricas de performance de cada provider de IA

CREATE TABLE IF NOT EXISTS ai_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('claude', 'gpt4', 'gemini', 'grok', 'perplexity')),
    query_type TEXT NOT NULL CHECK (query_type IN ('empathetic', 'general', 'contextual', 'trends', 'research')),
    response_time_ms INTEGER NOT NULL CHECK (response_time_ms >= 0),
    tokens_used INTEGER,
    estimated_cost_usd DECIMAL(10, 6) CHECK (estimated_cost_usd >= 0),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),

    -- Índices para queries comuns
    CONSTRAINT valid_rating CHECK (user_rating IS NULL OR (user_rating >= 1 AND user_rating <= 5))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_metrics_user_id ON ai_performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_provider ON ai_performance_metrics(provider);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_query_type ON ai_performance_metrics(query_type);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_created_at ON ai_performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_user_rating ON ai_performance_metrics(user_rating) WHERE user_rating IS NOT NULL;

-- Comentários
COMMENT ON TABLE ai_performance_metrics IS 'Métricas de performance de cada provider de IA';
COMMENT ON COLUMN ai_performance_metrics.provider IS 'Provider usado: claude, gpt4, gemini, grok, perplexity';
COMMENT ON COLUMN ai_performance_metrics.query_type IS 'Tipo de query: empathetic, general, contextual, trends, research';
COMMENT ON COLUMN ai_performance_metrics.response_time_ms IS 'Tempo de resposta em milissegundos';
COMMENT ON COLUMN ai_performance_metrics.tokens_used IS 'Número de tokens usados (input + output)';
COMMENT ON COLUMN ai_performance_metrics.estimated_cost_usd IS 'Custo estimado em USD';
COMMENT ON COLUMN ai_performance_metrics.user_rating IS 'Avaliação do usuário (1-5)';
COMMENT ON COLUMN ai_performance_metrics.user_comment IS 'Comentário opcional do usuário';
