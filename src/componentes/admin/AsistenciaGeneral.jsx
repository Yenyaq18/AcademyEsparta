import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar,
  Alert,
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  Badge,
  Paper,
} from "@mui/material";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import Card from "../ui/Card";
import Button from "../ui/Button";
import { COLORS } from "../../utils/constants";
import { apiAdmin } from "../../utils/apiAdmin";
import { useAuth } from "../../hooks/useAuth";
import { useAlumnosPorSalon } from "../../hooks/useAlumnosPorSalon";

const ESTADO_A_LETRA = { Presente: "P", Ausente: "A", Tardanza: "T", Pendiente: "" };
const LETRA_A_ESTADO = { P: "Presente", A: "Ausente", T: "Tardanza", "": "Pendiente" };
const aDDMMYYYY = (iso) => iso.split("-").reverse().join("/");

const ESTADOS = {
  Presente: { color: "#166534", activeBg: "#22C55E", background: "#DCFCE7", icon: CheckCircleRoundedIcon },
  Ausente: { color: "#991B1B", activeBg: "#EF4444", background: "#FEE2E2", icon: CancelRoundedIcon },
  Tardanza: { color: "#92400E", activeBg: "#F59E0B", background: "#FEF3C7", icon: ScheduleRoundedIcon },
  Pendiente: { color: "#475569", activeBg: "#94A3B8", background: "#F1F5F9", icon: ScheduleRoundedIcon },
};

const COLORES_AVATAR = [COLORS.blue, "#7C3AED", "#15803D", "#BE123C", "#0369A1", "#B45309"];

function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function colorPorNombre(nombre) {
  const codigo = nombre.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLORES_AVATAR[codigo % COLORES_AVATAR.length];
}

const fechaInicial = new Date().toISOString().slice(0, 10);

