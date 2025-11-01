-- Tabela para triagens de depressão pós-parto
CREATE TABLE IF NOT EXISTS postpartum_screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  risk_score INTEGER NOT NULL,
  screening_data JSONB NOT NULL,
  needs_professional_help BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para alertas de saúde
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  data JSONB NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para conversas com IA
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  messages JSONB NOT NULL,
  model_used TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE postpartum_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes antes de criar novas
DROP POLICY IF EXISTS "Users can view own screenings" ON postpartum_screenings;
DROP POLICY IF EXISTS "Users can insert own screenings" ON postpartum_screenings;
DROP POLICY IF EXISTS "Users can view own alerts" ON health_alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON health_alerts;
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON ai_conversations;

-- Políticas RLS
CREATE POLICY "Users can view own screenings" ON postpartum_screenings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own screenings" ON postpartum_screenings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own alerts" ON health_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON health_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Remover índices existentes antes de criar novos
DROP INDEX IF EXISTS idx_screenings_user_date;
DROP INDEX IF EXISTS idx_alerts_user_severity;
DROP INDEX IF EXISTS idx_conversations_user_date;

-- Índices para performance
CREATE INDEX idx_screenings_user_date ON postpartum_screenings(user_id, created_at DESC);
CREATE INDEX idx_alerts_user_severity ON health_alerts(user_id, severity, acknowledged);
CREATE INDEX idx_conversations_user_date ON ai_conversations(user_id, created_at DESC);
