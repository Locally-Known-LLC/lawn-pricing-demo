import { BaselineComparison } from '../../utils/baselineComparison';

interface Props {
  title: string;
  value: string | number;
  baseline?: BaselineComparison;
  formatValue?: (value: number) => string;
}

export default function MetricCard({ title, value, baseline }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>
      {baseline && baseline.enabled && baseline.baselineValue !== null && (
        <p className="text-xs text-gray-600">{baseline.message}</p>
      )}
      {baseline && !baseline.enabled && (
        <p className="text-xs text-gray-400">{baseline.message}</p>
      )}
    </div>
  );
}
