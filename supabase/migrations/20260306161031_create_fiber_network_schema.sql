/*
  # Fiber Optic Network Documentation System

  ## Overview
  This migration creates a complete database schema for managing fiber optic network infrastructure,
  including network points, cables, routes, boxes, and photo attachments.

  ## Tables Created

  ### 1. points
  Stores all network points in the fiber optic system (poles, fiber boxes, CTOs)
  - `id` (uuid, primary key) - Unique identifier
  - `type` (text) - Type of point: 'pole', 'fiber_box', or 'cto'
  - `name` (text) - Display name for the point
  - `latitude` (numeric) - Geographic latitude coordinate
  - `longitude` (numeric) - Geographic longitude coordinate
  - `description` (text) - Optional description
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. cables
  Stores fiber optic cables connecting network points
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Cable identifier/name
  - `color` (text) - Visual color for map display
  - `start_point_id` (uuid, foreign key) - Starting network point
  - `end_point_id` (uuid, foreign key) - Ending network point
  - `fiber_count` (integer) - Number of fibers in the cable
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. cable_routes
  Stores the detailed path/route for each cable on the map
  - `id` (uuid, primary key) - Unique identifier
  - `cable_id` (uuid, foreign key) - Associated cable
  - `route_points` (jsonb) - Array of coordinate objects [{lat, lng}, ...]
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. boxes
  Stores detailed information about fiber boxes
  - `id` (uuid, primary key) - Unique identifier
  - `point_id` (uuid, foreign key) - Associated network point
  - `capacity` (integer) - Maximum fiber capacity
  - `status` (text) - Current status (active, maintenance, etc.)
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. attachments
  Stores photo attachments for fiber boxes
  - `id` (uuid, primary key) - Unique identifier
  - `box_id` (uuid, foreign key) - Associated fiber box
  - `file_path` (text) - Storage path for the file
  - `file_name` (text) - Original file name
  - `file_type` (text) - MIME type
  - `uploaded_at` (timestamptz) - Upload timestamp

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Authenticated users can perform all operations
  - Public access is restricted
*/

-- Create points table
CREATE TABLE IF NOT EXISTS points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('pole', 'fiber_box', 'cto')),
  name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create cables table
CREATE TABLE IF NOT EXISTS cables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#FF0000',
  start_point_id uuid NOT NULL REFERENCES points(id) ON DELETE CASCADE,
  end_point_id uuid NOT NULL REFERENCES points(id) ON DELETE CASCADE,
  fiber_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cable_routes table
CREATE TABLE IF NOT EXISTS cable_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cable_id uuid NOT NULL REFERENCES cables(id) ON DELETE CASCADE,
  route_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create boxes table
CREATE TABLE IF NOT EXISTS boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  point_id uuid NOT NULL REFERENCES points(id) ON DELETE CASCADE,
  capacity integer DEFAULT 0,
  status text DEFAULT 'active',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id uuid NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cables_start_point ON cables(start_point_id);
CREATE INDEX IF NOT EXISTS idx_cables_end_point ON cables(end_point_id);
CREATE INDEX IF NOT EXISTS idx_cable_routes_cable ON cable_routes(cable_id);
CREATE INDEX IF NOT EXISTS idx_boxes_point ON boxes(point_id);
CREATE INDEX IF NOT EXISTS idx_attachments_box ON attachments(box_id);

-- Enable Row Level Security
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE cables ENABLE ROW LEVEL SECURITY;
ALTER TABLE cable_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for points
CREATE POLICY "Authenticated users can view points"
  ON points FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert points"
  ON points FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update points"
  ON points FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete points"
  ON points FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for cables
CREATE POLICY "Authenticated users can view cables"
  ON cables FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cables"
  ON cables FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cables"
  ON cables FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cables"
  ON cables FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for cable_routes
CREATE POLICY "Authenticated users can view cable routes"
  ON cable_routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cable routes"
  ON cable_routes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cable routes"
  ON cable_routes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cable routes"
  ON cable_routes FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for boxes
CREATE POLICY "Authenticated users can view boxes"
  ON boxes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert boxes"
  ON boxes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update boxes"
  ON boxes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete boxes"
  ON boxes FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for attachments
CREATE POLICY "Authenticated users can view attachments"
  ON attachments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert attachments"
  ON attachments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update attachments"
  ON attachments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete attachments"
  ON attachments FOR DELETE
  TO authenticated
  USING (true);