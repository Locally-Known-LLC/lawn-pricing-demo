import { ExternalLink, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import MetricCard from './analytics/MetricCard';
import TimeSelector, { TimeRange } from './analytics/TimeSelector';
import { FunnelEvent, calculateFunnelMetrics, calculateFunnelSteps, calculateDailyMetrics } from '../utils/analyticsAggregation';
import { shouldEnableBaseline, getBaselineForMetric, compareToBaseline } from '../utils/baselineComparison';
import { checkTrendChartDataGate, checkFunnelVisualizationGate } from '../utils/dataGates';

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

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showRecentQuotes, setShowRecentQuotes] = useState(false);

  const [allEvents] = useState<FunnelEvent[]>(() => {
    const events: FunnelEvent[] = [];
    const now = new Date();

    for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      const baseQuotes = 8 + Math.floor(Math.random() * 5);

      for (let i = 0; i < baseQuotes; i++) {
        const quoteId = `quote-${daysAgo}-${i}`;
        const quoteValue = 45 + Math.floor(Math.random() * 80);

        const startTime = new Date(date);
        startTime.setHours(8 + Math.floor(Math.random() * 10));

        events.push({
          quote_id: quoteId,
          event_type: 'quote_started',
          timestamp: startTime.toISOString(),
          metadata: {}
        });

        if (Math.random() > 0.15) {
          const completeTime = new Date(startTime);
          completeTime.setMinutes(completeTime.getMinutes() + 2 + Math.floor(Math.random() * 3));

          events.push({
            quote_id: quoteId,
            event_type: 'quote_completed',
            timestamp: completeTime.toISOString(),
            metadata: { quote_value: quoteValue }
          });

          if (Math.random() > 0.20) {
            const revealTime = new Date(completeTime);
            revealTime.setMinutes(revealTime.getMinutes() + 1);

            events.push({
              quote_id: quoteId,
              event_type: 'pricing_revealed',
              timestamp: revealTime.toISOString(),
              metadata: { quote_value: quoteValue }
            });

            if (Math.random() > 0.35) {
              const depositViewTime = new Date(revealTime);
              depositViewTime.setMinutes(depositViewTime.getMinutes() + 1 + Math.floor(Math.random() * 2));

              events.push({
                quote_id: quoteId,
                event_type: 'deposit_page_viewed',
                timestamp: depositViewTime.toISOString(),
                metadata: { quote_value: quoteValue }
              });

              if (Math.random() > 0.40) {
                const depositPaidTime = new Date(depositViewTime);
                depositPaidTime.setMinutes(depositPaidTime.getMinutes() + 2 + Math.floor(Math.random() * 5));

                events.push({
                  quote_id: quoteId,
                  event_type: 'deposit_paid',
                  timestamp: depositPaidTime.toISOString(),
                  metadata: { quote_value: quoteValue, deposit_amount: quoteValue * 0.25 }
                });
              }
            }
          }
        }
      }

      const pendingQuotes = Math.floor(Math.random() * 3);
      for (let j = 0; j < pendingQuotes; j++) {
        const quoteId = `pending-${daysAgo}-${j}`;
        const quoteValue = 50 + Math.floor(Math.random() * 70);

        const startTime = new Date(date);
        startTime.setHours(9 + Math.floor(Math.random() * 8));

        events.push({
          quote_id: quoteId,
          event_type: 'quote_started',
          timestamp: startTime.toISOString(),
          metadata: {}
        });

        const completeTime = new Date(startTime);
        completeTime.setMinutes(completeTime.getMinutes() + 2 + Math.floor(Math.random() * 3));

        events.push({
          quote_id: quoteId,
          event_type: 'quote_completed',
          timestamp: completeTime.toISOString(),
          metadata: { quote_value: quoteValue }
        });
      }
    }

    return events;
  });

  const filteredEvents = filterEventsByTimeRange(allEvents, timeRange);
  const metrics = calculateFunnelMetrics(filteredEvents);
  const funnelSteps = calculateFunnelSteps(metrics);
  const dailyMetrics = calculateDailyMetrics(filteredEvents);

  const baselineEnabled = shouldEnableBaseline(allEvents);
  const currentPeriodEnd = new Date();

  const quotesCompletedBaseline = getBaselineForMetric(allEvents, currentPeriodEnd, 'quotesCompleted');
  const depositConversionBaseline = getBaselineForMetric(allEvents, currentPeriodEnd, 'depositConversion');
  const avgQuoteValueBaseline = getBaselineForMetric(allEvents, currentPeriodEnd, 'avgQuoteValue');
  const totalDepositsBaseline = getBaselineForMetric(allEvents, currentPeriodEnd, 'totalDeposits');

  const quotesCompletedComparison = compareToBaseline(metrics.quotesCompleted, quotesCompletedBaseline, baselineEnabled);
  const depositConversionComparison = compareToBaseline(metrics.depositConversionRate, depositConversionBaseline, baselineEnabled);
  const avgQuoteValueComparison = compareToBaseline(metrics.avgQuoteValue, avgQuoteValueBaseline, baselineEnabled);
  const totalDepositsComparison = compareToBaseline(metrics.totalDepositsCollected, totalDepositsBaseline, baselineEnabled);

  const trendChartGate = checkTrendChartDataGate(filteredEvents);
  const funnelGate = checkFunnelVisualizationGate(metrics.quotesCompleted);

  const quoteCompletionTrendData = dailyMetrics.map(d => ({ date: d.date, value: d.quotesCompleted }));
  const depositRevenueTrendData = dailyMetrics.map(d => ({ date: d.date, value: d.depositsCollected }));

  const recentQuotes: Quote[] = [
    { id: '1', address: '123 Maple St', customer: 'John Smith', service: 'Weekly Mowing', amount: 55, status: 'paid', date: '2024-02-14', lawnsqft: 5200, plan: 'Standard' },
    { id: '2', address: '456 Oak Ave', customer: 'Sarah Johnson', service: 'Bi-weekly Mowing', amount: 75, status: 'accepted', date: '2024-02-13', lawnsqft: 8100, plan: 'Premium' },
    { id: '3', address: '789 Pine Rd', customer: 'Mike Davis', service: 'Monthly Service', amount: 120, status: 'pending', date: '2024-02-13', lawnsqft: 12000, plan: 'Premium Plus' },
    { id: '4', address: '321 Elm St', customer: 'Emily Brown', service: 'Weekly Mowing', amount: 45, status: 'paid', date: '2024-02-12', lawnsqft: 4200, plan: 'Basic' },
    { id: '5', address: '654 Birch Ln', customer: 'Tom Wilson', service: 'Bi-weekly Mowing', amount: 85, status: 'accepted', date: '2024-02-12', lawnsqft: 9500, plan: 'Premium' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Performance instrumentation and reporting</p>
          </div>
          <TimeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Quotes Completed"
          value={metrics.quotesCompleted}
          baseline={quotesCompletedComparison}
        />
        <MetricCard
          title="Deposit Conversion"
          value={`${metrics.depositConversionRate.toFixed(1)}%`}
          baseline={depositConversionComparison}
        />
        <MetricCard
          title="Avg Quote Value"
          value={`$${metrics.avgQuoteValue.toFixed(2)}`}
          baseline={avgQuoteValueComparison}
        />
        <MetricCard
          title="Total Deposits Collected"
          value={`$${metrics.totalDepositsCollected.toFixed(2)}`}
          baseline={totalDepositsComparison}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <TrendChartComponent
          title="Quote Completion Trend"
          data={quoteCompletionTrendData}
          hasMinimumData={trendChartGate.hasMinimumData}
          insufficientDataMessage={trendChartGate.message}
        />
        <TrendChartComponent
          title="Deposit Revenue Trend"
          data={depositRevenueTrendData}
          hasMinimumData={trendChartGate.hasMinimumData}
          insufficientDataMessage={trendChartGate.message}
          valueFormatter={(v) => `$${v.toFixed(0)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FunnelVisualizationComponent
          steps={funnelSteps}
          hasMinimumData={funnelGate.hasMinimumData}
          insufficientDataMessage={funnelGate.message}
        />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Revenue</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pendingQuotesCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.pendingQuoteValue.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('quotes')}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View Quotes →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Understanding Your Metrics</h3>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            What affects deposit conversion?
            <ExternalLink className="w-4 h-4" />
          </a>
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

      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <button
          onClick={() => setShowRecentQuotes(!showRecentQuotes)}
          className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Quotes</h2>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showRecentQuotes ? 'rotate-180' : ''}`} />
        </button>
        {showRecentQuotes && (
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {recentQuotes.slice(0, 5).map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
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
        )}
      </div>
    </div>
  );
}

function TrendChartComponent({ title, data, hasMinimumData, insufficientDataMessage, valueFormatter }: {
  title: string;
  data: Array<{ date: string; value: number }>;
  hasMinimumData: boolean;
  insufficientDataMessage: string;
  valueFormatter?: (value: number) => string;
}) {
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

function FunnelVisualizationComponent({ steps, hasMinimumData, insufficientDataMessage }: {
  steps: Array<{ label: string; count: number; conversionFromPrevious: number | null }>;
  hasMinimumData: boolean;
  insufficientDataMessage: string;
}) {
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

function filterEventsByTimeRange(events: FunnelEvent[], range: TimeRange): FunnelEvent[] {
  if (range === 'all') return events;

  const now = new Date();
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
  const days = daysMap[range] || 30;

  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return events.filter(e => new Date(e.timestamp) >= cutoffDate);
}
