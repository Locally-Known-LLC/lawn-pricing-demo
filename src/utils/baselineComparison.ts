import { FunnelEvent, FunnelMetrics, calculateFunnelMetrics } from './analyticsAggregation';

export interface BaselineComparison {
  enabled: boolean;
  baselineValue: number | null;
  currentValue: number;
  difference: number | null;
  percentageDifference: number | null;
  message: string;
}

export function shouldEnableBaseline(events: FunnelEvent[]): boolean {
  if (events.length === 0) return false;

  const timestamps = events.map(e => new Date(e.timestamp).getTime());
  const oldestTimestamp = Math.min(...timestamps);
  const newestTimestamp = Math.max(...timestamps);

  const daysDifference = (newestTimestamp - oldestTimestamp) / (1000 * 60 * 60 * 24);

  return daysDifference >= 60;
}

export function calculateRolling90DayAverage(
  allEvents: FunnelEvent[],
  currentPeriodEnd: Date,
  currentPeriodDays: number,
  metricExtractor: (metrics: FunnelMetrics) => number,
  isRateMetric: boolean
): number | null {
  const ninetyDaysAgo = new Date(currentPeriodEnd);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const baselineEvents = allEvents.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= ninetyDaysAgo && eventDate <= currentPeriodEnd;
  });

  if (baselineEvents.length === 0) return null;

  const metrics = calculateFunnelMetrics(baselineEvents);
  const rawMetricValue = metricExtractor(metrics);

  // For rate metrics (percentages), return as-is
  if (isRateMetric) {
    return rawMetricValue;
  }

  // Normalize counts and values: (90-day total / 90) * current period days
  const perDayAverage = rawMetricValue / 90;
  return perDayAverage * currentPeriodDays;
}

export function compareToBaseline(
  currentValue: number,
  baselineValue: number | null,
  enabled: boolean
): BaselineComparison {
  if (!enabled || baselineValue === null) {
    return {
      enabled: false,
      baselineValue: null,
      currentValue,
      difference: null,
      percentageDifference: null,
      message: 'Baseline forming',
    };
  }

  const difference = currentValue - baselineValue;
  const percentageDifference = baselineValue > 0
    ? ((currentValue - baselineValue) / baselineValue) * 100
    : null;

  const message = difference >= 0
    ? `vs 90-day average: ${baselineValue.toFixed(1)}`
    : `Below your rolling average`;

  return {
    enabled: true,
    baselineValue,
    currentValue,
    difference,
    percentageDifference,
    message,
  };
}

export function getBaselineForMetric(
  allEvents: FunnelEvent[],
  currentPeriodEnd: Date,
  currentPeriodDays: number,
  metricType: 'depositConversion' | 'avgQuoteValue' | 'totalDeposits' | 'quotesCompleted'
): number | null {
  const metricExtractors = {
    depositConversion: (m: FunnelMetrics) => m.depositConversionRate,
    avgQuoteValue: (m: FunnelMetrics) => m.avgQuoteValue,
    totalDeposits: (m: FunnelMetrics) => m.totalDepositsCollected,
    quotesCompleted: (m: FunnelMetrics) => m.quotesCompleted,
  };

  // depositConversion is a rate metric (percentage), others need normalization
  const isRateMetric = metricType === 'depositConversion';

  return calculateRolling90DayAverage(
    allEvents,
    currentPeriodEnd,
    currentPeriodDays,
    metricExtractors[metricType],
    isRateMetric
  );
}