export default function AsistenciaGeneral() {
  const [salon, setSalon] = useState("TODOS");
  const [fecha, setFecha] = useState(fechaInicial);
  const [busqueda, setBusqueda] = useState("");
  const [asistencia, setAsistencia] = useState({});
  const [guardado, setGuardado] = useState(false);
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);
  const { user } = useAuth();
  const { salones: alumnosPorSalon } = useAlumnosPorSalon();
  const [salonesProfesor, setSalonesProfesor] = useState([]);

  useEffect(() => {
    apiAdmin
      .getConfig(user?.profesor)
      .then((res) => setSalonesProfesor(res.salones || []))
      .catch(() => {});
  }, [user]);

  // Carga la asistencia ya guardada para la fecha elegida
  useEffect(() => {
    let activo = true;
    apiAdmin
      .getAsistenciaDia("TODOS", aDDMMYYYY(fecha))
      .then((res) => {
        if (!activo) return;
        const cargado = {};
        res.alumnos.forEach((a) => {
          cargado[`${fecha}-${a.salon}-${a.nombre}`] = LETRA_A_ESTADO[a.estado] || "Pendiente";
        });
        setAsistencia((actual) => ({ ...actual, ...cargado }));
        setCambiosSinGuardar(false);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [fecha]);

  // Carga lista global de alumnos
  const alumnos = useMemo(
    () =>
      Object.entries(alumnosPorSalon).flatMap(([nombreSalon, nombres]) =>
        nombres.map((nombre) => ({ nombre, salon: nombreSalon }))
      ),
    [alumnosPorSalon]
  );

  // Filtrado por salón y búsqueda por nombre
  const alumnosVisibles = useMemo(() => {
    return alumnos.filter((a) => {
      const coincideSalon = salon === "TODOS" || a.salon === salon;
      const coincideBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase().trim());
      return coincideSalon && coincideBusqueda;
    });
  }, [alumnos, salon, busqueda]);

  const obtenerEstado = (alumno) => asistencia[`${fecha}-${alumno.salon}-${alumno.nombre}`] || "Pendiente";

  const cambiarEstado = (alumno, nuevoEstado) => {
    const estadoActual = obtenerEstado(alumno);
    // Si presiona el estado activo, vuelve a "Pendiente"
    const estadoFinal = estadoActual === nuevoEstado ? "Pendiente" : nuevoEstado;

    setGuardado(false);
    setCambiosSinGuardar(true);
    setAsistencia((actual) => ({
      ...actual,
      [`${fecha}-${alumno.salon}-${alumno.nombre}`]: estadoFinal,
    }));
  };

  // Acciones masivas
  const marcarTodos = (estado) => {
    setGuardado(false);
    setCambiosSinGuardar(true);
    const nuevasAsistencias = { ...asistencia };
    alumnosVisibles.forEach((alumno) => {
      nuevasAsistencias[`${fecha}-${alumno.salon}-${alumno.nombre}`] = estado;
    });
    setAsistencia(nuevasAsistencias);
  };

  const resumen = useMemo(() => {
    return alumnosVisibles.reduce(
      (total, alumno) => {
        const est = obtenerEstado(alumno);
        total[est] = (total[est] || 0) + 1;
        return total;
      },
      { Presente: 0, Ausente: 0, Tardanza: 0, Pendiente: 0 }
    );
  }, [alumnosVisibles, asistencia, fecha]);

  const guardarAsistencia = async () => {
    const datos = alumnos.map((a) => ({
      alumno: a.nombre,
      salon: a.salon,
      estado: ESTADO_A_LETRA[asistencia[`${fecha}-${a.salon}-${a.nombre}`] || "Pendiente"] || "",
    }));
    try {
      await apiAdmin.guardarAsistencia(aDDMMYYYY(fecha), datos);
      setGuardado(true);
      setCambiosSinGuardar(false);
    } catch (err) {
      window.alert(err.message);
    }
  };

  // Agrupamiento dinámico por salón
  const grupos = useMemo(() => {
    const mapa = {};
    alumnosVisibles.forEach((a) => {
      if (!mapa[a.salon]) mapa[a.salon] = [];
      mapa[a.salon].push(a);
    });
    return Object.entries(mapa).sort(([a], [b]) => a.localeCompare(b));
  }, [alumnosVisibles]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2 } }}>
      {/* Encabezado Principal */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: COLORS.navy, tracking: "-0.02em" }}>
            Control de Asistencia
          </Typography>
          <Typography sx={{ color: COLORS.slate, fontSize: "0.875rem", mt: 0.2 }}>
            Gestiona el registro de presencia diario por aulas y estudiantes.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
        <Button
          variant="outline"
          onClick={() => apiAdmin.pdfAsistencia(salon, aDDMMYYYY(fecha)).catch((err) => window.alert(err.message))}
          sx={{ px: 3, py: 1.2, borderRadius: "10px" }}
        >
          Descargar PDF
        </Button>
        <Badge color="warning" variant="dot" invisible={!cambiosSinGuardar}>
          <Button
            startIcon={<SaveRoundedIcon />}
            onClick={guardarAsistencia}
            variant="contained"
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              boxShadow: cambiosSinGuardar ? "0 4px 14px rgba(37, 99, 235, 0.35)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Guardar cambios
          </Button>
        </Badge>
        </Box>
      </Box>

      {guardado && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "12px", border: "1px solid #BBF7D0" }} onClose={() => setGuardado(false)}>
          Asistencia registrada con éxito para la fecha <strong>{fecha}</strong>.
        </Alert>
      )}

      {/* Tarjetas de Resumen KPI */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(resumen).map(([estado, cantidad]) => {
          const cfg = ESTADOS[estado];
          const Icon = cfg.icon;
          const porcentaje = alumnosVisibles.length > 0 ? Math.round((cantidad / alumnosVisibles.length) * 100) : 0;

          return (
            <Grid item xs={6} sm={3} key={estado}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: cfg.background,
                  borderRadius: "16px",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifySpaceBetween: "space-between",
                  gap: 1.5,
                  border: "1px solid",
                  borderColor: `${cfg.color}1E`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(0,0,0,0.05)" },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <Icon sx={{ color: cfg.color, fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: cfg.color, lineHeight: 1.1 }}>
                    {cantidad}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.3 }}>
                    <Typography sx={{ color: cfg.color, fontSize: "0.75rem", fontWeight: 700, opacity: 0.9 }}>
                      {estado}
                    </Typography>
                    <Typography sx={{ color: cfg.color, fontSize: "0.7rem", fontWeight: 600, opacity: 0.6 }}>
                      {porcentaje}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Filtros de Control */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fecha de registro"
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setGuardado(false);
              }}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
              <InputLabel>Filtrar por Salón</InputLabel>
              <Select value={salon} label="Filtrar por Salón" onChange={(e) => setSalon(e.target.value)}>
                <MenuItem value="TODOS">Todos los salones</MenuItem>
                {salonesProfesor.map((nombreSalon) => (
                  <MenuItem key={nombreSalon} value={nombreSalon}>
                    Salón {nombreSalon}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              placeholder="Buscar alumno..."
              size="small"
              fullWidth
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: COLORS.slate, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Listado Principal de Alumnos */}
      <Card
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: COLORS.navy }}>
              Listado de Estudiantes
            </Typography>
            <Chip label={`${alumnosVisibles.length} en total`} size="small" sx={{ fontWeight: 700, fontSize: "0.75rem" }} />
          </Box>
        }
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Marcar todos como Presentes">
              <Button size="small" variant="outline" onClick={() => marcarTodos("Presente")} startIcon={<DoneAllRoundedIcon />}>
                Todos Presentes
              </Button>
            </Tooltip>
            <Tooltip title="Reiniciar a Pendientes">
              <IconButton size="small" onClick={() => marcarTodos("Pendiente")} sx={{ color: COLORS.slate }}>
                <RestartAltRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          {grupos.map(([nombreSalon, lista]) => (
            <Box key={nombreSalon}>
              {salon === "TODOS" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: COLORS.slate, letterSpacing: 0.8 }}>
                    AULA / SALÓN {nombreSalon}
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", backgroundColor: COLORS.border }} />
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {lista.map((alumno) => {
                  const estado = obtenerEstado(alumno);
                  return (
                    <Paper
                      key={`${alumno.salon}-${alumno.nombre}`}
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        p: 1.5,
                        border: "1px solid",
                        borderColor: estado !== "Pendiente" ? `${ESTADOS[estado].color}33` : COLORS.border,
                        borderRadius: "12px",
                        backgroundColor: "#FFFFFF",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": { boxShadow: "0 4px 12px rgba(15,23,42,0.05)" },
                      }}
                    >
                      {/* Avatar e Identificación del Alumno */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            bgcolor: colorPorNombre(alumno.nombre),
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          {iniciales(alumno.nombre)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: COLORS.navy,
                              fontSize: "0.9rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {alumno.nombre}
                          </Typography>
                          <Typography sx={{ color: COLORS.slate, fontSize: "0.72rem", fontWeight: 500 }}>
                            {alumno.salon} · {estado === "Pendiente" ? "Estado no registrado" : estado}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Botones Interactivos de Estado (Selector tipo Segmented Control) */}
                      <Box sx={{ display: "flex", gap: 0.8, backgroundColor: "#F8FAFC", p: 0.5, borderRadius: "10px" }}>
                        {Object.keys(ESTADOS)
                          .filter((opc) => opc !== "Pendiente")
                          .map((opcion) => {
                            const activo = estado === opcion;
                            const cfg = ESTADOS[opcion];
                            const IconoBtn = cfg.icon;

                            return (
                              <Tooltip key={opcion} title={`Marcar ${opcion}`}>
                                <Box
                                  onClick={() => cambiarEstado(alumno, opcion)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    px: 1.5,
                                    py: 0.6,
                                    borderRadius: "7px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    color: activo ? "#FFFFFF" : cfg.color,
                                    backgroundColor: activo ? cfg.activeBg : "transparent",
                                    transition: "all 0.15s ease",
                                    "&:hover": {
                                      backgroundColor: activo ? cfg.activeBg : cfg.background,
                                    },
                                  }}
                                >
                                  <IconoBtn sx={{ fontSize: 15 }} />
                                  {opcion}
                                </Box>
                              </Tooltip>
                            );
                          })}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          ))}

          {alumnosVisibles.length === 0 && (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
                No se encontraron alumnos con los criterios seleccionados.
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}