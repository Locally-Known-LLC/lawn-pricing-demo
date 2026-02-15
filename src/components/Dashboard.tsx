import { DollarSign, FileText, TrendingUp, Percent, X, Plus, Eye, Settings } from 'lucide-react';
import { useState } from 'react';

interface Quote {
  id: string;
  address: string;
  customer: string;
  service: string;
  amount: number;
  status: 'pending' | 'accepted' | 'paid';
  date: string;
  lawnsqft: number;
  plan: string;
}

type TimeRange = '7d' | '30d' | '90d';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const hasServices = true;
  const hasQuotes = true;

  const kpis = [
    { label: 'Quotes Generated (30d)', value: '1,247', change: '+12.5%', icon: FileText, color: 'blue' },
    { label: 'Deposit Conversion', value: '24.3%', change: '+3.1%', icon: Percent, color: 'green' },
    { label: 'Avg Quote Value', value: '$76', change: '+8.2%', icon: DollarSign, color: 'blue' },
    { label: 'Deposits via LawnPricing', value: '$34,280', change: '+18.2%', icon: DollarSign, color: 'green' },
  ];

  const recentQuotes: Quote[] = [
    { id: '1', address: '123 Maple St', customer: 'John Smith', service: 'Weekly Mowing', amount: 55, status: 'paid', date: '2024-02-14', lawnsqft: 5200, plan: 'Standard' },
    { id: '2', address: '456 Oak Ave', customer: 'Sarah Johnson', service: 'Bi-weekly Mowing', amount: 75, status: 'accepted', date: '2024-02-13', lawnsqft: 8100, plan: 'Premium' },
    { id: '3', address: '789 Pine Rd', customer: 'Mike Davis', service: 'Monthly Service', amount: 120, status: 'pending', date: '2024-02-13', lawnsqft: 12000, plan: 'Premium Plus' },
    { id: '4', address: '321 Elm St', customer: 'Emily Brown', service: 'Weekly Mowing', amount: 45, status: 'paid', date: '2024-02-12', lawnsqft: 4200, plan: 'Basic' },
    { id: '5', address: '654 Birch Ln', customer: 'Tom Wilson', service: 'Bi-weekly Mowing', amount: 85, status: 'accepted', date: '2024-02-12', lawnsqft: 9500, plan: 'Premium' },
  ];

  const chartData = {
    '7d': [
      { label: 'Mon', value: 42 },
      { label: 'Tue', value: 38 },
      { label: 'Wed', value: 51 },
      { label: 'Thu', value: 45 },
      { label: 'Fri', value: 58 },
      { label: 'Sat', value: 32 },
      { label: 'Sun', value: 28 },
    ],
    '30d': [
      { label: 'Week 1', value: 180 },
      { label: 'Week 2', value: 220 },
      { label: 'Week 3', value: 195 },
      { label: 'Week 4', value: 240 },
    ],
    '90d': [
      { label: 'Jan', value: 180 },
      { label: 'Feb', value: 220 },
      { label: 'Mar', value: 195 },
    ],
  };

  const currentChartData = chartData[timeRange];
  const maxValue = Math.max(...currentChartData.map(d => d.value));

  const totalQuotes = 1247;
  const depositsPaid = 303;
  const conversionRate = ((depositsPaid / totalQuotes) * 100).toFixed(1);

  if (!hasServices || !hasQuotes) {
    return (
      <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Overview of your pricing engine performance</p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Let's generate your first quote.</h2>
            <p className="text-gray-600 mb-6">Set up your service pricing and publish your instant quote widget.</p>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate?.('pricing')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Configure Services
              </button>
              <button
                onClick={() => onNavigate?.('quotes')}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Manual Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Overview of your pricing engine performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  kpi.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${
                    kpi.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <span className="text-xs md:text-sm font-medium text-green-600">{kpi.change}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">{kpi.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate?.('quotes')}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Quote
          </button>
          <button
            onClick={() => onNavigate?.('quotes')}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Pending Quotes
          </button>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quote Funnel (30d)</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Quotes Created</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuotes.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Deposits Paid</p>
              <p className="text-2xl font-bold text-green-600">{depositsPaid.toLocaleString()}</p>
            </div>
          </div>
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-semibold text-gray-900">{conversionRate}% Conversion Rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Quotes Over Time</h2>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-colors ${
                    timeRange === range
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range === '7d' ? '7d' : range === '30d' ? '30d' : '90d'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {currentChartData.map((data) => (
              <div key={data.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.label}</span>
                  <span className="text-sm text-gray-900 font-semibold">{data.value}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-900">Avg Quote Value</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">$76</p>
            </div>
            <div className="flex items-center justify-between p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-900">Deposits via LawnPricing</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-green-700">$8,920</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Quotes</h2>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quote.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{quote.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{quote.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${quote.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quote.status === 'paid' ? 'bg-green-100 text-green-800' :
                      quote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          {recentQuotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className={`relative p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-l-4 ${
                quote.status === 'paid' ? 'border-green-500' :
                quote.status === 'accepted' ? 'border-blue-500' :
                quote.status === 'pending' ? 'border-gray-300' :
                'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  quote.status === 'paid' ? 'bg-green-100 text-green-800' :
                  quote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
                <span className="text-lg font-bold text-gray-900">${quote.amount}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{quote.address}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{quote.plan}</span>
                <span>{quote.date}</span>
              </div>
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

          {/* Desktop: Right slideout */}
          <div className="hidden md:block fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 -m-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.customer}</p>
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
                  <p className="text-2xl font-bold text-gray-900">${selectedQuote.amount}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedQuote.status === 'paid' ? 'bg-green-100 text-green-800' :
                    selectedQuote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Created</p>
                  <p className="text-base font-medium text-gray-900">{selectedQuote.date}</p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Send Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Bottom sheet */}
          <div className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 -m-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-5">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer</p>
                <p className="text-base font-medium text-gray-900">{selectedQuote.customer}</p>
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
                <p className="text-2xl font-bold text-gray-900">${selectedQuote.amount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedQuote.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedQuote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Date Created</p>
                <p className="text-base font-medium text-gray-900">{selectedQuote.date}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-medium">
                Send Follow-up
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
