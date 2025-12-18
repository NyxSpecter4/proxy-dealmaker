-- Create table for storing GitHub OAuth tokens
CREATE TABLE IF NOT EXISTS user_github_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_user_id BIGINT NOT NULL,
  github_login TEXT NOT NULL,
  access_token TEXT NOT NULL,
  scope TEXT,
  token_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(github_user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_github_tokens_user_id ON user_github_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_github_tokens_github_user_id ON user_github_tokens(github_user_id);

-- Enable Row Level Security
ALTER TABLE user_github_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own GitHub tokens"
  ON user_github_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own GitHub tokens"
  ON user_github_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GitHub tokens"
  ON user_github_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own GitHub tokens"
  ON user_github_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_github_tokens_updated_at
  BEFORE UPDATE ON user_github_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create table for GitHub analyses
CREATE TABLE IF NOT EXISTS github_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_owner TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  repository_url TEXT NOT NULL,
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  metrics JSONB,
  valuation_insights JSONB,
  recommendations JSONB,
  raw_data JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, repository_owner, repository_name)
);

-- Create index for analyses
CREATE INDEX IF NOT EXISTS idx_github_analyses_user_id ON github_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_github_analyses_status ON github_analyses(analysis_status);
CREATE INDEX IF NOT EXISTS idx_github_analyses_created_at ON github_analyses(created_at DESC);

-- Enable RLS for analyses
ALTER TABLE github_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for analyses
CREATE POLICY "Users can view their own analyses"
  ON github_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON github_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON github_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON github_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger for analyses
CREATE TRIGGER update_github_analyses_updated_at
  BEFORE UPDATE ON github_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();