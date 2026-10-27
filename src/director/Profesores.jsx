import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Divider,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { apiDirector } from "../utils/apiDirector";

export default function Profesores() {
  const [profesoresList, setProfesoresList] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [newCursoName, setNewCursoName] = useState("");
  const [newProfesorOpen, setNewProfesorOpen] = useState(false);
  const [newProfesor, setNewProfesor] = useState({ nombre: "", email: "", aula: "", cursos: [] });
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");

  // Todo viene de la base de datos
  useEffect(() => {
    Promise.all([apiDirector.profesores(), apiDirector.aulas(), apiDirector.cursos()])
      .then(([p, a, c]) => {
        setProfesoresList(p.profesores || []);
        setAulas(Object.keys(a.aulas || {}));
        setCursosDisponibles((c.cursos || []).map((x) => x.nombre));
      })
      .catch((err) => setError(err.message));
  }, []);

  // Agregar / quitar un curso de un profesor (se guarda en la BD)
  const actualizarCursos = async (curso, accion) => {
    if (!selectedProfesor) return;
    try {
      const res = await apiDirector.profesorCurso(selectedProfesor.id, curso, accion);
      setProfesoresList(res.profesores);
      setSelectedProfesor(res.profesores.find((p) => p.id === selectedProfesor.id) || null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCurso = async () => {
    if (!newCursoName.trim()) return;
    await actualizarCursos(newCursoName.trim(), "add");
    setNewCursoName("");
  };

  const handleRemoveCurso = (cursoToRemove) => actualizarCursos(cursoToRemove, "remove");

  const handleOpenNewProfesor = () => {
    setFormError("");
    setNewProfesor({ nombre: "", email: "", aula: "", cursos: [] });
    setNewProfesorOpen(true);
  };

  // Crea el profesor en la base de datos (usuario = correo, clave inicial profesor2026)
  const handleCreateProfesor = async () => {
    const nombre = newProfesor.nombre.trim();
    const email = newProfesor.email.trim();
    if (!nombre || !email || !newProfesor.aula) {
      setFormError("Completa el nombre, correo institucional y aula.");
      return;
    }
    try {
      const res = await apiDirector.agregarProfesor({ nombre, email, aula: newProfesor.aula, cursos: newProfesor.cursos });
      setProfesoresList(res.profesores);
      setNewProfesorOpen(false);
      window.alert(res.mensaje);
    } catch (err) {
      setFormError(err.message || "No se pudo guardar el profesor.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      
      {error && <Typography sx={{ color: "#DC2626", mb: 2 }}>{error}</Typography>}
      {/* ── HEADER PRINCIPAL Y ACCIONES ── */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2 }}>
        <Box>
          <Chip
            label="Equipo Académico"
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
            Directorio de Docentes
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.95rem", mt: 0.5 }}>
            Gestión en tiempo real de carga lectiva y asignación de cursos.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenNewProfesor}
          sx={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            borderRadius: "12px",
            textTransform: "none",
            boxShadow: "0px 4px 14px rgba(37, 99, 235, 0.25)",
            "&:hover": { backgroundColor: "#1D4ED8" }
          }}
        >
          Nuevo Profesor
        </Button>
      </Box>

      {/* ── GRID DE DOCENTES ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          gap: 3
        }}
      >
        {profesoresList.map((profesor) => {
          const numCursos = profesor.cursos?.length || 0;
          const porcentajeCarga = Math.min((numCursos / 5) * 100, 100); // 5 cursos max simulados
          const esActivo = profesor.estado === "Activo" || profesor.estado === "En clase";

          return (
            <Box
              key={profesor.id}
              onClick={() => setSelectedProfesor(profesor)}
              sx={{
                borderRadius: "16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2.5,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.08)",
                  borderColor: "#2563EB"
                }
              }}
            >
              <Box>
                {/* TARJETA HEADER */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: esActivo ? "#10B981" : "#94A3B8",
                            border: "2px solid #FFFFFF"
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                          fontWeight: 800,
                          fontSize: "1rem",
                          border: "2px solid #DBEAFE"
                        }}
                      >
                        {profesor.iniciales}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography sx={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem" }}>
                        {profesor.nombre}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4 }}>
                        <MeetingRoomOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                        <Typography sx={{ color: "#64748B", fontSize: "0.78rem", fontWeight: 600 }}>
                          Aula {profesor.aula}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedProfesor(profesor); }}>
                    <MoreVertIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                  </IconButton>
                </Box>

                {/* BARRA DE CARGA LECTIVA */}
                <Box sx={{ my: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.4 }}>
                      <AccessTimeIcon sx={{ fontSize: 13 }} /> Carga lectiva
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "#0F172A", fontWeight: 700 }}>
                      {numCursos * 4} hrs/sem
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={porcentajeCarga}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: "#F1F5F9",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: porcentajeCarga > 80 ? "#F59E0B" : "#2563EB"
                      }
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />

                {/* LISTADO DE PILLS / CURSOS */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#475569", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", mb: 1 }}>
                    Cursos Asignados ({numCursos})
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                    {profesor.cursos && profesor.cursos.length > 0 ? (
                      profesor.cursos.map((curso) => (
                        <Chip
                          key={curso}
                          label={curso}
                          size="small"
                          sx={{
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            color: "#0F172A",
                            fontWeight: 600,
                            fontSize: "0.73rem",
                            borderRadius: "8px"
                          }}
                        />
                      ))
                    ) : (
                      <Typography sx={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                        Sin asignaciones
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* FOOTER ACCIONES */}
              <Box sx={{ pt: 1.5, borderTop: "1px solid #F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Chip
                  label={profesor.estado || "Activo"}
                  size="small"
                  sx={{
                    color: esActivo ? "#0D9488" : "#64748B",
                    backgroundColor: esActivo ? "#CCFBF1" : "#F1F5F9",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    borderRadius: "6px"
                  }}
                />

                <Typography sx={{ color: "#2563EB", fontSize: "0.75rem", fontWeight: 700 }}>
                  Gestionar →
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ── MODAL DE DETALLE Y EDICIÓN RÁPIDA ── */}
      <Dialog
        open={Boolean(selectedProfesor)}
        onClose={() => setSelectedProfesor(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 }
        }}
      >
        {selectedProfesor && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Detalles del Profesor
              </Typography>
              <IconButton size="small" onClick={() => setSelectedProfesor(null)}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 1.5,
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    fontWeight: 800,
                    fontSize: "1.3rem"
                  }}
                >
                  {selectedProfesor.iniciales}
                </Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#0F172A" }}>
                  {selectedProfesor.nombre}
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", color: "#64748B" }}>
                  Aula Principal: Aula {selectedProfesor.aula}
                </Typography>
              </Box>

              {/* GESTIÓN DE CURSOS DINÁMICA */}
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A", mb: 1 }}>
                Asignaturas asignadas ({selectedProfesor.cursos?.length || 0}):
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 3 }}>
                {selectedProfesor.cursos?.map((curso) => (
                  <Chip
                    key={curso}
                    label={curso}
                    onDelete={() => handleRemoveCurso(curso)}
                    size="small"
                    sx={{
                      backgroundColor: "#EFF6FF",
                      color: "#1E40AF",
                      fontWeight: 600
                    }}
                  />
                ))}
              </Box>

              {/* INPUT PARA AGREGAR NUEVO CURSO */}
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748B", mb: 0.8 }}>
                Asignar nuevo curso a este docente:
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Ej. Física II"
                  value={newCursoName}
                  onChange={(e) => setNewCursoName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddCurso}
                  sx={{
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    borderRadius: "10px",
                    textTransform: "none"
                  }}
                >
                  Añadir
                </Button>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EmailOutlinedIcon />}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#E2E8F0",
                  color: "#0F172A",
                  fontWeight: 700,
                  textTransform: "none"
                }}
              >
                Enviar correo institucional
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={newProfesorOpen}
        onClose={() => setNewProfesorOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Registrar nuevo profesor</DialogTitle>
        <DialogContent dividers>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Nombre completo"
              value={newProfesor.nombre}
              onChange={(event) => setNewProfesor({ ...newProfesor, nombre: event.target.value })}
              autoFocus
              required
            />
            <TextField
              label="Correo institucional"
              type="email"
              value={newProfesor.email}
              onChange={(event) => setNewProfesor({ ...newProfesor, email: event.target.value })}
              required
            />
            <FormControl required>
              <InputLabel id="nuevo-profesor-aula-label">Aula principal</InputLabel>
              <Select
                labelId="nuevo-profesor-aula-label"
                label="Aula principal"
                value={newProfesor.aula}
                onChange={(event) => setNewProfesor({ ...newProfesor, aula: event.target.value })}
              >
                {aulas.map((aula) => (
                  <MenuItem key={aula} value={aula}>Aula {aula}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="nuevo-profesor-cursos-label">Cursos asignados</InputLabel>
              <Select
                labelId="nuevo-profesor-cursos-label"
                label="Cursos asignados"
                multiple
                value={newProfesor.cursos}
                onChange={(event) => setNewProfesor({ ...newProfesor, cursos: event.target.value })}
                renderValue={(selected) => selected.join(", ")}
              >
                {cursosDisponibles.map((nombreCurso) => (
                  <MenuItem key={nombreCurso} value={nombreCurso}>{nombreCurso}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNewProfesorOpen(false)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateProfesor} sx={{ textTransform: "none" }}>
            Guardar profesor
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}