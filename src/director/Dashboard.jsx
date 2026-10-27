import { useState, useMemo, useEffect } from "react";
import { 
  Box, 
  Chip, 
  Typography, 
  Avatar, 
  LinearProgress, 
  IconButton, 
  Button, 
  Tooltip 
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link } from "react-router-dom";

import Card from "../componentes/ui/Card";
import { COLORS } from "../utils/constants";
import { apiDirector } from "../utils/apiDirector";

// Iconos para la sección de métricas según tipo
const MAPA_ICONOS = [
  <SchoolIcon sx={{ color: "#2563EB" }} />,
  <GroupsIcon sx={{ color: "#0D9488" }} />,
  <ClassIcon sx={{ color: "#D97706" }} />,
  <TrendingUpIcon sx={{ color: "#7C3AED" }} />
];

export default function DirectorDashboard() {
  const [bimestres, setBimestres] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiDirector.bimestres(), apiDirector.profesores(), apiDirector.cursos(), apiDirector.resumen()])
      .then(([b, p, c, r]) => {
        setBimestres(b.bimestres || []);
        setProfesores(p.profesores || []);
        setCursos(c.cursos || []);
        setResumen(r);
      })
      .catch((err) => setError(err.message));
  }, []);

  const bimestreActivo = bimestres.find((b) => b.habilitado);

  const directorResumen = useMemo(
    () =>
      resumen
        ? [
            { label: "Alumnos", value: String(resumen.alumnos), detail: `En ${resumen.aulas} aulas`, color: "#2563EB" },
            { label: "Profesores", value: String(resumen.profesores), detail: "Equipo activo", color: "#0F766E" },
            { label: "Cursos", value: String(resumen.cursos), detail: "Plan académico completo", color: "#B45309" },
            {
              label: "Promedio general",
              value: resumen.promedio_general == null ? "—" : String(resumen.promedio_general),
              detail: bimestreActivo ? bimestreActivo.nombre : "Sin bimestre activo",
              color: "#7C3AED",
            },
          ]
        : [],
    [resumen, bimestreActivo]
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      
      {error && <Typography sx={{ color: "#DC2626", mb: 2 }}>{error}</Typography>}
      {/* ── HEADER DE BIENVENIDA ── */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", sm: "center" }, 
          gap: 2, 
          mb: 4 
        }}
      >
        <Box>
          <Chip 
            label="Panel de Dirección" 
            size="small" 
            sx={{ 
              backgroundColor: "rgba(37, 99, 235, 0.1)", 
              color: "#2563EB", 
              fontWeight: 800, 
              fontSize: "0.75rem",
              mb: 1 
            }} 
          />
          <Typography 
            component="h1" 
            sx={{ 
              color: "#0F172A", 
              fontSize: { xs: "1.8rem", md: "2.4rem" }, 
              fontWeight: 800, 
              letterSpacing: "-0.02em" 
            }}
          >
            Vista general de la academia
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.95rem", mt: 0.5 }}>
            Seguimiento académico y gestión institucional · <strong>{bimestreActivo ? `${bimestreActivo.nombre} - 2026` : "2026"}</strong>
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/director/notas"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            borderRadius: "12px",
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.15)",
            "&:hover": {
              backgroundColor: "#1E293B",
            }
          }}
        >
          Revisar calificaciones
        </Button>
      </Box>

      {/* ── TARJETAS KPI (RESUMEN) ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2.5, mb: 4 }}>
        {directorResumen.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
              }
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
              <Box 
                sx={{ 
                  p: 1.2, 
                  borderRadius: "12px", 
                  backgroundColor: `${item.color || "#2563EB"}12`,
                  display: "grid",
                  placeItems: "center"
                }}
              >
                {MAPA_ICONOS[index % MAPA_ICONOS.length]}
              </Box>
              <Chip 
                label="+4.2%" 
                size="small" 
                sx={{ 
                  backgroundColor: "#DCFCE7", 
                  color: "#15803D", 
                  fontWeight: 700, 
                  fontSize: "0.7rem",
                  height: "22px" 
                }} 
              />
            </Box>
            <Typography sx={{ color: "#64748B", fontSize: "0.82rem", fontWeight: 600 }}>
              {item.label}
            </Typography>
            <Typography sx={{ color: "#0F172A", fontSize: { xs: "1.8rem", md: "2.1rem" }, fontWeight: 800, my: 0.5 }}>
              {item.value}
            </Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: "0.78rem" }}>
              {item.detail}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── SECCIÓN CENTRAL (ESTADO BIMESTRES + EQUIPO DOCENTE) ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" }, gap: 3, mb: 4 }}>
        
        {/* CARD: BIMESTRES */}
        <Card title="Estado del Periodo Académico">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {bimestres.map((bimestre, index) => {
              const activo = bimestre.habilitado;
              const porcentajeProgreso = activo ? 75 : index < 2 ? 100 : 0; // Ejemplo dinámico de progreso

              return (
                <Box 
                  key={bimestre.id} 
                  sx={{ 
                    p: 2, 
                    borderRadius: "14px", 
                    backgroundColor: activo ? "#F0FDFA" : "#F8FAFC",
                    border: activo ? "1px solid #CCFBF1" : "1px solid #E2E8F0",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {activo ? (
                        <CheckCircleRoundedIcon sx={{ color: "#0D9488", fontSize: 20 }} />
                      ) : (
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#94A3B8", ml: 0.75 }} />
                      )}
                      <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
                        {bimestre.nombre}
                      </Typography>
                    </Box>
                    <Chip 
                      label={activo ? "En Curso" : index < 2 ? "Concluido" : "Pendiente"} 
                      size="small" 
                      sx={{ 
                        color: activo ? "#0D9488" : index < 2 ? "#475569" : "#64748B", 
                        backgroundColor: activo ? "#0D948818" : index < 2 ? "#E2E8F0" : "#F1F5F9", 
                        fontWeight: 700,
                        fontSize: "0.72rem"
                      }} 
                    />
                  </Box>

                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#64748B" }}>Avance de registros</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#0F172A", fontWeight: 700 }}>{porcentajeProgreso}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={porcentajeProgreso} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        backgroundColor: "#E2E8F0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: activo ? "#0D9488" : "#64748B",
                          borderRadius: 3
                        }
                      }} 
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Card>

        {/* CARD: EQUIPO DOCENTE */}
        <Card 
          title="Equipo Docente Destacado" 
          action={
            <Button component={Link} to="/director/profesores" sx={{ color: "#2563EB", fontSize: "0.8rem", fontWeight: 700, textTransform: "none" }}>
              Ver todos
            </Button>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {profesores.map((profesor) => (
              <Box 
                key={profesor.id} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  "&:hover": { backgroundColor: "#F8FAFC" }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar 
                    sx={{ 
                      width: 42, 
                      height: 42, 
                      backgroundColor: "#EFF6FF", 
                      color: "#2563EB", 
                      fontWeight: 800, 
                      fontSize: "0.85rem",
                      border: "2px solid #DBEAFE"
                    }}
                  >
                    {profesor.iniciales}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem" }}>
                      {profesor.nombre}
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: "0.78rem" }}>
                      {profesor.curso} · <span style={{ color: "#0F172A", fontWeight: 600 }}>Aula {profesor.aula}</span>
                    </Typography>
                  </Box>
                </Box>

                <Tooltip title="Opciones">
                  <IconButton size="small">
                    <MoreVertIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Card>

      </Box>

      {/* ── PLAN ACADÉMICO COMPLETO ── */}
      <Card 
        title="Plan Académico y Cursos" 
        action={
          <Button component={Link} to="/director/cursos" sx={{ color: "#2563EB", fontSize: "0.8rem", fontWeight: 700, textTransform: "none" }}>
            Gestionar plan
          </Button>
        }
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2, pt: 1 }}>
          {cursos.map((curso) => (
            <Box 
              key={curso.id} 
              sx={{ 
                p: 2, 
                border: "1px solid #E2E8F0", 
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#2563EB",
                  boxShadow: "0px 4px 16px rgba(37, 99, 235, 0.08)",
                }
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem" }}>
                  {curso.nombre}
                </Typography>
                <Chip 
                  label={`${curso.horas} h/sem`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: "#F1F5F9", 
                    color: "#475569", 
                    fontWeight: 700, 
                    fontSize: "0.7rem",
                    borderRadius: "6px" 
                  }} 
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 500 }}>
                  Área: {curso.area}
                </Typography>
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: "50%", 
                    backgroundColor: "#2563EB" 
                  }} 
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

    </Box>
  );
}