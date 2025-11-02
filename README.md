# Nossa Maternidade app

*Migrated from v0 to v1 - Production-ready maternal care application*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/liams-projects-a37cc75c/v1-nossamaternidade)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge)](https://nextjs.org)

## Overview

This is the v1 repository for Nossa Maternidade application - a comprehensive maternal care platform with authentication, gamification, AI chat, diary features, and more.

## Deployment

Your project is live at:

**[https://vercel.com/liams-projects-a37cc75c/v1-nossamaternidade](https://vercel.com/liams-projects-a37cc75c/v1-nossamaternidade)**

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- AI API keys (Anthropic, OpenAI, Google AI)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LionGab/v1-nossamaternidade.git
cd v1-nossamaternidade
```

2. Install dependencies:
```bash
pnpm install
# or
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ANTHROPIC_API_KEY` - Claude AI API key
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI API key

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Supabase Setup

This application requires a Supabase project with the following:

1. **Authentication enabled** (Email/Password)
2. **Database tables** (see schema in Supabase project)
3. **Row Level Security (RLS)** policies configured
4. **Triggers** for automatic profile creation

Refer to [CURSOR_MIGRATION_PLAN.md](./CURSOR_MIGRATION_PLAN.md) for detailed database setup instructions.

## Features

- 🔐 **Secure Authentication** - Supabase auth with route protection middleware
- 🛡️ **Data Validation** - Zod schemas for all API inputs
- 👶 **Maternal Journey Tracking** - Track pregnancy, planning, postpartum
- 💬 **AI-Powered Chat** - Multi-AI support (Claude, OpenAI, Google AI)
- 📔 **Personal Diary** - Private journal for maternal experiences
- 🎮 **Gamification System** - Points, levels, and achievements
- 🏆 **Achievements & Rewards** - Unlock badges for activities
- 👥 **Community Features** - Share experiences with other mothers
- 📊 **Analytics & Insights** - Track emotional well-being
- 🍳 **Recipe Generation** - AI-powered healthy recipes

## Security & Best Practices

✅ **Route Protection** - Middleware guards all protected routes  
✅ **Input Validation** - Zod schemas prevent invalid data  
✅ **No Debug Logs** - Production-ready, no sensitive info leaked  
✅ **RLS Policies** - Database-level security with Supabase  
✅ **Error Handling** - Consistent error responses across APIs  

## Project Structure

```
v1-nossamaternidade/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── login/             # Authentication pages
│   ├── signup/            
│   ├── onboarding/        # User onboarding flow
│   └── ...                # Other pages
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client/server
│   ├── validations/      # Zod validation schemas
│   └── ...
├── middleware.ts          # Route protection
└── ...
```

## Documentation

- [CURSOR_MIGRATION_PLAN.md](./CURSOR_MIGRATION_PLAN.md) - Detailed migration and architecture
- [AUDIT_AND_ACTION_PLAN.md](./AUDIT_AND_ACTION_PLAN.md) - Security audit and fixes
- [FIXES_CHECKLIST.md](./FIXES_CHECKLIST.md) - Implementation checklist

## Recent Updates

### v1.0.0 - MVP Security & Functionality
- ✅ Added middleware for route protection
- ✅ Removed all debug console.log statements
- ✅ Implemented Zod validation for APIs
- ✅ Enhanced authentication flow
- ✅ Added comprehensive error handling

## Contributing

This is a production application. For development:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved

## Support

For issues or questions, please create a GitHub issue or contact the development team.
