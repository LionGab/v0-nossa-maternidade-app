-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotional_state TEXT NOT NULL,
  main_challenges TEXT[] NOT NULL,
  sleep_quality TEXT NOT NULL,
  self_care_frequency TEXT NOT NULL,
  baby_age_months INTEGER,
  specific_needs TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_responses
CREATE POLICY "onboarding_select_own"
  ON public.onboarding_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "onboarding_insert_own"
  ON public.onboarding_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create sentiment_analysis table
CREATE TABLE IF NOT EXISTS public.sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'onboarding', 'chat', 'journal'
  input_text TEXT NOT NULL,
  sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
  sentiment_label TEXT, -- 'positive', 'neutral', 'negative', 'mixed'
  emotions JSONB, -- detailed emotion breakdown
  recommendations TEXT[],
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sentiment_analysis
CREATE POLICY "sentiment_select_own"
  ON public.sentiment_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "sentiment_insert_own"
  ON public.sentiment_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON public.onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_user_id ON public.sentiment_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_created_at ON public.sentiment_analysis(created_at DESC);
