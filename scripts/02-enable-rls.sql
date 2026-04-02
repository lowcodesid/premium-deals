-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Deals policies - everyone can read deals
CREATE POLICY "Deals are viewable by everyone" ON deals
  FOR SELECT USING (true);

-- Watchlists policies - users can only manage their own watchlists
CREATE POLICY "Users can view their own watchlists" ON watchlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlists" ON watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlists" ON watchlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists" ON watchlists
  FOR DELETE USING (auth.uid() = user_id);

-- Alerts policies - users can only view their own alerts
CREATE POLICY "Users can view their own alerts" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
