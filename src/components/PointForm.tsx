import { useState } from 'react';
import { X } from 'lucide-react';
import type { PointType } from '../lib/database.types';

interface PointFormProps {
  onSubmit: (data: {
    type: PointType;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
  }) => void;
  onCancel: () => void;
  initialLat?: number;
  initialLng?: number;
}

export function PointForm({ onSubmit, onCancel, initialLat, initialLng }: PointFormProps) {
  const [type, setType] = useState<PointType>('pole');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState(initialLat?.toString() || '');
  const [longitude, setLongitude] = useState(initialLng?.toString() || '');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Network Point</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Point Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PointType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="pole">Pole</option>
            <option value="fiber_box">Fiber Box</option>
            <option value="cto">CTO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Pole-001"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Create Point
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
