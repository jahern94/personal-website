interface SimpleChartProps {
  data: number[];
  labels?: string[];
  type: "bar" | "line";
  height?: number;
  color?: string;
  negativeColor?: string;
}

export default function SimpleChart({
  data,
  labels,
  type,
  height = 160,
  color = "#2563eb",
  negativeColor = "#dc2626",
}: SimpleChartProps) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map(Math.abs), 1);
  const padding = { top: 10, right: 10, bottom: labels ? 30 : 10, left: 10 };
  const chartWidth = Math.max(data.length * 40, 300);
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const hasNegatives = data.some((d) => d < 0);
  const zeroY = hasNegatives
    ? padding.top + (maxVal / (maxVal * 2)) * innerHeight
    : padding.top + innerHeight;

  if (type === "bar") {
    const barWidth = Math.min(30, (innerWidth / data.length) * 0.7);
    const barGap = (innerWidth - barWidth * data.length) / (data.length + 1);

    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        style={{ maxHeight: height }}
      >
        {/* Zero line */}
        {hasNegatives && (
          <line
            x1={padding.left}
            y1={zeroY}
            x2={chartWidth - padding.right}
            y2={zeroY}
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeDasharray="4 4"
          />
        )}
        {data.map((val, i) => {
          const x = padding.left + barGap + i * (barWidth + barGap);
          const barHeight = (Math.abs(val) / maxVal) * (hasNegatives ? innerHeight / 2 : innerHeight);
          const y = val >= 0 ? zeroY - barHeight : zeroY;
          const fill = val >= 0 ? color : negativeColor;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(1, barHeight)}
                rx={3}
                fill={fill}
                opacity={0.85}
              />
              {labels && labels[i] && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="currentColor"
                  opacity={0.5}
                >
                  {labels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // Line chart
  const pointGap = innerWidth / Math.max(data.length - 1, 1);
  const points = data.map((val, i) => {
    const x = padding.left + i * pointGap;
    const normalizedVal = hasNegatives
      ? (val + maxVal) / (maxVal * 2)
      : val / maxVal;
    const y = padding.top + innerHeight - normalizedVal * innerHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="w-full"
      style={{ maxHeight: height }}
    >
      {/* Zero line */}
      {hasNegatives && (
        <line
          x1={padding.left}
          y1={zeroY}
          x2={chartWidth - padding.right}
          y2={zeroY}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeDasharray="4 4"
        />
      )}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={data[i] >= 0 ? color : negativeColor} />
          {labels && labels[i] && (
            <text
              x={p.x}
              y={chartHeight - 4}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.5}
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
