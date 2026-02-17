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

  const showDelta = baseline?.enabled && baseline.percentageDifference !== null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 flex flex-col">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{value}</p>

      {showDelta && (
        <div className="mb-2 space-y-0.5">
          <p className="text-sm font-medium text-gray-700">
            {baseline!.percentageDifference! >= 0 ? '+' : ''}
            {baseline!.percentageDifference!.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            {getDeltaMicrocopy(baseline!.percentageDifference!)}
          </p>
        </div>
      )}

      {description && (
        <p className="text-xs text-gray-400 mt-auto pt-2">{description}</p>
      )}
    </div>
  );
}
