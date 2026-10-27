import { Box, Typography, IconButton, Button } from "@mui/material";
import { useMemo, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { ASISTENCIA_COLORS, COLORS } from "../../utils/constants";

const DIAS = ["Lun", "Mar", "Miér", "Jue", "Vi", "Sáb", "Dom"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MESES_CORTOS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

/**
 * registros: [{ fecha: 'dd/mm/yyyy', estado: 'P'|'A'|'T'|'' }]
 */
export default function AttendanceChart({ registros = [], size = "default" }) {
  const isLarge = size === "large";
  const hoy = useMemo(() => new Date(), []);
  const hoyDia = hoy.getDate();
  const hoyMes = hoy.getMonth() + 1;
  const hoyAnio = hoy.getFullYear();

  // year / month controlan el mes visible. Navegación 100% libre, sin depender de "registros".
  const [year, setYear] = useState(hoyAnio);
  const [month, setMonth] = useState(hoyMes);

  // Vista: "dias" (calendario normal) o "meses" (selector rápido, como iOS/Android al tocar el título)
  const [vista, setVista] = useState("dias");
  const [anioSelector, setAnioSelector] = useState(hoyAnio);

  const mapaEstados = useMemo(() => {
    const map = {};
    registros.forEach((r) => {
      const [dd, mm, yyyy] = r.fecha.split("/");
      if (Number(mm) === month && Number(yyyy) === year) {
        map[Number(dd)] = r.estado;
      }
    });
    return map;
  }, [registros, month, year]);

  const primerDiaSemana = (new Date(year, month - 1, 1).getDay() + 6) % 7; // lunes=0
  const diasEnMes = new Date(year, month, 0).getDate();

  const celdas = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  // Navegación libre entre meses (sin límites, como cualquier calendario de celular)
  const moverMes = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m);
    setYear(y);
  };

  const irAHoy = () => {
    setYear(hoyAnio);
    setMonth(hoyMes);
    setVista("dias");
  };

  const abrirSelectorMes = () => {
    setAnioSelector(year);
    setVista("meses");
  };

  const elegirMes = (m) => {
    setMonth(m);
    setYear(anioSelector);
    setVista("dias");
  };

  const esHoy = (dia) => year === hoyAnio && month === hoyMes && dia === hoyDia;
  const enMesActual = year === hoyAnio && month === hoyMes;

  return (
    <Box sx={{ backgroundColor: COLORS.blue, borderRadius: "20px", p: isLarge ? { xs: 2.5, md: 3.5 } : 2, color: "#FFFFFF", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header: título del mes (clicable) + navegación */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography
          onClick={vista === "dias" ? abrirSelectorMes : undefined}
          sx={{
            fontWeight: 700,
            fontSize: isLarge ? { xs: "0.95rem", md: "1.05rem" } : "0.85rem",
            cursor: vista === "dias" ? "pointer" : "default",
            "&:hover": vista === "dias" ? { opacity: 0.8 } : {},
          }}
        >
          {vista === "dias" ? `${MESES[month - 1]} ${year}` : anioSelector}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {vista === "dias" && !enMesActual && (
            <Button
              size="small"
              onClick={irAHoy}
              sx={{
                color: "#FFFFFF",
                fontSize: "0.65rem",
                minWidth: 0,
                px: 1,
                textTransform: "none",
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              Hoy
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() =>
              vista === "dias" ? moverMes(-1) : setAnioSelector((a) => a - 1)
            }
            sx={{ color: "#FFFFFF" }}
          >
            <ChevronLeftRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              vista === "dias" ? moverMes(1) : setAnioSelector((a) => a + 1)
            }
            sx={{ color: "#FFFFFF" }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {vista === "meses" ? (
        // Selector rápido de mes, estilo iOS/Android
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
          {MESES_CORTOS.map((m, i) => {
            const activo = i + 1 === month && anioSelector === year;
            const esMesHoy = i + 1 === hoyMes && anioSelector === hoyAnio;
            return (
              <Box
                key={m}
                onClick={() => elegirMes(i + 1)}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: activo ? "#FFFFFF" : "rgba(255,255,255,0.08)",
                  color: activo ? COLORS.blue : "#FFFFFF",
                  border: esMesHoy && !activo ? "1px solid rgba(255,255,255,0.6)" : "none",
                  "&:hover": { backgroundColor: activo ? "#FFFFFF" : "rgba(255,255,255,0.18)" },
                }}
              >
                {m}
              </Box>
            );
          })}
        </Box>
      ) : (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isLarge ? 1.25 : 0.5, mb: 1 }}>
            {DIAS.map((d, i) => (
              <Typography
                key={i}
                sx={{ fontSize: isLarge ? { xs: "0.85rem", md: "1rem" } : "0.65rem", textAlign: "center", color: "rgba(255,255,255,0.65)" }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isLarge ? 1.25 : 0.5 }}>
            {celdas.map((dia, i) => {
              if (!dia) return <Box key={i} />;
              const estado = mapaEstados[dia];
              const c = ASISTENCIA_COLORS[estado || ""];
              const marcaHoy = esHoy(dia);
              return (
                <Box
                  key={i}
                  title={marcaHoy ? `Hoy · ${c.label}` : c.label}
                  sx={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isLarge ? { xs: "0.95rem", md: "1.15rem" } : "0.7rem",
                    fontWeight: 600,
                    backgroundColor: estado ? c.bg : "rgba(255,255,255,0.08)",
                    color: estado ? c.fg : "rgba(255,255,255,0.6)",
                    border: marcaHoy ? "2px solid #FFFFFF" : "2px solid transparent",
                    boxShadow: marcaHoy ? "0 0 0 2px rgba(255,255,255,0.35)" : "none",
                  }}
                >
                  {dia}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}