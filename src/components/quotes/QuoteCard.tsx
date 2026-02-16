import { getStateColor, getStateLabel, getStateBorderColor } from '../../utils/quoteState';
import { Quote } from './QuoteRow';

interface Props {
  quote: Quote;
  onClick: () => void;
}

export default function QuoteCard({ quote, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getStateBorderColor(quote.state)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStateColor(quote.state)}`}>
          {getStateLabel(quote.state)}
        </span>
        <div className="text-right">
          <span className="text-xl font-bold text-gray-900">${quote.finalAmount}</span>
          {quote.overrideAmount && (
            <div className="text-xs text-amber-600 font-medium">Adjusted</div>
          )}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">{quote.address}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{quote.plan}</span>
        <span>{quote.date}</span>
      </div>
    </div>
  );
}
