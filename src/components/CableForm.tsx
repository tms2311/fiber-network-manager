import { useState } from 'react';
import { X } from 'lucide-react';
import type { Point } from '../lib/database.types';

interface CableFormProps {
  points: Point[];
  onSubmit: (data: {
    name: string;
    color: string;
    start_point_id: string;
    end_point_id: string;
    fiber_count: number;
    route_points: Array<{ lat: number; lng: number }>;
  }) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Purple', value: '#800080' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
];

export function CableForm({ points, onSubmit, onCancel }: CableFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF0000');
  const [startPointId, setStartPointId] = useState('');
  const [endPointId, setEndPointId] = useState('');
  const [fiberCount, setFiberCount] = useState('12');
  const [routePoints, setRoutePoints] = useState<Array<{ lat: number; lng: number }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startPointId || !endPointId) {
      alert('Please select both start and end points');
      return;
    }
    onSubmit({
      name,
      color,
      start_point_id: startPointId,
      end_point_id: endPointId,
      fiber_count: parseInt(fiberCount),
      route_points: routePoints,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Fiber Cable</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cable Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Cable-001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setColor(preset.value)}
                className={`p-2 border-2 rounded-md flex items-center justify-center ${
                  color === preset.value ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <div
                  className="w-8 h-8 rounded"
                  style={{
                    backgroundColor: preset.value,
                    border: preset.value === '#FFFFFF' ? '1px solid #ccc' : 'none'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Point
          </label>
          <select
            value={startPointId}
            onChange={(e) => setStartPointId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select start point</option>
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name} ({point.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Point
          </label>
          <select
            value={endPointId}
            onChange={(e) => setEndPointId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select end point</option>
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name} ({point.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiber Count
          </label>
          <input
            type="number"
            value={fiberCount}
            onChange={(e) => setFiberCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Create Cable
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
