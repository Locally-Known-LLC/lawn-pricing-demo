import { FunnelEvent, FunnelMetrics, FunnelStep } from './analyticsAggregation';

export interface MicroInsight {
  text: string;
}

const MIN_QUOTES_FOR_INSIGHTS = 100;

export function generateMicroInsights(
  events: FunnelEvent[],
  metrics: FunnelMetrics,
  steps: FunnelStep[],
  baselineDepositConversion: number | null
): MicroInsight[] {
  if (metrics.quotesCompleted < MIN_QUOTES_FOR_INSIGHTS) return [];

  const insights: MicroInsight[] = [];

  const completedEvents = events.filter(e => e.event_type === 'quote_completed');
  if (completedEvents.length >= MIN_QUOTES_FOR_INSIGHTS) {
    const smallLawn = completedEvents.filter(e => e.lawn_size < 3000).length;
    const pct = Math.round((smallLawn / completedEvents.length) * 100);
    insights.push({ text: `${pct}% of quotes are under 3,000 sq ft.` });
  }

  if (baselineDepositConversion !== null) {
    const diff = metrics.depositConversionRate - baselineDepositConversion;
    if (diff < -1) {
      const absDiff = Math.abs(diff).toFixed(1);
      insights.push({ text: `Deposit conversion is ${absDiff}% below your rolling average.` });
    }
  }

  const maxDropStep = steps
    .filter(s => s.conversionFromPrevious !== null && s.conversionFromPrevious < 100)
    .reduce<FunnelStep | null>((worst, step) => {
      if (!worst) return step;
      return (step.conversionFromPrevious! < worst.conversionFromPrevious!) ? step : worst;
    }, null);

  if (maxDropStep) {
    insights.push({ text: `Most drop-off occurs at the "${maxDropStep.label}" step.` });
  }

  return insights.slice(0, 2);
}
