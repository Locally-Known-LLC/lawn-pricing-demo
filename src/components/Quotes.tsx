import { Plus, Search, Filter, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Quote {
  id: string;
  address: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  amount: number;
  status: 'pending' | 'accepted' | 'paid' | 'declined';
  date: string;
  lawnsqft: number;
  plan: string;
}

type QuickQuoteStep = 1 | 2 | 3 | 4 | 5;

export default function Quotes() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const [quickQuoteStep, setQuickQuoteStep] = useState<QuickQuoteStep>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const quotes: Quote[] = [
    { id: '1', address: '123 Maple St', customer: 'John Smith', email: 'john@email.com', phone: '555-0101', service: 'Weekly Mowing', amount: 55, status: 'paid', date: '2024-02-14', lawnsqft: 5200, plan: 'Standard' },
    { id: '2', address: '456 Oak Ave', customer: 'Sarah Johnson', email: 'sarah@email.com', phone: '555-0102', service: 'Bi-weekly Mowing', amount: 75, status: 'accepted', date: '2024-02-13', lawnsqft: 8100, plan: 'Premium' },
    { id: '3', address: '789 Pine Rd', customer: 'Mike Davis', email: 'mike@email.com', phone: '555-0103', service: 'Monthly Service', amount: 120, status: 'pending', date: '2024-02-13', lawnsqft: 12000, plan: 'Premium Plus' },
    { id: '4', address: '321 Elm St', customer: 'Emily Brown', email: 'emily@email.com', phone: '555-0104', service: 'Weekly Mowing', amount: 45, status: 'paid', date: '2024-02-12', lawnsqft: 4200, plan: 'Basic' },
    { id: '5', address: '654 Birch Ln', customer: 'Tom Wilson', email: 'tom@email.com', phone: '555-0105', service: 'Bi-weekly Mowing', amount: 85, status: 'declined', date: '2024-02-12', lawnsqft: 9500, plan: 'Premium' },
    { id: '6', address: '987 Cedar Dr', customer: 'Lisa Garcia', email: 'lisa@email.com', phone: '555-0106', service: 'Weekly Mowing', amount: 60, status: 'pending', date: '2024-02-11', lawnsqft: 6200, plan: 'Standard' },
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesSearch = quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderQuickQuoteStep = () => {
    switch (quickQuoteStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Property Address</h3>
              <p className="text-sm text-gray-600 mb-4">Enter the property address to measure lawn size</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                placeholder="123 Main St"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  placeholder="Springfield"
                  className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  placeholder="IL"
                  className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">We'll automatically measure the lawn area using satellite imagery</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Select Plan</h3>
              <p className="text-sm text-gray-600 mb-4">Choose a service plan for this property</p>
            </div>
            <div className="space-y-3">
              {['Basic', 'Standard', 'Premium'].map((plan) => (
                <label key={plan} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                  <input type="radio" name="plan" className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{plan}</p>
                    <p className="text-sm text-gray-500">Weekly service</p>
                  </div>
                  <p className="font-bold text-gray-900">${plan === 'Basic' ? 45 : plan === 'Standard' ? 55 : 75}</p>
                </label>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Measured lawn size:</strong> 5,200 sq ft
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Add-ons</h3>
              <p className="text-sm text-gray-600 mb-4">Select optional services</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Edge Trimming', price: 15 },
                { name: 'Leaf Removal', price: 25 },
                { name: 'Fertilization', price: 40 },
              ].map((addon) => (
                <label key={addon.name} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{addon.name}</p>
                  </div>
                  <p className="font-medium text-gray-600">+${addon.price}</p>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Quote Summary</h3>
              <p className="text-sm text-gray-600 mb-4">Review and confirm the details</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Property</span>
                <span className="font-medium text-gray-900">123 Main St</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">Standard - Weekly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium text-gray-900">$55</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">$55</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Customer Details</h3>
              <p className="text-sm text-gray-600 mb-4">Enter customer information to send the quote</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Smith"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="john@email.com"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">Customer will receive an email with their personalized quote and payment link</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Quotes</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all customer quotes</p>
        </div>
        <button
          onClick={() => {
            setShowQuickQuote(true);
            setQuickQuoteStep(1);
          }}
          className="w-full sm:w-auto px-4 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-5 h-5" />
          Create Quote
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="paid">Paid</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

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
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedQuote(quote)}
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
                    <div className="text-sm font-medium text-gray-900">${quote.amount}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quote.status === 'paid' ? 'bg-green-100 text-green-800' :
                      quote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.date}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{quote.customer}</p>
                  <p className="text-sm text-gray-600">{quote.address}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  quote.status === 'paid' ? 'bg-green-100 text-green-800' :
                  quote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  quote.status === 'declined' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{quote.service}</span>
                <span className="font-semibold text-gray-900">${quote.amount}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{quote.date}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedQuote && (
        <>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={() => setSelectedQuote(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Quote Details</h3>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 -m-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.customer}</p>
                  <p className="text-sm text-gray-600">{selectedQuote.email}</p>
                  <p className="text-sm text-gray-600">{selectedQuote.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Property Address</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Lawn Size</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.lawnsqft.toLocaleString()} sq ft</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Service Plan</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.plan}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Service Type</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.service}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Quote Amount</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">${selectedQuote.amount}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedQuote.status === 'paid' ? 'bg-green-100 text-green-800' :
                    selectedQuote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    selectedQuote.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Created</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.date}</p>
                </div>

                <div className="pt-4 md:pt-6 border-t border-gray-200 space-y-3">
                  <button className="w-full px-4 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base">
                    Send Reminder
                  </button>
                  <button className="w-full px-4 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base">
                    View Customer Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showQuickQuote && (
        <>
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={() => setShowQuickQuote(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">Quick Quote</h3>
                  <button
                    onClick={() => setShowQuickQuote(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 -m-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-2 rounded-full ${
                        step <= quickQuoteStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-6">
                {renderQuickQuoteStep()}
              </div>

              <div className="p-4 md:p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => quickQuoteStep > 1 && setQuickQuoteStep((quickQuoteStep - 1) as QuickQuoteStep)}
                  disabled={quickQuoteStep === 1}
                  className="px-4 md:px-6 py-2.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 text-sm md:text-base"
                >
                  Back
                </button>
                {quickQuoteStep < 5 ? (
                  <button
                    onClick={() => setQuickQuoteStep((quickQuoteStep + 1) as QuickQuoteStep)}
                    className="px-4 md:px-6 py-2.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowQuickQuote(false);
                      setQuickQuoteStep(1);
                    }}
                    className="px-4 md:px-6 py-2.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
                  >
                    Send Quote
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
