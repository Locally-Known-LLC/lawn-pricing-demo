interface Props {
  title: string;
  data: Array<{ date: string; value: number }>;
  hasMinimumData: boolean;
  insufficientDataMessage: string;
  valueFormatter?: (value: number) => string;
}

export default function TrendChart({ title, data, hasMinimumData, insufficientDataMessage, valueFormatter }: Props) {
  if (!hasMinimumData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">{insufficientDataMessage}</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const formatValue = valueFormatter || ((v: number) => v.toString());

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          data.slice(-14).map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-20 flex-shrink-0">
                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                <div
                  className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(point.value / maxValue) * 100}%`, minWidth: point.value > 0 ? '40px' : '0' }}
                >
                  {point.value > 0 && (
                    <span className="text-xs font-medium text-white">{formatValue(point.value)}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
