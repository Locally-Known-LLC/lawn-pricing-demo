import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import MetricCard from './analytics/MetricCard';
import FunnelVisualization from './analytics/FunnelVisualization';
import TrendChart from './analytics/TrendChart';
import PendingRevenue from './analytics/PendingRevenue';
import TimeSelector, { TimeRange } from './analytics/TimeSelector';
import { FunnelEvent, calculateFunnelMetrics, calculateFunnelSteps, calculateDailyMetrics } from '../utils/analyticsAggregation';
import { shouldEnableBaseline, getBaselineForMetric, compareToBaseline } from '../utils/baselineComparison';
import { checkTrendChartDataGate, checkBaselineDataGate, checkFunnelVisualizationGate } from '../utils/dataGates';
import { supabase } from '../lib/supabase';

interface CampaignAnalyticsProps {
  onBack: () => void;
}

export default function CampaignAnalytics({ onBack }: CampaignAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [allEvents, setAllEvents] = useState<FunnelEvent[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('funnel_events')
      .select('*')
      .order('timestamp', { ascending: true })
      .then(({ data }) => {
        if (data) setAllEvents(data as FunnelEvent[]);
      });
  }, []);

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
  const baselineGate = checkBaselineDataGate(allEvents);
  const funnelGate = checkFunnelVisualizationGate(metrics.quotesCompleted);

  const quoteCompletionTrendData = dailyMetrics.map(d => ({ date: d.date, value: d.quotesCompleted }));
  const depositRevenueTrendData = dailyMetrics.map(d => ({ date: d.date, value: d.depositsCollected }));

  const handleViewQuotes = () => {
    console.log('Navigate to quotes');
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6 md:mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
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
        <TrendChart
          title="Quote Completion Trend"
          data={quoteCompletionTrendData}
          hasMinimumData={trendChartGate.hasMinimumData}
          insufficientDataMessage={trendChartGate.message}
        />
        <TrendChart
          title="Deposit Revenue Trend"
          data={depositRevenueTrendData}
          hasMinimumData={trendChartGate.hasMinimumData}
          insufficientDataMessage={trendChartGate.message}
          valueFormatter={(v) => `$${v.toFixed(0)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FunnelVisualization
          steps={funnelSteps}
          hasMinimumData={funnelGate.hasMinimumData}
          insufficientDataMessage={funnelGate.message}
        />
        <PendingRevenue
          pendingQuotesCount={metrics.pendingQuotesCount}
          pendingQuoteValue={metrics.pendingQuoteValue}
          onViewQuotes={handleViewQuotes}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
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
