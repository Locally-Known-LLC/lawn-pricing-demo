interface Props {
  title: string;
  data: Array<{ date: string; value: number }>;
  hasMinimumData: boolean;
  insufficientDataMessage: string;
  valueFormatter?: (value: number) => string;
}

const GRID_LINES = 4;
const PADDING = { top: 10, right: 8, bottom: 24, left: 0 };

export default function TrendChart({ title, data, hasMinimumData, insufficientDataMessage, valueFormatter }: Props) {
  if (!hasMinimumData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">{insufficientDataMessage}</p>
        </div>
      </div>
    );
  }

  const points = data.slice(-28);
  const maxValue = Math.max(...points.map(d => d.value), 1);
  const formatValue = valueFormatter || ((v: number) => v.toString());

  const gridMax = Math.ceil(maxValue / GRID_LINES) * GRID_LINES || GRID_LINES;
  const gridTicks = Array.from({ length: GRID_LINES + 1 }, (_, i) =>
    gridMax - (gridMax / GRID_LINES) * i
  );

  const svgWidth = 400;
  const svgHeight = 160;
  const chartWidth = svgWidth - PADDING.left - PADDING.right;
  const chartHeight = svgHeight - PADDING.top - PADDING.bottom;

  const toX = (i: number) =>
    PADDING.left + (points.length > 1 ? (i / (points.length - 1)) * chartWidth : chartWidth / 2);
  const toY = (value: number) =>
    PADDING.top + chartHeight - (value / gridMax) * chartHeight;

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.value)}`)
    .join(' ');

  const areaPath =
    `M ${toX(0)} ${toY(points[0].value)} ` +
    points.slice(1).map((p, i) => `L ${toX(i + 1)} ${toY(p.value)}`).join(' ') +
    ` L ${toX(points.length - 1)} ${PADDING.top + chartHeight}` +
    ` L ${toX(0)} ${PADDING.top + chartHeight} Z`;

  const showEveryNth = points.length > 14 ? Math.ceil(points.length / 7) : Math.ceil(points.length / 7) || 1;

  const yLabelWidth = 44;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-5">{title}</h3>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between" style={{ width: yLabelWidth, paddingBottom: PADDING.bottom }}>
          {gridTicks.map((tick) => (
            <span key={tick} className="text-xs text-gray-400 text-right leading-none block">
              {formatValue(tick)}
            </span>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: svgHeight }}
          >
            <defs>
              <linearGradient id={`area-gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f2937" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#1f2937" stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridTicks.map((tick, i) => (
              <line
                key={tick}
                x1={PADDING.left}
                x2={svgWidth - PADDING.right}
                y1={PADDING.top + (i / GRID_LINES) * chartHeight}
                y2={PADDING.top + (i / GRID_LINES) * chartHeight}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            <path
              d={areaPath}
              fill={`url(#area-gradient-${title.replace(/\s+/g, '')})`}
            />

            <path
              d={linePath}
              fill="none"
              stroke="#1f2937"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((point, i) => (
              <circle
                key={i}
                cx={toX(i)}
                cy={toY(point.value)}
                r="2.5"
                fill="white"
                stroke="#1f2937"
                strokeWidth="1.5"
              />
            ))}

            {points.map((point, i) => {
              const show = i % showEveryNth === 0 || i === points.length - 1;
              if (!show) return null;
              const d = new Date(point.date + 'T00:00:00');
              const label = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
              return (
                <text
                  key={i}
                  x={toX(i)}
                  y={svgHeight - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9ca3af"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
