import { Box, Typography } from "@mui/material";
import { COLORS, notaColor } from "../../utils/constants";

/**
 * cursos: [{ curso, promedios: { PC, TAREA, ACTITUD, EXAMEN, FINAL } }]
 */
export default function PerformanceChart({ cursos = [] }) {
  if (cursos.length === 0) {
    return (
      <Typography sx={{ color: COLORS.slate, fontSize: "0.85rem" }}>
        Aún no hay notas registradas en este bimestre.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      {cursos.map((c) => {
        const final = c.promedios?.FINAL;
        const pct = final != null ? Math.min(100, (final / 20) * 100) : 0;
        const { fg } = notaColor(final);
        return (
          <Box
            key={c.curso}
            sx={{
              p: 1.5,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "14px",
              backgroundColor: "#F8FAFC",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: COLORS.navy, lineHeight: 1.25 }}>
                  {c.curso}
                </Typography>
                <Typography sx={{ fontSize: "0.68rem", color: COLORS.slate, mt: 0.35 }}>
                  Promedio final
                </Typography>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  minWidth: 42,
                  px: 0.75,
                  py: 0.45,
                  borderRadius: "8px",
                  backgroundColor: `${fg}18`,
                  color: fg,
                  textAlign: "center",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                }}
              >
                {final != null ? final : "S.N."}
              </Box>
            </Box>
            <Box sx={{ height: 7, borderRadius: "999px", backgroundColor: "#E2E8F0", overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${pct}%`, backgroundColor: fg, borderRadius: "999px" }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}