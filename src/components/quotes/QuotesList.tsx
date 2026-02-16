import { Plus, Search } from 'lucide-react';
import { Quote } from './QuoteRow';
import QuoteRow from './QuoteRow';
import QuoteCard from './QuoteCard';

interface Props {
  quotes: Quote[];
  onQuoteSelect: (quote: Quote) => void;
  onCreateQuote: () => void;
}

export default function QuotesList({ quotes, onQuoteSelect, onCreateQuote }: Props) {
  if (quotes.length === 0) {
    return (
      <>
        <div className="hidden md:block overflow-x-auto">
          <div className="p-16 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first pricing flow to start generating instant quotes.</p>
            <button
              onClick={onCreateQuote}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Service
            </button>
          </div>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          <div className="p-12 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
            <p className="text-sm text-gray-600 mb-6">Create your first pricing flow to start generating instant quotes.</p>
            <button
              onClick={onCreateQuote}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Service
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((quote) => (
              <QuoteRow
                key={quote.id}
                quote={quote}
                onClick={() => onQuoteSelect(quote)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onClick={() => onQuoteSelect(quote)}
          />
        ))}
      </div>
    </>
  );
}
