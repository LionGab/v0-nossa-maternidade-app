-- Gamification System for Nossa Maternidade
-- Sistema de gamificação acolhedor e não-competitivo focado em bem-estar maternal

-- Tabela de pontos e níveis do usuário
CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sistema de pontos
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  points_to_next_level INTEGER DEFAULT 100,
  
  -- Streaks (sequências)
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- Estatísticas
  total_check_ins INTEGER DEFAULT 0,
  total_journal_entries INTEGER DEFAULT 0,
  total_self_care_activities INTEGER DEFAULT 0,
  total_community_interactions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Tabela de conquistas (achievements)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'self_care', 'community', 'consistency', 'milestone'
  
  -- Gamificação
  icon VARCHAR(100), -- emoji ou nome do ícone
  points_reward INTEGER DEFAULT 0,
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  
  -- Critérios
  requirement_type VARCHAR(50) NOT NULL, -- 'streak', 'count', 'milestone'
  requirement_value INTEGER NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conquistas desbloqueadas pelos usuários
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  is_new BOOLEAN DEFAULT true, -- Para mostrar notificação
  
  UNIQUE(user_id, achievement_id)
);

-- Tabela de desafios semanais
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do desafio
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  
  -- Período
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Gamificação
  points_reward INTEGER DEFAULT 50,
  icon VARCHAR(100),
  
  -- Critérios
  goal_type VARCHAR(50) NOT NULL, -- 'count', 'streak', 'completion'
  goal_value INTEGER NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso dos usuários nos desafios
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, challenge_id)
);

-- Tabela de atividades diárias (para tracking)
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  activity_date DATE NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'check_in', 'journal', 'self_care', 'community'
  
  -- Detalhes
  points_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, activity_date, activity_type)
);

-- Índices para performance
CREATE INDEX idx_user_gamification_user_id ON user_gamification(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_challenge_progress_user_id ON user_challenge_progress(user_id);
CREATE INDEX idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX idx_weekly_challenges_dates ON weekly_challenges(start_date, end_date);

-- RLS Policies
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can view own gamification data"
  ON user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data"
  ON user_gamification FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all achievements definitions"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own challenge progress"
  ON user_challenge_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view active challenges"
  ON weekly_challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own activities"
  ON daily_activities FOR SELECT
  USING (auth.uid() = user_id);

-- Inserir conquistas iniciais
INSERT INTO achievements (code, name, description, category, icon, points_reward, rarity, requirement_type, requirement_value) VALUES
  -- Conquistas de Consistência
  ('first_check_in', 'Primeiro Passo', 'Fez seu primeiro check-in diário', 'consistency', '🌱', 10, 'common', 'count', 1),
  ('streak_3', 'Compromisso de 3 Dias', 'Manteve uma sequência de 3 dias', 'consistency', '🔥', 30, 'common', 'streak', 3),
  ('streak_7', 'Uma Semana Forte', 'Manteve uma sequência de 7 dias', 'consistency', '💪', 70, 'rare', 'streak', 7),
  ('streak_30', 'Mês de Dedicação', 'Manteve uma sequência de 30 dias', 'consistency', '⭐', 300, 'epic', 'streak', 30),
  ('streak_100', 'Centenária', 'Manteve uma sequência de 100 dias', 'consistency', '👑', 1000, 'legendary', 'streak', 100),
  
  -- Conquistas de Autocuidado
  ('self_care_5', 'Cuidando de Mim', 'Completou 5 atividades de autocuidado', 'self_care', '💆‍♀️', 50, 'common', 'count', 5),
  ('self_care_20', 'Prioridade Própria', 'Completou 20 atividades de autocuidado', 'self_care', '🌸', 150, 'rare', 'count', 20),
  ('self_care_50', 'Mestre do Autocuidado', 'Completou 50 atividades de autocuidado', 'self_care', '🦋', 400, 'epic', 'count', 50),
  
  -- Conquistas de Comunidade
  ('community_first', 'Bem-vinda à Comunidade', 'Primeira interação na comunidade', 'community', '👋', 20, 'common', 'count', 1),
  ('community_10', 'Voz Ativa', '10 interações na comunidade', 'community', '💬', 100, 'rare', 'count', 10),
  ('community_50', 'Pilar da Comunidade', '50 interações na comunidade', 'community', '🤝', 400, 'epic', 'count', 50),
  
  -- Conquistas de Diário
  ('journal_first', 'Primeira Página', 'Primeira entrada no diário', 'milestone', '📔', 15, 'common', 'count', 1),
  ('journal_10', 'Escritora Dedicada', '10 entradas no diário', 'milestone', '✍️', 100, 'rare', 'count', 10),
  ('journal_50', 'Cronista Maternal', '50 entradas no diário', 'milestone', '📚', 400, 'epic', 'count', 50),
  
  -- Conquistas Especiais
  ('early_bird', 'Madrugadora', 'Check-in antes das 7h da manhã', 'milestone', '🌅', 50, 'rare', 'milestone', 1),
  ('night_owl', 'Coruja Noturna', 'Check-in depois das 22h', 'milestone', '🌙', 50, 'rare', 'milestone', 1),
  ('weekend_warrior', 'Guerreira de Fim de Semana', 'Check-in em todos os dias do fim de semana', 'milestone', '🎉', 60, 'rare', 'milestone', 1);

-- Inserir desafios semanais iniciais
INSERT INTO weekly_challenges (title, description, category, start_date, end_date, points_reward, icon, goal_type, goal_value) VALUES
  ('Semana do Autocuidado', 'Complete 5 atividades de autocuidado esta semana', 'self_care', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 100, '💆‍♀️', 'count', 5),
  ('Diário Semanal', 'Escreva no diário 3 vezes esta semana', 'journal', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 80, '📝', 'count', 3),
  ('Conexão Comunitária', 'Interaja com a comunidade 5 vezes esta semana', 'community', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 90, '🤝', 'count', 5);
