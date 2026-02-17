export type TimeRange = '7d' | '30d' | '90d' | 'all';

interface Props {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export default function TimeSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Time Period:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );
}
