import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Chip, LinearProgress, Divider } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import Card from "../componentes/ui/Card";
import { api } from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../utils/constants";

export default function Asistencia() {
  const { user } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    let activo = true;
    api
      .getAsistencia(user.nombre, user.salon)
      .then((res) => activo && setData(res))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [user]);

  const resumen = data.resumen || { P: 0, A: 0, T: 0, total: 0, pct_asist: 0 };
  const historial = useMemo(() => [...(data.registros || [])].reverse().slice(0, 30), [data]);

  const tarjetas = [
    {
      label: "Asistencias",
      value: resumen.P,
      color: "#10B981",
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
      icon: CheckCircleRoundedIcon,
    },
    {
      label: "Tardanzas",
      value: resumen.T,
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      borderColor: "#FDE68A",
      icon: AccessTimeRoundedIcon,
    },
    {
      label: "Inasistencias",
      value: resumen.A,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
      icon: CancelRoundedIcon,
    },
    {
      label: "Total Días",
      value: resumen.total,
      color: "#6366F1",
      bgColor: "#EEF2FF",
      borderColor: "#C7D2FE",
      icon: Groups2RoundedIcon,
    },
  ];

  // Determinar estado según el porcentaje de asistencia
  const estadoAsistencia = useMemo(() => {
    const pct = resumen.pct_asist || 0;
    if (pct >= 85) return { label: "Excelente", color: "#059669", bg: "#ECFDF5" };
    if (pct >= 70) return { label: "Regular", color: "#D97706", bg: "#FEF3C7" };
    return { label: "En Riesgo", color: "#DC2626", bg: "#FEF2F2" };
  }, [resumen.pct_asist]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: COLORS.navy,
            letterSpacing: "-0.02em",
          }}
        >
          Control de Asistencia
        </Typography>
        <Typography sx={{ color: COLORS.slate, fontSize: "0.85rem", mt: 0.2 }}>
          Seguimiento detallado de puntualidad y permanencia escolar.
        </Typography>
      </Box>

      {/* Grid de Métricas Principales */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, sm: 2 },
          mb: 3,
        }}
      >
        {tarjetas.map((t) => {
          const IconComponent = t.icon;
          return (
            <Box
              key={t.label}
              sx={{
                p: { xs: 2, sm: 2.5 },
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.06)",
                  borderColor: t.borderColor,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 42 },
                    height: { xs: 36, sm: 42 },
                    borderRadius: "12px",
                    backgroundColor: t.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent sx={{ color: t.color, fontSize: { xs: 20, sm: 24 } }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: COLORS.slate,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {t.label}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.6rem", sm: "2.1rem" },
                  color: COLORS.navy,
                  lineHeight: 1,
                }}
              >
                {t.value}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Tarjeta de Ratios y Progreso */}
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: COLORS.navy }}>
              Porcentaje Global de Asistencia
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: COLORS.slate, mt: 0.2 }}>
              Calculado sobre el total de días lectivos registrados.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Chip
              label={estadoAsistencia.label}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                color: estadoAsistencia.color,
                backgroundColor: estadoAsistencia.bg,
                borderRadius: "8px",
              }}
            />
            <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: COLORS.navy }}>
              {resumen.pct_asist}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: "relative", width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={resumen.pct_asist || 0}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#F1F5F9",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: estadoAsistencia.color,
              },
            }}
          />
        </Box>
      </Card>

      {/* Historial Reciente */}
      {historial.length > 0 && (
        <Card title="Historial Reciente" subtitle="Últimos registros de asistencia">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {historial.map((item, index) => {
              const esAsistencia = item.estado === "P";
              const esTardanza = item.estado === "T";

              const badgeColor = esAsistencia ? "#059669" : esTardanza ? "#D97706" : "#DC2626";
              const badgeBg = esAsistencia ? "#ECFDF5" : esTardanza ? "#FEF3C7" : "#FEF2F2";
              const estadoTexto = esAsistencia ? "Presente" : esTardanza ? "Tardanza" : "Ausente";

              return (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.2,
                      px: { xs: 1, sm: 2 },
                      borderRadius: "10px",
                      transition: "background-color 0.2s",
                      "&:hover": { backgroundColor: "#F8FAFC" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: COLORS.slate }} />
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.navy }}>
                        {item.fecha}
                      </Typography>
                    </Box>

                    <Chip
                      label={estadoTexto}
                      size="small"
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: badgeColor,
                        backgroundColor: badgeBg,
                        borderRadius: "6px",
                        height: 24,
                      }}
                    />
                  </Box>
                  {index < historial.length - 1 && <Divider sx={{ borderColor: COLORS.border }} />}
                </Box>
              );
            })}
          </Box>
        </Card>
      )}
    </Box>
  );
}