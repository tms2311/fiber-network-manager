import { Plus, MapPin, Cable as CableIcon, Box, List } from 'lucide-react';

interface SidebarProps {
  activeView: 'list' | 'add-point' | 'add-cable' | 'add-box';
  onViewChange: (view: 'list' | 'add-point' | 'add-cable' | 'add-box') => void;
  pointCount: number;
  cableCount: number;
  boxCount: number;
}

export function Sidebar({
  activeView,
  onViewChange,
  pointCount,
  cableCount,
  boxCount,
}: SidebarProps) {
  return (
    <div className="w-80 bg-white shadow-lg p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Fiber Network Manager
        </h1>
        <p className="text-sm text-gray-600">
          Document and manage your fiber optic infrastructure
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{pointCount}</div>
          <div className="text-xs text-gray-600">Points</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{cableCount}</div>
          <div className="text-xs text-gray-600">Cables</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{boxCount}</div>
          <div className="text-xs text-gray-600">Boxes</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            activeView === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <List size={20} />
          <span>View All</span>
        </button>

        <button
          onClick={() => onViewChange('add-point')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            activeView === 'add-point'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin size={20} />
          <span>Add Point</span>
        </button>

        <button
          onClick={() => onViewChange('add-cable')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            activeView === 'add-cable'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CableIcon size={20} />
          <span>Add Cable</span>
        </button>

        <button
          onClick={() => onViewChange('add-box')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
            activeView === 'add-box'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Box size={20} />
          <span>Add Box</span>
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Click on map to add points
        </p>
      </div>
    </div>
  );
}
