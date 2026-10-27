import { Box, Typography } from "@mui/material";

/**
 * Componente DonutChart estilizado
 * segments: [{ label, value, color }]
 */
export default function DonutChart({
  segments = [],
  size = 190,
  thickness = 22,
  centerValue,
  centerLabel,
}) {
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
  const radius = (size - thickness) / 2;
  const circunferencia = 2 * Math.PI * radius;

  let offsetAcumulado = 0;
  const segmentosCalculados = segments.map((s) => {
    const valor = s.value || 0;
    const fraccion = valor / total;
    const largo = fraccion * circunferencia;
    const offsetActual = offsetAcumulado;
    offsetAcumulado += largo;

    return {
      ...s,
      largo,
      offset: offsetActual,
    };
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5 }}>
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Círculo Base / Fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={thickness}
          />

          {/* Segmentos de la dona */}
          {segmentosCalculados.map((s, i) => {
            if (s.value === 0) return null;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${s.largo} ${circunferencia - s.largo}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.06))",
                }}
              />
            );
          })}
        </svg>

        {/* Texto Central */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: "2rem", color: "#1E293B", lineHeight: 1 }}>
            {centerValue}
          </Typography>
          {centerLabel && (
            <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, mt: 0.5, letterSpacing: 0.5 }}>
              {centerLabel.toUpperCase()}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Leyenda Horizontal */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
        {segments.map((s, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: s.color,
                boxShadow: `0 0 6px ${s.color}66`,
              }}
            />
            <Typography sx={{ fontSize: "0.78rem", color: "#334155", fontWeight: 700 }}>
              {s.label} <span style={{ color: "#94A3B8", fontWeight: 500 }}>· {s.value}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}