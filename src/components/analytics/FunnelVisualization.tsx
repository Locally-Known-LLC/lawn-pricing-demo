import { ChevronDown } from 'lucide-react';
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Structure</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">{insufficientDataMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Funnel Structure</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.label}>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{step.label}</p>
                {step.conversionFromPrevious !== null && (
                  <p className="text-xs text-gray-600 mt-1">
                    {step.conversionFromPrevious.toFixed(1)}% conversion
                  </p>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{step.count}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
