-- Enable Row Level Security on tables that don't have it yet
-- Many tables already have RLS enabled, so we only enable on the ones that don't

-- Tables that need RLS enabled (currently disabled):
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Note: All other tables already have RLS enabled!
-- The following tables already have RLS and policies:
-- - profiles
-- - ai_conversations
-- - ai_memory_context
-- - baby_profiles
-- - communities
-- - community_members
-- - community_posts
-- - daily_activities
-- - daily_suggestions
-- - diary_entries
-- - forum_posts
-- - forum_replies
-- - health_alerts
-- - in_app_notifications
-- - maternal_communities
-- - memory_embeddings
-- - notification_history
-- - notification_preferences
-- - onboarding_responses
-- - postpartum_screenings
-- - scheduled_notifications
-- - self_care_activities
-- - sentiment_analyses
-- - sentiment_analysis
-- - user_achievements
-- - user_challenge_progress
-- - user_gamification
-- - users
