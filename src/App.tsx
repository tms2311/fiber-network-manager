import { useEffect, useState } from 'react';
import { Map } from './components/Map';
import { Sidebar } from './components/Sidebar';
import { PointForm } from './components/PointForm';
import { CableForm } from './components/CableForm';
import { BoxForm } from './components/BoxForm';
import { NetworkList } from './components/NetworkList';
import { supabase } from './lib/supabase';
import type { Point, Cable, CableRoute, Box, Attachment } from './lib/database.types';

type ViewType = 'list' | 'add-point' | 'add-cable' | 'add-box';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('list');
  const [points, setPoints] = useState<Point[]>([]);
  const [cables, setCables] = useState<Cable[]>([]);
  const [cableRoutes, setCableRoutes] = useState<CableRoute[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBox) {
      loadAttachments(selectedBox.id);
    }
  }, [selectedBox]);

  const loadData = async () => {
    const [pointsRes, cablesRes, routesRes, boxesRes] = await Promise.all([
      supabase.from('points').select('*').order('created_at', { ascending: false }),
      supabase.from('cables').select('*').order('created_at', { ascending: false }),
      supabase.from('cable_routes').select('*'),
      supabase.from('boxes').select('*').order('created_at', { ascending: false }),
    ]);

    if (pointsRes.data) setPoints(pointsRes.data);
    if (cablesRes.data) setCables(cablesRes.data);
    if (routesRes.data) setCableRoutes(routesRes.data);
    if (boxesRes.data) setBoxes(boxesRes.data);
  };

  const loadAttachments = async (boxId: string) => {
    const { data } = await supabase
      .from('attachments')
      .select('*')
      .eq('box_id', boxId);
    if (data) setAttachments(data);
  };

  const handleAddPoint = async (data: Omit<Point, 'id' | 'created_at'>) => {
    const { data: newPoint, error } = await supabase
      .from('points')
      .insert(data)
      .select()
      .single();

    if (error) {
      alert('Error creating point: ' + error.message);
      return;
    }

    if (newPoint) {
      setPoints([newPoint, ...points]);
      setActiveView('list');
      setClickedLocation(null);
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!confirm('Delete this point? Associated cables and boxes will also be deleted.')) return;

    const { error } = await supabase.from('points').delete().eq('id', id);
    if (error) {
      alert('Error deleting point: ' + error.message);
      return;
    }
    setPoints(points.filter(p => p.id !== id));
  };

  const handleAddCable = async (data: {
    name: string;
    color: string;
    start_point_id: string;
    end_point_id: string;
    fiber_count: number;
    route_points: Array<{ lat: number; lng: number }>;
  }) => {
    const { name, color, start_point_id, end_point_id, fiber_count, route_points } = data;

    const { data: newCable, error: cableError } = await supabase
      .from('cables')
      .insert({ name, color, start_point_id, end_point_id, fiber_count })
      .select()
      .single();

    if (cableError) {
      alert('Error creating cable: ' + cableError.message);
      return;
    }

    if (newCable) {
      setCables([newCable, ...cables]);

      if (route_points.length > 0) {
        const { data: newRoute } = await supabase
          .from('cable_routes')
          .insert({ cable_id: newCable.id, route_points })
          .select()
          .single();

        if (newRoute) {
          setCableRoutes([...cableRoutes, newRoute]);
        }
      }

      setActiveView('list');
    }
  };

  const handleDeleteCable = async (id: string) => {
    if (!confirm('Delete this cable?')) return;

    const { error } = await supabase.from('cables').delete().eq('id', id);
    if (error) {
      alert('Error deleting cable: ' + error.message);
      return;
    }
    setCables(cables.filter(c => c.id !== id));
    setCableRoutes(cableRoutes.filter(r => r.cable_id !== id));
  };

  const handleAddBox = async (data: Omit<Box, 'id' | 'created_at'>) => {
    const { data: newBox, error } = await supabase
      .from('boxes')
      .insert(data)
      .select()
      .single();

    if (error) {
      alert('Error creating box: ' + error.message);
      return;
    }

    if (newBox) {
      setBoxes([newBox, ...boxes]);
      setActiveView('list');
    }
  };

  const handleUpdateBox = async (boxId: string, data: Partial<Box>) => {
    const { error } = await supabase
      .from('boxes')
      .update(data)
      .eq('id', boxId);

    if (error) {
      alert('Error updating box: ' + error.message);
      return;
    }

    setBoxes(boxes.map(b => b.id === boxId ? { ...b, ...data } : b));
    setSelectedBox(null);
    setActiveView('list');
  };

  const handleDeleteBox = async (id: string) => {
    if (!confirm('Delete this box?')) return;

    const { error } = await supabase.from('boxes').delete().eq('id', id);
    if (error) {
      alert('Error deleting box: ' + error.message);
      return;
    }
    setBoxes(boxes.filter(b => b.id !== id));
  };

  const handleUploadPhoto = async (boxId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${boxId}-${Date.now()}.${fileExt}`;
    const filePath = `box-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading photo: ' + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    const { data: newAttachment, error: attachmentError } = await supabase
      .from('attachments')
      .insert({
        box_id: boxId,
        file_path: publicUrl,
        file_name: file.name,
        file_type: file.type,
      })
      .select()
      .single();

    if (attachmentError) {
      alert('Error saving attachment: ' + attachmentError.message);
      return;
    }

    if (newAttachment) {
      setAttachments([...attachments, newAttachment]);
    }
  };

  const handleDeletePhoto = async (attachmentId: string) => {
    if (!confirm('Delete this photo?')) return;

    const attachment = attachments.find(a => a.id === attachmentId);
    if (!attachment) return;

    const pathParts = attachment.file_path.split('/');
    const filePath = `box-photos/${pathParts[pathParts.length - 1]}`;

    await supabase.storage.from('attachments').remove([filePath]);

    const { error } = await supabase.from('attachments').delete().eq('id', attachmentId);
    if (error) {
      alert('Error deleting photo: ' + error.message);
      return;
    }

    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (activeView === 'add-point') {
      setClickedLocation({ lat, lng });
    }
  };

  const handleSelectBox = (box: Box) => {
    setSelectedBox(box);
    setActiveView('add-box');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedBox(null);
          setClickedLocation(null);
        }}
        pointCount={points.length}
        cableCount={cables.length}
        boxCount={boxes.length}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <Map
            points={points}
            cables={cables}
            cableRoutes={cableRoutes}
            onMapClick={handleMapClick}
            drawingMode={activeView === 'add-point' ? 'point' : null}
          />
        </div>
      </div>

      <div className="w-96 bg-gray-50 p-4 overflow-y-auto">
        {activeView === 'list' && (
          <NetworkList
            points={points}
            cables={cables}
            boxes={boxes}
            onDeletePoint={handleDeletePoint}
            onDeleteCable={handleDeleteCable}
            onDeleteBox={handleDeleteBox}
            onSelectBox={handleSelectBox}
          />
        )}

        {activeView === 'add-point' && (
          <PointForm
            onSubmit={handleAddPoint}
            onCancel={() => {
              setActiveView('list');
              setClickedLocation(null);
            }}
            initialLat={clickedLocation?.lat}
            initialLng={clickedLocation?.lng}
          />
        )}

        {activeView === 'add-cable' && (
          <CableForm
            points={points}
            onSubmit={handleAddCable}
            onCancel={() => setActiveView('list')}
          />
        )}

        {activeView === 'add-box' && (
          <BoxForm
            points={points}
            selectedBox={selectedBox}
            attachments={attachments}
            onSubmit={handleAddBox}
            onUpdate={handleUpdateBox}
            onUploadPhoto={handleUploadPhoto}
            onDeletePhoto={handleDeletePhoto}
            onCancel={() => {
              setActiveView('list');
              setSelectedBox(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
