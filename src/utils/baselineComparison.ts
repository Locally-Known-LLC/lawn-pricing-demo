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
  metricExtractor: (metrics: FunnelMetrics) => number
): number | null {
  const ninetyDaysAgo = new Date(currentPeriodEnd);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const baselineEvents = allEvents.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= ninetyDaysAgo && eventDate <= currentPeriodEnd;
  });

  if (baselineEvents.length === 0) return null;

  const metrics = calculateFunnelMetrics(baselineEvents);
  return metricExtractor(metrics);
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
  metricType: 'depositConversion' | 'avgQuoteValue' | 'totalDeposits' | 'quotesCompleted'
): number | null {
  const metricExtractors = {
    depositConversion: (m: FunnelMetrics) => m.depositConversionRate,
    avgQuoteValue: (m: FunnelMetrics) => m.avgQuoteValue,
    totalDeposits: (m: FunnelMetrics) => m.totalDepositsCollected,
    quotesCompleted: (m: FunnelMetrics) => m.quotesCompleted,
  };

  return calculateRolling90DayAverage(allEvents, currentPeriodEnd, metricExtractors[metricType]);
}
