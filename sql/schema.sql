-- Create models table
CREATE TABLE models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL
);

-- Insert seed data for models
INSERT INTO models (tag) VALUES 
  ('gpt-4o'),
  ('gpt-4o-mini'),
  ('gpt-3.5-turbo');

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  model_tag text NOT NULL,
  role text CHECK (role IN ('user', 'ai')) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
-- Users can only read their own messages
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own messages
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable email/password authentication in Supabase Dashboard
-- Go to Authentication > Settings > Auth Providers > Email
-- Enable "Enable email confirmations" if desired
