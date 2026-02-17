import { FunnelEvent } from './analyticsAggregation';

export interface DataGateResult {
  hasMinimumData: boolean;
  message: string;
}

export function checkTrendChartDataGate(events: FunnelEvent[]): DataGateResult {
  if (events.length === 0) {
    return {
      hasMinimumData: false,
      message: 'Insufficient data',
    };
  }

  const timestamps = events.map(e => new Date(e.timestamp).getTime());
  const oldestTimestamp = Math.min(...timestamps);
  const newestTimestamp = Math.max(...timestamps);

  const daysDifference = (newestTimestamp - oldestTimestamp) / (1000 * 60 * 60 * 24);

  if (daysDifference < 14) {
    return {
      hasMinimumData: false,
      message: 'Insufficient data',
    };
  }

  return {
    hasMinimumData: true,
    message: '',
  };
}

export function checkBaselineDataGate(events: FunnelEvent[]): DataGateResult {
  if (events.length === 0) {
    return {
      hasMinimumData: false,
      message: 'Baseline forming',
    };
  }

  const timestamps = events.map(e => new Date(e.timestamp).getTime());
  const oldestTimestamp = Math.min(...timestamps);
  const newestTimestamp = Math.max(...timestamps);

  const daysDifference = (newestTimestamp - oldestTimestamp) / (1000 * 60 * 60 * 24);

  if (daysDifference < 60) {
    return {
      hasMinimumData: false,
      message: 'Baseline forming',
    };
  }

  return {
    hasMinimumData: true,
    message: '',
  };
}

export function checkFunnelVisualizationGate(completedQuotesCount: number): DataGateResult {
  if (completedQuotesCount < 30) {
    return {
      hasMinimumData: false,
      message: 'Insufficient data',
    };
  }

  return {
    hasMinimumData: true,
    message: '',
  };
}
