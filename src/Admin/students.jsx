import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Grid,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
  InputAdornment,
  Chip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import StatCard from "../componentes/admin/StatCardProfesor";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import Input from "../componentes/ui/Input";
import Loader from "../componentes/ui/Loader";
import Modal from "../componentes/ui/Modal";
import StudentForm from "../componentes/students/StudentForm";
import RecentStudents from "../componentes/dashboard/RecentStudents";
import { useAuth } from "../hooks/useAuth";
import { apiAdmin as api } from "../utils/apiAdmin";
import { COLORS } from "../utils/constants";

// Paleta de colores dinámica para avatares
const AVATAR_COLORS = ["#0284C7", "#7C3AED", "#059669", "#D97706", "#DB2777", "#4F46E5"];

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function StudentCard({ nombre, salon, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const avatarColor = useMemo(() => stringToColor(nombre), [nombre]);
  const iniciales = useMemo(() => {
    return nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase();
  }, [nombre]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: { xs: 1.5, sm: 2 },
        borderRadius: "14px",
        backgroundColor: "#FFFFFF",
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: { sm: "translateY(-2px)" },
          boxShadow: "0 8px 16px -4px rgba(0,0,0,0.06)",
          borderColor: COLORS.blue,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <Avatar
          sx={{
            width: { xs: 38, sm: 44 },
            height: { xs: 38, sm: 44 },
            bgcolor: avatarColor,
            fontSize: { xs: "0.8rem", sm: "0.88rem" },
            fontWeight: 800,
            boxShadow: `0 2px 8px ${avatarColor}35`,
            flexShrink: 0,
          }}
        >
          {iniciales}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: COLORS.navy,
              fontWeight: 700,
              fontSize: { xs: "0.82rem", sm: "0.88rem" },
              lineHeight: 1.3,
            }}
            noWrap
          >
            {nombre}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
            <SchoolRoundedIcon sx={{ fontSize: 13, color: COLORS.slate }} />
            <Typography sx={{ color: COLORS.slate, fontSize: "0.72rem", fontWeight: 500 }}>
              Salón {salon}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            color: COLORS.slate,
            "&:hover": { backgroundColor: COLORS.blueSoft, color: COLORS.blue },
          }}
        >
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "10px",
              minWidth: 140,
              border: `1px solid ${COLORS.border}`,
            },
          }}
        >
          <MenuItem onClick={handleClose} sx={{ fontSize: "0.8rem", color: COLORS.navy }}>
            <ListItemIcon><VisibilityRoundedIcon fontSize="small" sx={{ color: COLORS.slate }} /></ListItemIcon>
            Ver Detalle
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ fontSize: "0.8rem", color: COLORS.navy }}>
            <ListItemIcon><EditRoundedIcon fontSize="small" sx={{ color: COLORS.slate }} /></ListItemIcon>
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              if (onDelete) onDelete(nombre);
            }}
            sx={{ fontSize: "0.8rem", color: "#EF4444" }}
          >
            <ListItemIcon><DeleteOutlineRoundedIcon fontSize="small" sx={{ color: "#EF4444" }} /></ListItemIcon>
            Eliminar
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default function Students() {
  const { user } = useAuth();

  const [config, setConfig] = useState(null);
  const [salon, setSalon] = useState("");
  const [search, setSearch] = useState("");

  const [alumnos, setAlumnos] = useState([]);
  const [alumnosPorSalon, setAlumnosPorSalon] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ alumno: "", salon: "", tutor: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getConfig(user?.profesor)
      .then((res) => {
        setConfig(res);
        if (res.salones?.length) setSalon(res.salones[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingConfig(false));
  }, [user]);

  useEffect(() => {
    api
      .getAlumnosPorSalon()
      .then((res) => setAlumnosPorSalon(res.salones || {}))
      .catch((err) => setError(err.message));
  }, []);

  const cargarAlumnos = () => {
    if (!salon) return;
    setLoadingAlumnos(true);
    setError("");
    api
      .getAlumnos(salon, "")
      .then((res) => setAlumnos(res.alumnos || []))
      .catch((err) => {
        setAlumnos([]);
        setError(err.message);
      })
      .finally(() => setLoadingAlumnos(false));
  };

  useEffect(cargarAlumnos, [salon]);

  const filtrados = useMemo(
    () => alumnos.filter((a) => a.toLowerCase().includes(search.toLowerCase())),
    [alumnos, search]
  );

  const totalAlumnos = useMemo(
    () => (config?.salones || []).reduce((t, s) => t + (alumnosPorSalon[s]?.length || 0), 0),
    [config, alumnosPorSalon]
  );

  const abrirModal = () => {
    setForm({ alumno: "", salon, tutor: "" });
    setModalOpen(true);
  };

  const guardarAlumno = async () => {
    if (!form.alumno.trim() || !form.salon.trim()) {
      setError("Nombre y salón son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.agregarAlumno(form.alumno, form.salon, form.tutor);
      setToast(res.mensaje || "Alumno agregado con éxito.");
      setModalOpen(false);
      setAlumnosPorSalon((prev) => ({
        ...prev,
        [form.salon]: [...(prev[form.salon] || []), form.alumno.trim()],
      }));
      if (form.salon === salon) cargarAlumnos();
    } catch (err) {
      setError(err.message || "Error al agregar el alumno.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig) return <Loader label="Cargando panel de alumnos..." />;

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: { xs: 2.5, lg: 3 } }}>
      {/* Columna Principal */}
      <Box sx={{ flex: 2, minWidth: 0 }}>
        {/* Encabezado Responsivo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.5rem" }, color: COLORS.navy }}>
              Gestión de Alumnos
            </Typography>
            <Typography sx={{ color: COLORS.slate, fontSize: "0.85rem", mt: 0.2 }}>
              Administra los estudiantes inscritos según sus salones asignados.
            </Typography>
          </Box>
          <Button
            startIcon={<AddRoundedIcon />}
            onClick={abrirModal}
            fullWidth={false}
            sx={{
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              fontWeight: 700,
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            Agregar alumno
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Tarjetas de Métricas Responsivas */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4}>
            <StatCard label="En este salón" value={alumnos.length} icon={GroupRoundedIcon} color={COLORS.blue} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <StatCard label="Total General" value={totalAlumnos} icon={PersonAddAlt1RoundedIcon} color="#7C3AED" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Salones Activos" value={config?.salones?.length ?? 0} icon={ApartmentRoundedIcon} color="#0369A1" />
          </Grid>
        </Grid>

        {/* Barra de Filtros y Salones */}
        <Box
          sx={{
            p: 1.5,
            mb: 3,
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Scroll horizontal fluido para salones en móviles */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: { xs: 0.5, md: 0 },
              "::-webkit-scrollbar": { display: "none" },
            }}
          >
            {(config?.salones || []).map((s) => {
              const activo = s === salon;
              const count = alumnosPorSalon[s]?.length || 0;
              return (
                <Box
                  key={s}
                  onClick={() => setSalon(s)}
                  sx={{
                    px: 1.8,
                    py: 0.8,
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: activo ? COLORS.blue : "#F8FAFC",
                    color: activo ? "#FFFFFF" : COLORS.slate,
                    border: `1px solid ${activo ? COLORS.blue : COLORS.border}`,
                  }}
                >
                  <span>Salón {s}</span>
                  <Box
                    sx={{
                      fontSize: "0.68rem",
                      px: 0.8,
                      py: 0.1,
                      borderRadius: "6px",
                      backgroundColor: activo ? "rgba(255,255,255,0.2)" : "#E2E8F0",
                      color: activo ? "#FFFFFF" : COLORS.navy,
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", md: 240 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: COLORS.slate }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tarjeta Contenedora de Lista */}
        <Card title={`Salón ${salon}`} subtitle={`${filtrados.length} alumno(s)`}>
          {loadingAlumnos ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant="rounded" height={68} sx={{ borderRadius: "14px" }} />
                </Grid>
              ))}
            </Grid>
          ) : filtrados.length ? (
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {filtrados.map((nombre) => (
                <Grid item xs={12} sm={6} key={nombre}>
                  <StudentCard nombre={nombre} salon={salon} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 5, px: 2 }}>
              <SchoolRoundedIcon sx={{ fontSize: 42, color: "#CBD5E1", mb: 1 }} />
              <Typography sx={{ color: COLORS.navy, fontWeight: 700, fontSize: "0.9rem" }}>
                Sin resultados
              </Typography>
              <Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", mt: 0.3 }}>
                {search ? "Prueba cambiando el texto de búsqueda." : "Aún no hay alumnos registrados aquí."}
              </Typography>
            </Box>
          )}
        </Card>
      </Box>

      {/* Columna Lateral (Abajo en celular, al lado en escritorio) */}
      <Box sx={{ flex: 1, minWidth: { lg: 300 } }}>
        <Card title="Alumnos Recientes" subtitle="Últimas altas">
          <RecentStudents alumnosPorSalon={alumnosPorSalon} limite={6} />
        </Card>
      </Box>

      {/* Modal Agregar Alumno */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Nuevo Alumno"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button loading={saving} onClick={guardarAlumno}>
              Guardar
            </Button>
          </>
        }
      >
        <StudentForm value={form} onChange={setForm} />
      </Modal>

      {/* Toast Notificación */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}