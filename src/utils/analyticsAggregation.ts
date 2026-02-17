export interface FunnelEvent {
  id: string;
  account_id: string;
  quote_id: string;
  event_type: 'quote_started' | 'quote_completed' | 'price_revealed' | 'deposit_page_viewed' | 'deposit_paid';
  timestamp: string;
  device_type: 'mobile' | 'desktop';
  lawn_size: number;
  calculated_price: number;
  deposit_percentage: number | null;
  deposit_amount: number | null;
  created_at: string;
}

export interface FunnelMetrics {
  quotesStarted: number;
  quotesCompleted: number;
  priceReveals: number;
  depositPageViews: number;
  depositsPaid: number;
  depositConversionRate: number;
  revealToDepositConversion: number;
  avgQuoteValue: number;
  totalDepositsCollected: number;
  pendingQuotesCount: number;
  pendingQuoteValue: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  conversionFromPrevious: number | null;
}

export function calculateFunnelMetrics(events: FunnelEvent[]): FunnelMetrics {
  const quotesStarted = events.filter(e => e.event_type === 'quote_started').length;
  const quotesCompleted = events.filter(e => e.event_type === 'quote_completed').length;
  const priceReveals = events.filter(e => e.event_type === 'price_revealed').length;
  const depositPageViews = events.filter(e => e.event_type === 'deposit_page_viewed').length;
  const depositsPaid = events.filter(e => e.event_type === 'deposit_paid').length;

  const depositConversionRate = quotesCompleted > 0
    ? (depositsPaid / quotesCompleted) * 100
    : 0;

  const revealToDepositConversion = priceReveals > 0
    ? (depositsPaid / priceReveals) * 100
    : 0;

  const completedQuoteEvents = events.filter(e => e.event_type === 'quote_completed');
  const totalQuoteValue = completedQuoteEvents.reduce((sum, e) => sum + e.calculated_price, 0);
  const avgQuoteValue = completedQuoteEvents.length > 0
    ? totalQuoteValue / completedQuoteEvents.length
    : 0;

  const depositEvents = events.filter(e => e.event_type === 'deposit_paid' && e.deposit_amount !== null);
  const totalDepositsCollected = depositEvents.reduce((sum, e) => sum + (e.deposit_amount || 0), 0);

  const completedQuoteIds = new Set(
    events.filter(e => e.event_type === 'quote_completed').map(e => e.quote_id)
  );
  const paidQuoteIds = new Set(
    events.filter(e => e.event_type === 'deposit_paid').map(e => e.quote_id)
  );

  const pendingQuoteIds = [...completedQuoteIds].filter(id => !paidQuoteIds.has(id));
  const pendingQuotesCount = pendingQuoteIds.length;

  const pendingQuoteEvents = events.filter(
    e => e.event_type === 'quote_completed' && pendingQuoteIds.includes(e.quote_id)
  );
  const pendingQuoteValue = pendingQuoteEvents.reduce((sum, e) => sum + e.calculated_price, 0);

  return {
    quotesStarted,
    quotesCompleted,
    priceReveals,
    depositPageViews,
    depositsPaid,
    depositConversionRate,
    revealToDepositConversion,
    avgQuoteValue,
    totalDepositsCollected,
    pendingQuotesCount,
    pendingQuoteValue,
  };
}

export function calculateFunnelSteps(metrics: FunnelMetrics): FunnelStep[] {
  return [
    {
      label: 'Quotes Completed',
      count: metrics.quotesCompleted,
      conversionFromPrevious: null,
    },
    {
      label: 'Price Reveals',
      count: metrics.priceReveals,
      conversionFromPrevious: metrics.quotesCompleted > 0
        ? (metrics.priceReveals / metrics.quotesCompleted) * 100
        : null,
    },
    {
      label: 'Deposit Page Views',
      count: metrics.depositPageViews,
      conversionFromPrevious: metrics.priceReveals > 0
        ? (metrics.depositPageViews / metrics.priceReveals) * 100
        : null,
    },
    {
      label: 'Deposits Paid',
      count: metrics.depositsPaid,
      conversionFromPrevious: metrics.depositPageViews > 0
        ? (metrics.depositsPaid / metrics.depositPageViews) * 100
        : null,
    },
  ];
}

export function groupEventsByDay(events: FunnelEvent[]): Map<string, FunnelEvent[]> {
  const grouped = new Map<string, FunnelEvent[]>();

  events.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(event);
  });

  return grouped;
}

export function calculateDailyMetrics(events: FunnelEvent[]): Array<{ date: string; quotesCompleted: number; depositsCollected: number }> {
  const dailyGroups = groupEventsByDay(events);
  const dailyMetrics: Array<{ date: string; quotesCompleted: number; depositsCollected: number }> = [];

  dailyGroups.forEach((dayEvents, date) => {
    const quotesCompleted = dayEvents.filter(e => e.event_type === 'quote_completed').length;
    const depositEvents = dayEvents.filter(e => e.event_type === 'deposit_paid' && e.deposit_amount !== null);
    const depositsCollected = depositEvents.reduce((sum, e) => sum + (e.deposit_amount || 0), 0);

    dailyMetrics.push({ date, quotesCompleted, depositsCollected });
  });

  return dailyMetrics.sort((a, b) => a.date.localeCompare(b.date));
}
