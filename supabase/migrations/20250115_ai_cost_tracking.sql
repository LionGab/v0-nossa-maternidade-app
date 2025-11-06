-- Migration: AI Cost Tracking Table
-- Tabela para rastrear custos de cada provider de IA

CREATE TABLE IF NOT EXISTS ai_cost_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL CHECK (provider IN ('claude', 'gpt4', 'gemini', 'grok', 'perplexity')),
    date DATE NOT NULL,
    tokens_used INTEGER NOT NULL DEFAULT 0 CHECK (tokens_used >= 0),
    cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
    query_count INTEGER NOT NULL DEFAULT 0 CHECK (query_count >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),

    -- Índice único para provider + date
    UNIQUE(provider, date)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cost_tracking_provider ON ai_cost_tracking(provider);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_date ON ai_cost_tracking(date DESC);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_created_at ON ai_cost_tracking(created_at DESC);

-- Comentários
COMMENT ON TABLE ai_cost_tracking IS 'Rastreamento de custos por provider de IA';
COMMENT ON COLUMN ai_cost_tracking.provider IS 'Provider usado: claude, gpt4, gemini, grok, perplexity';
COMMENT ON COLUMN ai_cost_tracking.date IS 'Data do registro (YYYY-MM-DD)';
COMMENT ON COLUMN ai_cost_tracking.tokens_used IS 'Total de tokens usados no dia';
COMMENT ON COLUMN ai_cost_tracking.cost_usd IS 'Custo total em USD no dia';
COMMENT ON COLUMN ai_cost_tracking.query_count IS 'Número de queries no dia';

-- Função para obter custo total do mês
CREATE OR REPLACE FUNCTION get_monthly_cost(p_provider TEXT DEFAULT NULL)
RETURNS DECIMAL(10, 6) AS $$
DECLARE
    total_cost DECIMAL(10, 6);
BEGIN
    SELECT COALESCE(SUM(cost_usd), 0)
    INTO total_cost
    FROM ai_cost_tracking
    WHERE date >= date_trunc('month', CURRENT_DATE)
      AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
      AND (p_provider IS NULL OR provider = p_provider);

    RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_monthly_cost(TEXT) IS 'Retorna custo total do mês atual (opcionalmente por provider)';
