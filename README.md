# AI Chat App

A production-ready minimal AI Chat App built with Next.js 14, TypeScript, tRPC, and Supabase. Chat with AI models powered by OpenAI or use the fallback echo mode.

## Features

- 🔐 **Authentication**: Email/password sign up and sign in with Supabase
- 🤖 **AI Models**: Support for GPT-4o, GPT-4o-mini, and GPT-3.5-turbo
- 💬 **Real-time Chat**: Persistent chat history with timestamps
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Mobile-friendly**: Responsive design that works on all devices
- 🔒 **Secure**: Row Level Security (RLS) ensures users only see their own messages
- ⚡ **Fast**: Built with Next.js 14 App Router and tRPC for optimal performance

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: tRPC, Supabase
- **AI**: OpenAI API (with fallback echo mode)
- **Styling**: Tailwind CSS with custom design system

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the environment template and fill in your values:
```bash
cp env.template .env.local
```

Fill in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `sql/schema.sql`
3. Go to Authentication > Settings > Auth Providers > Email and enable email/password authentication
4. Copy your project URL and anon key to `.env.local`

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## How It Works

### Authentication Flow
1. Users sign up/sign in with email and password
2. Supabase handles authentication and session management
3. User ID is used to filter messages with RLS policies

### Chat Flow
1. User selects an AI model from the dropdown
2. Chat history loads for the selected model
3. User types a message and hits send
4. Message is saved to Supabase
5. AI response is generated (OpenAI API or echo fallback)
6. AI response is saved and displayed
7. Chat scrolls to bottom automatically

### AI Integration
- **With OpenAI API Key**: Uses GPT-4o-mini for real AI responses
- **Without API Key**: Falls back to echo mode ("you said: {prompt}")

## Project Structure

```
├── app/
│   ├── (auth)/auth/          # Authentication pages
│   ├── api/trpc/             # tRPC API routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main chat page
│   └── providers.tsx         # React Query + tRPC providers
├── components/
│   ├── chat/                 # Chat-specific components
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   └── navbar.tsx            # Navigation bar
├── lib/
│   ├── trpc.ts               # tRPC client setup
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
├── server/
│   ├── routers/              # tRPC routers
│   ├── trpc.ts               # tRPC server setup
│   └── supabaseAdmin.ts      # Supabase admin client
└── sql/
    └── schema.sql            # Database schema
```

## API Endpoints

### tRPC Routers

#### Models Router
- `models.getAvailable()` - Get list of available AI models

#### Chat Router
- `chat.send({ userId, modelTag, prompt })` - Send a message and get AI response
- `chat.history({ userId, modelTag })` - Get chat history for a model

## Database Schema

### Models Table
```sql
CREATE TABLE models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  model_tag text NOT NULL,
  role text CHECK (role IN ('user', 'ai')) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New AI Models
1. Add the model tag to the `models` table in Supabase
2. The model will automatically appear in the dropdown

### Customizing the UI
- Modify components in `components/ui/` for base components
- Update `app/globals.css` for global styles
- Use Tailwind classes for styling

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Troubleshooting

### Common Issues

1. **"Failed to fetch models" error**
   - Check your Supabase URL and anon key
   - Ensure the `models` table exists and has data

2. **Authentication not working**
   - Verify email/password auth is enabled in Supabase
   - Check your Supabase URL and anon key

3. **AI responses not working**
   - Check your OpenAI API key
   - Without an API key, the app will use echo mode

4. **Messages not saving**
   - Check RLS policies are set up correctly
   - Verify user authentication is working

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Happy Chatting! 🤖💬**