import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { COLORS } from "../../utils/constants";

const MESES_CORTOS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

const CIRCULO = {
  P: { bg: "#15803D", label: "P" },
  A: { bg: "#B91C1C", label: "A" },
  T: { bg: "#B45309", label: "T" },
  "": { bg: "#CBD5E1", label: "—" },
};

/**
 * registros: [{ fecha: 'dd/mm/yyyy', dia: 'lun', estado: 'P'|'A'|'T'|'' }]
 * Agrupa por mes/año y los muestra en orden cronológico ascendente.
 */
export default function AttendanceTimeline({ registros = [] }) {
  const grupos = useMemo(() => {
    const mapa = {};
    registros.forEach((r) => {
      const [dd, mm, yyyy] = r.fecha.split("/");
      const clave = `${yyyy}-${mm}`;
      if (!mapa[clave]) mapa[clave] = { anio: Number(yyyy), mes: Number(mm), items: [] };
      mapa[clave].items.push(r);
    });
    return Object.values(mapa).sort((a, b) => a.anio - b.anio || a.mes - b.mes);
  }, [registros]);

  if (grupos.length === 0) {
    return (
      <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem", textAlign: "center", py: 4 }}>
        Sin registros de asistencia todavía.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {grupos.map((g) => (
        <Box key={`${g.anio}-${g.mes}`}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: COLORS.slate }} />
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: COLORS.navy, letterSpacing: 0.5 }}>
              {MESES_CORTOS[g.mes - 1]} {g.anio}
            </Typography>
            <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.2 }}>
            {g.items.map((r, i) => {
              const c = CIRCULO[r.estado] || CIRCULO[""];
              const [dd, mm] = r.fecha.split("/");
              return (
                <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 52 }}>
                  <Box
                    title={r.fecha}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: c.bg,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      boxShadow: `0 4px 10px ${c.bg}55`,
                    }}
                  >
                    {c.label}
                  </Box>
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: COLORS.navy, mt: 0.6 }}>
                    {dd}/{mm}
                  </Typography>
                  <Typography sx={{ fontSize: "0.65rem", color: COLORS.slate, textTransform: "lowercase" }}>
                    {r.dia}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
}