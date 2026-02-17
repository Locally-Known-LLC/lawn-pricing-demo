import { ArrowRight } from 'lucide-react';

interface Props {
  pendingQuotesCount: number;
  pendingQuoteValue: number;
  onViewQuotes: () => void;
}

export default function PendingRevenue({ pendingQuotesCount, pendingQuoteValue, onViewQuotes }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Revenue</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Pending Quotes</p>
          <p className="text-2xl font-bold text-gray-900">{pendingQuotesCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">${pendingQuoteValue.toFixed(2)}</p>
        </div>
      </div>
      <button
        onClick={onViewQuotes}
        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
      >
        View Quotes
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
