import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import { Link } from "react-router-dom";
import { apiDirector } from "../utils/apiDirector";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [error, setError] = useState("");

  const cargar = () =>
    Promise.all([apiDirector.cursos(), apiDirector.profesores()])
      .then(([c, p]) => {
        setCursos(c.cursos || []);
        setProfesores(p.profesores || []);
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    cargar();
  }, []);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("TODAS");

  // Modal para editar/reasignar curso
  const [cursoAEditar, setCursoAEditar] = useState(null);
  const [profesorEditId, setProfesorEditId] = useState("");
  const [horasEdit, setHorasEdit] = useState("");

  // Obtener la lista única de Áreas Académicas para los Tabs
  const areasDisponibles = useMemo(() => {
    const areas = cursos.map((c) => c.area).filter(Boolean);
    return ["TODAS", ...Array.from(new Set(areas))];
  }, [cursos]);

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado((actual) => (actual?.id === curso.id ? null : curso));
  };

  // Filtrado compuesto (Search + Tab de Áreas)
  const cursosFiltrados = cursos.filter((curso) => {
    const coincideSearch =
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.area?.toLowerCase().includes(searchTerm.toLowerCase());

    if (areaFilter === "TODAS") return coincideSearch;
    return coincideSearch && curso.area === areaFilter;
  });

  // Abrir Modal de Edición
  const handleOpenEdit = (event, curso, profesor) => {
    event.stopPropagation();
    setCursoAEditar(curso);
    setProfesorEditId(profesor ? profesor.id : "");
    setHorasEdit(curso.horas || 4);
  };

  // Guardar Edición del Curso
  const handleSaveCurso = async () => {
    if (!cursoAEditar) return;
    try {
      await apiDirector.guardarCurso(cursoAEditar.id, Number(horasEdit), cursoAEditar.area, profesorEditId || 0);
      await cargar();
      setCursoAEditar(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      
      {error && <Typography sx={{ color: "#DC2626", mb: 2 }}>{error}</Typography>}
      {/* ── HEADER PRINCIPAL ── */}
      <Box 
        sx={{ 
          mb: 4, 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", md: "center" }, 
          gap: 2 
        }}
      >
        <Box>
          <Chip
            label="Plan Académico"
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
            Gestión de Cursos y Horarios
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.95rem", mt: 0.5 }}>
            Consulte la intensidad horaria, asignación de docentes y estado de calificaciones.
          </Typography>
        </Box>

      </Box>

      {/* ── FILTROS Y TABS POR ÁREA ── */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", md: "center" }, 
          gap: 2,
          mb: 3.5 
        }}
      >
        <Tabs
          value={areaFilter}
          onChange={(_, newValue) => setAreaFilter(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "40px",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              minHeight: "40px",
              color: "#64748B",
              "&.Mui-selected": { color: "#2563EB" }
            },
            "& .MuiTabs-indicator": { backgroundColor: "#2563EB", height: 3, borderRadius: 1.5 }
          }}
        >
          {areasDisponibles.map((area) => (
            <Tab key={area} label={area === "TODAS" ? "Todas las Áreas" : area} value={area} />
          ))}
        </Tabs>

        <TextField
          placeholder="Buscar asignatura..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", md: 320 },
            backgroundColor: "#FFFFFF",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": { borderColor: "#E2E8F0" },
              "&:hover fieldset": { borderColor: "#CBD5E1" },
              "&.Mui-focused fieldset": { borderColor: "#2563EB" }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* ── GRID DE CURSOS ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" }, gap: 2.5 }}>
        {cursosFiltrados.map((curso) => {
          const profesor = profesores.find((item) => item.cursos?.includes(curso.nombre));
          const seleccionado = cursoSeleccionado?.id === curso.id;
          const maxHorasMaximas = 8; // Referencia máxima para la barra de nivel
          const porcentajeHoras = Math.min(((curso.horas || 2) / maxHorasMaximas) * 100, 100);

          return (
            <Box
              key={curso.id}
              onClick={() => seleccionarCurso(curso)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") seleccionarCurso(curso);
              }}
              tabIndex={0}
              role="button"
              aria-pressed={seleccionado}
              sx={{
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "2px solid",
                borderColor: seleccionado ? "#2563EB" : "#E2E8F0",
                boxShadow: seleccionado 
                  ? "0px 12px 28px rgba(37, 99, 235, 0.12)" 
                  : "0px 4px 20px rgba(0, 0, 0, 0.03)",
                p: 2.5,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.06)",
                  borderColor: seleccionado ? "#2563EB" : "#CBD5E1"
                }
              }}
            >
              {/* HEADER DE LA CARD */}
              <Box sx={{ display: "flex", gap: 1.8, alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1.8, alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.3,
                      borderRadius: "12px",
                      backgroundColor: seleccionado ? "#2563EB" : "#EFF6FF",
                      color: seleccionado ? "#FFFFFF" : "#2563EB",
                      display: "grid",
                      placeItems: "center",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <MenuBookRoundedIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#0F172A", fontWeight: 800, fontSize: "1.05rem" }}>
                      {curso.nombre}
                    </Typography>
                    <Chip
                      label={curso.area}
                      size="small"
                      sx={{
                        backgroundColor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: "20px",
                        mt: 0.5
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Chip
                    label={`${curso.horas} h / sem`}
                    size="small"
                    sx={{
                      backgroundColor: "#EFF6FF",
                      color: "#1E40AF",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      borderRadius: "8px"
                    }}
                  />
                  <Tooltip title="Editar detalles">
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleOpenEdit(e, curso, profesor)}
                      sx={{ ml: 0.5, color: "#94A3B8" }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* INTENSIDAD HORARIA (BARRA VISUAL) */}
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                    Carga Semanal Académica
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "#0F172A", fontWeight: 700 }}>
                    {curso.horas} hrs
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={porcentajeHoras}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: "#F1F5F9",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: seleccionado ? "#2563EB" : "#0D9488"
                    }
                  }}
                />
              </Box>

              {/* SECCIÓN DEL DOCENTE */}
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                {profesor ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Avatar sx={{ width: 34, height: 34, backgroundColor: "#DBEAFE", color: "#1D4ED8", fontWeight: 800, fontSize: "0.8rem" }}>
                      {profesor.iniciales}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem" }}>
                        {profesor.nombre}
                      </Typography>
                      <Typography sx={{ color: "#64748B", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.4 }}>
                        <MeetingRoomOutlinedIcon sx={{ fontSize: 13 }} /> Aula {profesor.aula}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748B" }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, fontStyle: "italic" }}>
                      Sin docente asignado
                    </Typography>
                  </Box>
                )}

                <Chip
                  label={profesor ? "Asignado" : "Pendiente"}
                  size="small"
                  sx={{
                    backgroundColor: profesor ? "#DCFCE7" : "#FEF3C7",
                    color: profesor ? "#15803D" : "#B45309",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: "22px"
                  }}
                />
              </Box>

              {/* ACCIONES Y BOTÓN DE REDIRECCIÓN */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5, pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                <Typography sx={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>
                  {seleccionado ? "● Seleccionado" : "Haga clic para detalles"}
                </Typography>

                <Button
                  component={Link}
                  to={`/director/notas?curso=${encodeURIComponent(curso.nombre)}`}
                  onClick={(e) => e.stopPropagation()}
                  variant={seleccionado ? "contained" : "outlined"}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    px: 2,
                    backgroundColor: seleccionado ? "#0F172A" : "transparent",
                    borderColor: seleccionado ? "#0F172A" : "#CBD5E1",
                    color: seleccionado ? "#FFFFFF" : "#0F172A",
                    "&:hover": {
                      backgroundColor: seleccionado ? "#1E293B" : "#F8FAFC",
                      borderColor: "#0F172A"
                    }
                  }}
                >
                  Ver notas
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* MENSAJE CUANDO NO HAY CURSOS FILTRADOS */}
      {cursosFiltrados.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8, backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px dashed #CBD5E1", mt: 2 }}>
          <Typography sx={{ color: "#64748B", fontWeight: 700 }}>
            No se encontraron asignaturas con los criterios ingresados
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", mt: 0.5 }}>
            Intente buscando otro nombre de curso o seleccione otra área académica.
          </Typography>
        </Box>
      )}

      {/* ── MODAL DE EDICIÓN Y GESTIÓN RÁPIDA ── */}
      <Dialog
        open={Boolean(cursoAEditar)}
        onClose={() => setCursoAEditar(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 }
        }}
      >
        {cursoAEditar && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Editar {cursoAEditar.nombre}
              </Typography>
              <IconButton size="small" onClick={() => setCursoAEditar(null)}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2 }}>
              <TextField
                label="Horas semanales"
                type="number"
                fullWidth
                size="small"
                value={horasEdit}
                onChange={(e) => setHorasEdit(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                }}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Docente Responsable</InputLabel>
                <Select
                  value={profesorEditId}
                  label="Docente Responsable"
                  onChange={(e) => setProfesorEditId(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">
                    <em>Sin asignar</em>
                  </MenuItem>
                  {profesores.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre} (Aula {p.aula})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setCursoAEditar(null)}
                sx={{ color: "#64748B", fontWeight: 700, textTransform: "none" }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveCurso}
                sx={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none"
                }}
              >
                Guardar Cambios
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
}