-- Create repository_analyses table for storing comprehensive analysis results
CREATE TABLE IF NOT EXISTS repository_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Repository information
  repo_url TEXT NOT NULL,
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  repo_description TEXT,
  
  -- Analysis metadata
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  analysis_version TEXT DEFAULT '1.0.0',
  analysis_status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Core metrics (flattened for easy querying)
  total_lines_of_code INTEGER,
  primary_language TEXT,
  file_count INTEGER,
  stars INTEGER,
  forks INTEGER,
  contributors INTEGER,
  last_commit_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ,
  updated_date TIMESTAMPTZ,
  
  -- Analysis results (structured JSON)
  metrics JSONB, -- Detailed metrics from analyzer
  valuation_insights JSONB, -- Valuation data
  recommendations JSONB, -- Deal recommendations
  pitch_data JSONB, -- Generated pitch data from PitchEngine
  ai_thesis TEXT, -- AI-generated investment thesis
  
  -- Raw data and metadata
  raw_github_data JSONB, -- Raw data from GitHub API
  analysis_options JSONB, -- Options used for analysis
  
  -- Indexes for performance
  UNIQUE(user_id, repo_owner, repo_name),
  CONSTRAINT valid_repo_url CHECK (repo_url ~ '^https?://')
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_repository_analyses_user_id ON repository_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_analyzed_at ON repository_analyses(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_status ON repository_analyses(analysis_status);
CREATE INDEX IF NOT EXISTS idx_repository_analyses_repo_owner_name ON repository_analyses(repo_owner, repo_name);

-- Enable Row Level Security
ALTER TABLE repository_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analyses"
  ON repository_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON repository_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON repository_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON repository_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update analyzed_at timestamp
CREATE OR REPLACE FUNCTION update_analyzed_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.analyzed_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for analyzed_at (only on status change to completed)
CREATE TRIGGER update_repository_analyses_analyzed_at
  BEFORE UPDATE OF analysis_status ON repository_analyses
  FOR EACH ROW
  WHEN (NEW.analysis_status = 'completed' AND OLD.analysis_status != 'completed')
  EXECUTE FUNCTION update_analyzed_at_column();

-- Add a view for the showroom (last 3 analyses per user)
CREATE OR REPLACE VIEW showroom_analyses AS
SELECT 
  id,
  user_id,
  repo_url,
  repo_name,
  repo_description,
  analyzed_at,
  total_lines_of_code,
  primary_language,
  file_count,
  stars,
  forks,
  pitch_data,
  ai_thesis,
  metrics,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY analyzed_at DESC) as analysis_rank
FROM repository_analyses
WHERE analysis_status = 'completed'
ORDER BY analyzed_at DESC;

-- Grant access to the view
GRANT SELECT ON showroom_analyses TO authenticated;

-- Comment on table for documentation
COMMENT ON TABLE repository_analyses IS 'Stores comprehensive GitHub repository analyses with pitch data and AI theses';
COMMENT ON COLUMN repository_analyses.pitch_data IS 'Generated pitch data from PitchEngine for Roxy voice presentations';
COMMENT ON COLUMN repository_analyses.ai_thesis IS 'AI-generated investment thesis for the repository';
COMMENT ON COLUMN repository_analyses.metrics IS 'Detailed technical and community metrics from the analyzer';