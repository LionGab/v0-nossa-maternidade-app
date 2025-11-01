-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for storing embeddings of all user content
CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'conversation', 'diary', 'post', 'onboarding'
  content_id UUID, -- reference to original content
  content_text TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embeddings
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS memory_embeddings_user_id_idx ON memory_embeddings(user_id);
CREATE INDEX IF NOT EXISTS memory_embeddings_embedding_idx ON memory_embeddings 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS memory_embeddings_created_at_idx ON memory_embeddings(created_at DESC);

-- Enable RLS
ALTER TABLE memory_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own embeddings"
  ON memory_embeddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own embeddings"
  ON memory_embeddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table for diary entries
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[],
  audio_url TEXT, -- URL to audio recording
  audio_transcript TEXT, -- Transcription of audio
  summary TEXT, -- AI-generated summary
  sentiment_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS diary_entries_user_id_idx ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS diary_entries_created_at_idx ON diary_entries(created_at DESC);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries"
  ON diary_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries"
  ON diary_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary entries"
  ON diary_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Table for community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT, -- 'question', 'story', 'tip', 'support'
  tags TEXT[],
  moderation_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderation_notes TEXT,
  summary TEXT, -- AI-generated summary
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_category_idx ON community_posts(category);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved posts"
  ON community_posts FOR SELECT
  USING (moderation_status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Table for AI memory context (stores summarized context for faster retrieval)
CREATE TABLE IF NOT EXISTS ai_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_period TEXT NOT NULL, -- 'week', 'month', 'quarter'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT NOT NULL, -- Condensed summary of the period
  key_events JSONB, -- Important events/milestones
  emotional_trends JSONB, -- Emotional patterns
  topics JSONB, -- Main topics discussed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_memory_context_user_id_idx ON ai_memory_context(user_id);
CREATE INDEX IF NOT EXISTS ai_memory_context_dates_idx ON ai_memory_context(user_id, start_date, end_date);

ALTER TABLE ai_memory_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memory context"
  ON ai_memory_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert memory context"
  ON ai_memory_context FOR INSERT
  WITH CHECK (true);

-- Function to search similar memories
CREATE OR REPLACE FUNCTION search_similar_memories(
  query_embedding vector(1536),
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
    memory_embeddings.id,
    memory_embeddings.content_text,
    memory_embeddings.content_type,
    memory_embeddings.metadata,
    1 - (memory_embeddings.embedding <=> query_embedding) AS similarity,
    memory_embeddings.created_at
  FROM memory_embeddings
  WHERE memory_embeddings.user_id = match_user_id
    AND 1 - (memory_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY memory_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
