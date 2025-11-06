-- Migration: Tabela saved_videos
-- Descrição: Armazena vídeos do Mundo Nath salvos pelos usuários

CREATE TABLE IF NOT EXISTS saved_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    video_title TEXT NOT NULL,
    video_description TEXT,
    video_url TEXT,
    video_thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_saved_videos_user_id ON saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_created_at ON saved_videos(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;

-- Remover policies existentes (se houver) antes de criar
DROP POLICY IF EXISTS "Users can view own saved videos" ON saved_videos;
DROP POLICY IF EXISTS "Users can insert own saved videos" ON saved_videos;
DROP POLICY IF EXISTS "Users can delete own saved videos" ON saved_videos;

-- Política: usuários só podem ver seus próprios vídeos salvos
CREATE POLICY "Users can view own saved videos"
    ON saved_videos FOR SELECT
    USING (auth.uid() = user_id);

-- Política: usuários só podem inserir seus próprios vídeos salvos
CREATE POLICY "Users can insert own saved videos"
    ON saved_videos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: usuários só podem deletar seus próprios vídeos salvos
CREATE POLICY "Users can delete own saved videos"
    ON saved_videos FOR DELETE
    USING (auth.uid() = user_id);
