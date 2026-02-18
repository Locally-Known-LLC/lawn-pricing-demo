import { FunnelStep } from '../../utils/analyticsAggregation';

interface Props {
  steps: FunnelStep[];
  hasMinimumData: boolean;
  insufficientDataMessage: string;
}

export default function FunnelVisualization({ steps, hasMinimumData, insufficientDataMessage }: Props) {
  if (!hasMinimumData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Funnel Structure</h3>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">{insufficientDataMessage}</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...steps.map(s => s.count), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">Funnel Structure</h3>
      <div className="space-y-1">
        {steps.map((step, index) => {
          const widthPct = (step.count / maxCount) * 100;
          return (
            <div key={step.label}>
              <div className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <p className="text-xs font-medium text-gray-700 leading-tight">{step.label}</p>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-7 bg-gray-50 rounded overflow-hidden border border-gray-100">
                    <div
                      className="h-full bg-gray-800 rounded transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right tabular-nums">
                    {step.count}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center gap-3 my-1">
                  <div className="w-36 flex-shrink-0" />
                  <div className="flex-1 flex items-center gap-2 pl-0">
                    <div className="w-px h-4 bg-gray-200 ml-1" />
                    {step.conversionFromPrevious !== null && (
                      <span className="text-xs text-gray-400 ml-1">
                        {step.conversionFromPrevious.toFixed(1)}% passed through
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
