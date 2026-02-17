export type TimeRange = '7d' | '30d' | '90d' | 'all';
export type CompareMode = 'off' | 'rolling_avg';

interface Props {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  compareMode: CompareMode;
  onCompareModeChange: (mode: CompareMode) => void;
}

export default function TimeSelector({ value, onChange, compareMode, onCompareModeChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Time Range:</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TimeRange)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Compare:</label>
        <select
          value={compareMode}
          onChange={(e) => onCompareModeChange(e.target.value as CompareMode)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
        >
          <option value="off">Off</option>
          <option value="rolling_avg">Rolling Avg</option>
        </select>
      </div>
    </div>
  );
}
