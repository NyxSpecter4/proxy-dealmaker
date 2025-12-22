-- Create logos table for storing generated logos
CREATE TABLE IF NOT EXISTS logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Logo metadata
  name TEXT NOT NULL DEFAULT 'MAKO THOTH Logo',
  description TEXT DEFAULT 'Generated logo for MAKO THOTH brand',
  prompt TEXT NOT NULL,
  
  -- Image data
  image_url TEXT, -- Original URL from DALL-E
  image_base64 TEXT, -- Base64 encoded image data
  mime_type TEXT DEFAULT 'image/png',
  
  -- Generation metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model TEXT DEFAULT 'dall-e-3',
  size TEXT DEFAULT '1024x1024',
  
  -- Indexes
  UNIQUE(user_id, generated_at)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_logos_user_id ON logos(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_generated_at ON logos(generated_at DESC);

-- Enable Row Level Security
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own logos"
  ON logos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logos"
  ON logos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logos"
  ON logos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logos"
  ON logos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comment on table for documentation
COMMENT ON TABLE logos IS 'Stores generated logos with base64 data for MAKO THOTH brand';
COMMENT ON COLUMN logos.image_base64 IS 'Base64 encoded image data for direct embedding';