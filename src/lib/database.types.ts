export type PointType = 'pole' | 'fiber_box' | 'cto';

export interface Point {
  id: string;
  type: PointType;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
}

export interface Cable {
  id: string;
  name: string;
  color: string;
  start_point_id: string;
  end_point_id: string;
  fiber_count: number;
  created_at: string;
}

export interface CableRoute {
  id: string;
  cable_id: string;
  route_points: Array<{ lat: number; lng: number }>;
  created_at: string;
}

export interface Box {
  id: string;
  point_id: string;
  capacity: number;
  status: string;
  notes: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  box_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
}

export interface Database {
  public: {
    Tables: {
      points: {
        Row: Point;
        Insert: Omit<Point, 'id' | 'created_at'>;
        Update: Partial<Omit<Point, 'id' | 'created_at'>>;
      };
      cables: {
        Row: Cable;
        Insert: Omit<Cable, 'id' | 'created_at'>;
        Update: Partial<Omit<Cable, 'id' | 'created_at'>>;
      };
      cable_routes: {
        Row: CableRoute;
        Insert: Omit<CableRoute, 'id' | 'created_at'>;
        Update: Partial<Omit<CableRoute, 'id' | 'created_at'>>;
      };
      boxes: {
        Row: Box;
        Insert: Omit<Box, 'id' | 'created_at'>;
        Update: Partial<Omit<Box, 'id' | 'created_at'>>;
      };
      attachments: {
        Row: Attachment;
        Insert: Omit<Attachment, 'id' | 'uploaded_at'>;
        Update: Partial<Omit<Attachment, 'id' | 'uploaded_at'>>;
      };
    };
  };
}
