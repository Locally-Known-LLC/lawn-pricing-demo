import { ChevronRight } from 'lucide-react';
import { QuoteState, getStateColor, getStateLabel } from '../../utils/quoteState';

export interface Quote {
  id: string;
  address: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  calculatedAmount: number;
  overrideAmount?: number;
  overrideReason?: string;
  finalAmount: number;
  state: QuoteState;
  date: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  depositPaidAt?: string;
  expiredAt?: string;
  cancelledAt?: string;
  expiresOn?: string;
  lawnsqft: number;
  plan: string;
  depositRequired: boolean;
  depositAmount?: number;
}

interface Props {
  quote: Quote;
  onClick: () => void;
}

export default function QuoteRow({ quote, onClick }: Props) {
  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{quote.customer}</div>
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{quote.address}</div>
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{quote.service}</div>
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${quote.finalAmount}</div>
        {quote.overrideAmount && (
          <div className="text-xs text-amber-600">Adjusted</div>
        )}
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(quote.state)}`}>
          {getStateLabel(quote.state)}
        </span>
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {quote.date}
      </td>
      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </td>
    </tr>
  );
}
