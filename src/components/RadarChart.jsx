import { useMemo } from "react";

const DIMENSIONS = [
  { key: "youthfulness", label: "少年感" },
  { key: "elegance", label: "高级感" },
  { key: "vibe", label: "氛围感" },
  { key: "affinity", label: "亲和力" },
  { key: "uniqueness", label: "个性度" },
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function getAngles(count) {
  const startAngle = -90;
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => startAngle + i * step);
}

export function RadarChart({
  data,
  size = 220,
  color = "#fb7185",
  showDetails = true,
}) {
  const center = size / 2;
  const maxRadius = size * 0.38;
  const angles = getAngles(DIMENSIONS.length);

  const points = useMemo(() => {
    return DIMENSIONS.map(({ key }, i) => {
      const item = data?.[key];
      const value = typeof item === "object" ? item?.score : (item ?? 0);
      const radius = (value / 100) * maxRadius;
      return polarToCartesian(center, center, radius, angles[i]);
    });
  }, [data, center, maxRadius, angles]);

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {gridLevels.map((level, i) => {
          const gridPoints = angles.map((angle) => {
            const radius = level * maxRadius;
            return polarToCartesian(center, center, radius, angle);
          });
          const gridPolygon = gridPoints.map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <polygon
              key={i}
              points={gridPolygon}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="1"
              strokeDasharray={i < 3 ? "3 3" : ""}
            />
          );
        })}

        {angles.map((angle, i) => {
          const endPoint = polarToCartesian(center, center, maxRadius, angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#e7e5e4"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />

        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        ))}

        {DIMENSIONS.map(({ label }, i) => {
          const labelPos = polarToCartesian(
            center,
            center,
            maxRadius + 24,
            angles[i],
          );
          return (
            <text
              key={i}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] tracking-wide fill-stone-500 font-medium"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {showDetails && (
        <div className="grid grid-cols-5 gap-2 w-full">
          {DIMENSIONS.map(({ key, label }) => {
            const item = data?.[key];
            const score = typeof item === "object" ? item?.score : (item ?? 0);
            return (
              <div key={key} className="text-center">
                <div className="text-xl font-light tabular-nums text-stone-800">
                  {score}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">{label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RadarChart;
