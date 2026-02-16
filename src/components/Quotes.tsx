import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Quote } from './quotes/QuoteRow';
import QuoteFiltersBar from './quotes/QuoteFiltersBar';
import QuotesList from './quotes/QuotesList';
import QuoteDetailPanel from './quotes/QuoteDetailPanel';
import ManualQuoteFlowModal from './quotes/ManualQuoteFlowModal';

type QuickQuoteStep = 1 | 2 | 3 | 4 | 5;

export default function Quotes() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const [quickQuoteStep, setQuickQuoteStep] = useState<QuickQuoteStep>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPriceOverride, setShowPriceOverride] = useState(false);
  const [overridePrice, setOverridePrice] = useState('55');
  const [overrideReason, setOverrideReason] = useState('');
  const [calculatedPrice] = useState(55);

  const quotes: Quote[] = [
    { id: '1', address: '123 Maple St', customer: 'John Smith', email: 'john@email.com', phone: '555-0101', service: 'Weekly Mowing', calculatedAmount: 55, finalAmount: 55, state: 'deposit_paid', date: '2024-02-14', sentAt: '2024-02-14', viewedAt: '2024-02-14', acceptedAt: '2024-02-14', depositPaidAt: '2024-02-14', lawnsqft: 5200, plan: 'Standard', depositRequired: true, depositAmount: 20 },
    { id: '2', address: '456 Oak Ave', customer: 'Sarah Johnson', email: 'sarah@email.com', phone: '555-0102', service: 'Bi-weekly Mowing', calculatedAmount: 75, finalAmount: 75, state: 'accepted', date: '2024-02-13', sentAt: '2024-02-13', viewedAt: '2024-02-13', acceptedAt: '2024-02-13', lawnsqft: 8100, plan: 'Premium', depositRequired: false },
    { id: '3', address: '789 Pine Rd', customer: 'Mike Davis', email: 'mike@email.com', phone: '555-0103', service: 'Monthly Service', calculatedAmount: 115, overrideAmount: 120, overrideReason: 'Additional travel distance', finalAmount: 120, state: 'viewed', date: '2024-02-13', sentAt: '2024-02-13', viewedAt: '2024-02-13', expiresOn: '2024-02-20', lawnsqft: 12000, plan: 'Premium Plus', depositRequired: true, depositAmount: 50 },
    { id: '4', address: '321 Elm St', customer: 'Emily Brown', email: 'emily@email.com', phone: '555-0104', service: 'Weekly Mowing', calculatedAmount: 45, finalAmount: 45, state: 'deposit_paid', date: '2024-02-12', sentAt: '2024-02-12', viewedAt: '2024-02-12', acceptedAt: '2024-02-12', depositPaidAt: '2024-02-12', lawnsqft: 4200, plan: 'Basic', depositRequired: true, depositAmount: 20 },
    { id: '5', address: '654 Birch Ln', customer: 'Tom Wilson', email: 'tom@email.com', phone: '555-0105', service: 'Bi-weekly Mowing', calculatedAmount: 85, finalAmount: 85, state: 'cancelled', date: '2024-02-12', sentAt: '2024-02-12', cancelledAt: '2024-02-13', lawnsqft: 9500, plan: 'Premium', depositRequired: false },
    { id: '6', address: '987 Cedar Dr', customer: 'Lisa Garcia', email: 'lisa@email.com', phone: '555-0106', service: 'Weekly Mowing', calculatedAmount: 60, finalAmount: 60, state: 'sent', date: '2024-02-11', sentAt: '2024-02-11', expiresOn: '2024-02-18', lawnsqft: 6200, plan: 'Standard', depositRequired: false },
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = statusFilter === 'all' || quote.state === statusFilter;
    const matchesSearch = quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateQuote = () => {
    setShowQuickQuote(true);
    setQuickQuoteStep(1);
    setShowPriceOverride(false);
    setOverridePrice('55');
    setOverrideReason('');
  };

  const handleSendQuote = () => {
    setShowQuickQuote(false);
    setQuickQuoteStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Quotes</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all customer quotes</p>
        </div>
        <button
          onClick={handleCreateQuote}
          className="w-full sm:w-auto px-4 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-5 h-5" />
          Create Quote
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <QuoteFiltersBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          showFilters={showFilters}
          onShowFiltersChange={setShowFilters}
        />

        <QuotesList
          quotes={filteredQuotes}
          onQuoteSelect={setSelectedQuote}
          onCreateQuote={handleCreateQuote}
        />
      </div>

      <QuoteDetailPanel
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />

      <ManualQuoteFlowModal
        show={showQuickQuote}
        step={quickQuoteStep}
        calculatedPrice={calculatedPrice}
        showPriceOverride={showPriceOverride}
        overridePrice={overridePrice}
        overrideReason={overrideReason}
        onClose={() => setShowQuickQuote(false)}
        onStepChange={setQuickQuoteStep}
        onShowPriceOverrideChange={setShowPriceOverride}
        onOverridePriceChange={setOverridePrice}
        onOverrideReasonChange={setOverrideReason}
        onSend={handleSendQuote}
      />
    </div>
  );
}
