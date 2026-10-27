import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, Avatar, Chip, Tooltip, Stack } from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StatCard from "../componentes/admin/StatCardProfesor";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import Loader from "../componentes/ui/Loader";
import AttendanceChart from "../componentes/dashboard/AttendanceChart";
import { useAuth } from "../hooks/useAuth";
import { apiAdmin as api } from "../utils/apiAdmin";
import { COLORS } from "../utils/constants";
import { useAlumnosPorSalon } from "../hooks/useAlumnosPorSalon";
import { getBimestresProfesor } from "../utils/bimestresAccess";

const ICONOS_CURSO = [MenuBookOutlinedIcon, FunctionsRoundedIcon, ScienceRoundedIcon, TranslateRoundedIcon];
const COLORES_CURSO = [
  { bg: "#E0F2FE", fg: "#0284C7" },
  { bg: "#DCFCE7", fg: "#16A34A" },
  { bg: "#FFE4E6", fg: "#E11D48" },
  { bg: "#EDE9FE", fg: "#7C3AED" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { salones: alumnosPorSalon } = useAlumnosPorSalon();

  useEffect(() => {
    let active = true;
    api
      .getConfig(user?.profesor)
      .then((res) => active && setConfig({ ...res, bimestres: getBimestresProfesor(res.bimestres || []) }))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  const totalAlumnos = useMemo(
    () =>
      (config?.salones || []).reduce(
        (total, salon) => total + (alumnosPorSalon[salon]?.length || 0),
        0
      ),
    [config, alumnosPorSalon]
  );

  if (loading) return <Loader label="Cargando panel..." />;

  const bimestreActivo = config?.bimestres?.find((b) => b.habilitado);
  const nombreProfesor = user?.profesor || "Profesor";
  const inicialesProfesor = nombreProfesor
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, width: "100%", boxSizing: "border-box", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* 1. ENCABEZADO SUPERIOR: 4 TARJETAS AMPLIAS */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3, width: "100%" }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard label="Cursos Asignados" value={config?.cursos?.length ?? 0} icon={MenuBookRoundedIcon} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard label="Salones Asignados" value={config?.salones?.length ?? 0} icon={GroupRoundedIcon} color="#7C3AED" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard label="Alumnos a Cargo" value={totalAlumnos} icon={FactCheckRoundedIcon} color="#0284C7" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            label="Bimestre Activo"
            value={bimestreActivo ? bimestreActivo.nombre.replace("BIMESTRE ", "B") : "—"}
            icon={GradingRoundedIcon}
            color="#E11D48"
          />
        </Grid>
      </Grid>

      {error && (
        <Box sx={{ p: 2, mb: 3, borderRadius: "12px", bgcolor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", fontSize: "0.875rem" }}>
          {error}
        </Box>
      )}

      {/* 2. CONTENIDO PRINCIPAL: RESPONSIVO 12 COLS EN MOVIL / 8 + 4 EN DESKTOP */}
      <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
        
        {/* COLUMNA IZQUIERDA (MÓVIL: 100%, DESKTOP: 8/12) */}
        <Grid item xs={12} md={7} lg={7.2}>
          <Stack spacing={2.5} sx={{ height: "100%" }}>
            
            {/* Estado de Bimestres */}
            <Card title="Estado de Bimestres">
              <Grid container spacing={5.5}>
                {(config?.bimestres || []).map((b) => (
                  <Grid item xs={6} sm={6} md={3} key={b.nombre}>
                    <Box
                      sx={{
                        borderRadius: "12px",
                        p: 1.25,
                        backgroundColor: b.habilitado ? "#F0FDF4" : "#FAFAFA",
                        border: "1px solid",
                        borderColor: b.habilitado ? "#86EFAC" : "#E2E8F0",
                        height: "100%",
                        boxSizing: "border-box"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: COLORS.navy }}>
                          {b.nombre.replace("BIMESTRE ", "Bim. ")}
                        </Typography>
                        {b.habilitado ? (
                          <CheckCircleRoundedIcon sx={{ fontSize: 15, color: "#16A34A" }} />
                        ) : (
                          <LockRoundedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                        )}
                      </Box>
                      <Typography sx={{ fontSize: "0.68rem", color: COLORS.slate }}>
                        {b.inicio} — {b.fin}
                      </Typography>
                      <Chip
                        label={b.habilitado ? "Habilitado" : "Bloqueado"}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          bgcolor: b.habilitado ? "#DCFCE7" : "#F1F5F9",
                          color: b.habilitado ? "#15803D" : "#64748B",
                          mt: 0.8,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Cursos a tu Cargo (Cuadrícula Responsiva) */}
            <Card title="Cursos a tu Cargo">
              <Grid container spacing={1.5}>
                {(config?.cursos || []).map((curso, i) => {
                  const Icon = ICONOS_CURSO[i % ICONOS_CURSO.length];
                  const c = COLORES_CURSO[i % COLORES_CURSO.length];
                  return (
                    <Grid item xs={12} sm={6} key={curso}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: "12px",
                          backgroundColor: "#FFFFFF",
                          border: `1px solid ${COLORS.border || "#E2E8F0"}`,
                          width: "100%",
                          boxSizing: "border-box"
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            borderRadius: "10px",
                            backgroundColor: c.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon sx={{ fontSize: 20, color: c.fg }} />
                        </Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.navy }}>
                          {curso}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>

            {/* Asistencia por Salón */}
            <Card title="Asistencia por Salón">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.5 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    backgroundColor: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FactCheckRoundedIcon sx={{ color: "#4F46E5", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem", color: COLORS.navy, fontWeight: 700, mb: 0.3 }}>
                    Total: {totalAlumnos} alumnos en {config?.salones?.length ?? 0} salones
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: COLORS.slate, lineHeight: 1.4 }}>
                    Próximamente disponible: Toma de asistencia rápida diaria y consolidados por fecha.
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Reportes / PDF */}
            <Card title="Reportes / PDF">
              <Box sx={{ py: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "12px",
                      backgroundColor: "#FEF3C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SummarizeRoundedIcon sx={{ color: "#D97706", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.9rem", color: COLORS.navy, fontWeight: 700 }}>
                      Reportes de Notas y Asistencia
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: COLORS.slate }}>
                      Generación de boletines en PDF
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="Módulo en desarrollo">
                  <span>
                    <Button
                      variant="outline"
                      startIcon={<DownloadRoundedIcon />}
                      disabled
                      fullWidth
                      sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", py: 1 }}
                    >
                      Próximamente</Button>
                  </span>
                </Tooltip>
              </Box>
            </Card>

          </Stack>
        </Grid>

        {/* LATERAL DERECHO: COMPLETO HASTA LOS BORDES (MÓVIL: 100%, DESKTOP: 4/12) */}
        <Grid item xs={12} md={5} lg={4.8} sx={{ ml: { lg: "auto" } }}>
          <Stack spacing={1.5} sx={{ height: "100%", alignItems: { lg: "flex-end" } }}>
            
            {/* Tarjeta de Perfil Profesor Demo */}
            <Box
              sx={{
                backgroundColor: COLORS.cardDark || "#1E293B",
                borderRadius: "10px",
                p: { xs: 2.5, md: 3 },
                color: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 76, md: 94 },
                  height: { xs: 76, md: 94 },
                  bgcolor: COLORS.blue || "#2563EB",
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  mb: 0.5
                }}
              >
                {inicialesProfesor}
              </Avatar>
              <Box sx={{ textAlign: "center", width: "100%", overflow: "hidden" }}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.8}>
                  <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: "1.15rem", md: "1.45rem" } }}>
                    {nombreProfesor}
                  </Typography>
                  <VerifiedRoundedIcon sx={{ fontSize: 22, color: "#38BDF8", flexShrink: 0 }} />
                </Stack>
                <Typography sx={{ color: "#CBD5E1", fontSize: { xs: "0.85rem", md: "0.95rem" }, mt: 0.25 }}>
                  Docente Titular
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.25,
                  width: "100%",
                  mt: 1.25,
                }}
              >
                <Box sx={{ backgroundColor: "rgba(148,163,184,0.25)", borderRadius: "14px", p: 1.5, textAlign: "center" }}>
                  <MenuBookRoundedIcon sx={{ color: COLORS.blue, fontSize: 23 }} />
                  <Typography sx={{ fontSize: "1.35rem", lineHeight: 1.1, fontWeight: 800 }}>{config?.cursos?.length ?? 0}</Typography>
                  <Typography sx={{ color: "#CBD5E1", fontSize: "0.75rem" }}>Cursos</Typography>
                </Box>
                <Box sx={{ backgroundColor: "rgba(148,163,184,0.25)", borderRadius: "14px", p: 1.5, textAlign: "center" }}>
                  <GroupRoundedIcon sx={{ color: COLORS.blue, fontSize: 23 }} />
                  <Typography sx={{ fontSize: "1.35rem", lineHeight: 1.1, fontWeight: 800 }}>{totalAlumnos}</Typography>
                  <Typography sx={{ color: "#CBD5E1", fontSize: "0.75rem" }}>Alumnos</Typography>
                </Box>
              </Box>
            </Box>

            {/* Calendario / Agenda (Expandido a todo el ancho y alto del contenedor) */}
            <Card 
              title="Calendario" 
              action={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: COLORS.slate, fontSize: "0.7 8rem" }}>
                  <CalendarMonthRoundedIcon sx={{ fontSize: 19, color: COLORS.blue }} />
                 
                </Box>
              }
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "flex-start",
                  "& > *": { width: "100% !important", maxWidth: "100% !important" }
                }}
              >
                <AttendanceChart registros={[]} size="large" />
              </Box>
            </Card>

          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}