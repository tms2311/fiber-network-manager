import { MapPin, Cable as CableIcon, Box, Trash2 } from 'lucide-react';
import type { Point, Cable, Box as BoxType } from '../lib/database.types';

interface NetworkListProps {
  points: Point[];
  cables: Cable[];
  boxes: BoxType[];
  onDeletePoint: (id: string) => void;
  onDeleteCable: (id: string) => void;
  onDeleteBox: (id: string) => void;
  onSelectBox: (box: BoxType) => void;
}

export function NetworkList({
  points,
  cables,
  boxes,
  onDeletePoint,
  onDeleteCable,
  onDeleteBox,
  onSelectBox,
}: NetworkListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin size={20} />
          Network Points ({points.length})
        </h3>
        <div className="space-y-2">
          {points.map((point) => (
            <div
              key={point.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium">{point.name}</div>
                <div className="text-sm text-gray-600">
                  {point.type} • {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                </div>
              </div>
              <button
                onClick={() => onDeletePoint(point.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {points.length === 0 && (
            <p className="text-gray-500 text-sm">No points added yet</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CableIcon size={20} />
          Fiber Cables ({cables.length})
        </h3>
        <div className="space-y-2">
          {cables.map((cable) => {
            const startPoint = points.find(p => p.id === cable.start_point_id);
            const endPoint = points.find(p => p.id === cable.end_point_id);
            return (
              <div
                key={cable.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cable.color }}
                  />
                  <div>
                    <div className="font-medium">{cable.name}</div>
                    <div className="text-sm text-gray-600">
                      {startPoint?.name} → {endPoint?.name} • {cable.fiber_count} fibers
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteCable(cable.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
          {cables.length === 0 && (
            <p className="text-gray-500 text-sm">No cables added yet</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Box size={20} />
          Fiber Boxes ({boxes.length})
        </h3>
        <div className="space-y-2">
          {boxes.map((box) => {
            const point = points.find(p => p.id === box.point_id);
            return (
              <div
                key={box.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectBox(box)}
              >
                <div>
                  <div className="font-medium">{point?.name}</div>
                  <div className="text-sm text-gray-600">
                    Capacity: {box.capacity} • Status: {box.status}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBox(box.id);
                  }}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
          {boxes.length === 0 && (
            <p className="text-gray-500 text-sm">No boxes added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
