import { BaselineComparison } from '../../utils/baselineComparison';

interface Props {
  title: string;
  value: string | number;
  baseline?: BaselineComparison;
  description?: string;
  formatValue?: (value: number) => string;
}

export default function MetricCard({ title, value, baseline, description }: Props) {
  const getDeltaMicrocopy = (percentageDifference: number): string => {
    const absValue = Math.abs(percentageDifference);

    if (absValue < 5) {
      return 'In line with rolling average';
    }

    return percentageDifference > 0 ? 'Above rolling average' : 'Below rolling average';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>

      {baseline && baseline.enabled && baseline.percentageDifference !== null && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            {baseline.percentageDifference >= 0 ? '+' : ''}
            {baseline.percentageDifference.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            {getDeltaMicrocopy(baseline.percentageDifference)}
          </p>
        </div>
      )}

      {baseline && !baseline.enabled && (
        <p className="text-xs text-gray-400">{baseline.message}</p>
      )}

      {description && (
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      )}
    </div>
  );
}
