import { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import type { Point, Box, Attachment } from '../lib/database.types';

interface BoxFormProps {
  points: Point[];
  selectedBox: Box | null;
  attachments: Attachment[];
  onSubmit: (data: {
    point_id: string;
    capacity: number;
    status: string;
    notes: string;
  }) => void;
  onUpdate: (boxId: string, data: Partial<Box>) => void;
  onUploadPhoto: (boxId: string, file: File) => void;
  onDeletePhoto: (attachmentId: string) => void;
  onCancel: () => void;
}

export function BoxForm({
  points,
  selectedBox,
  attachments,
  onSubmit,
  onUpdate,
  onUploadPhoto,
  onDeletePhoto,
  onCancel,
}: BoxFormProps) {
  const [pointId, setPointId] = useState(selectedBox?.point_id || '');
  const [capacity, setCapacity] = useState(selectedBox?.capacity.toString() || '24');
  const [status, setStatus] = useState(selectedBox?.status || 'active');
  const [notes, setNotes] = useState(selectedBox?.notes || '');

  const fiberBoxPoints = points.filter(p => p.type === 'fiber_box');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBox) {
      onUpdate(selectedBox.id, {
        point_id: pointId,
        capacity: parseInt(capacity),
        status,
        notes,
      });
    } else {
      onSubmit({
        point_id: pointId,
        capacity: parseInt(capacity),
        status,
        notes,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedBox) {
      onUploadPhoto(selectedBox.id, file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {selectedBox ? 'Edit Box Details' : 'Add Box Details'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiber Box Point
          </label>
          <select
            value={pointId}
            onChange={(e) => setPointId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select fiber box point</option>
            {fiberBoxPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity (fibers)
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Additional notes"
          />
        </div>

        {selectedBox && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <div className="space-y-2">
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="relative group">
                      <img
                        src={attachment.file_path}
                        alt={attachment.file_name}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => onDeletePhoto(attachment.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition">
                <Upload size={20} />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {selectedBox ? 'Update Box' : 'Create Box'}
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
