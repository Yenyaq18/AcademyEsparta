import { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Chip,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { COLORS } from "../../utils/constants";
import { apiAdmin } from "../../utils/apiAdmin";
import { useAuth } from "../../hooks/useAuth";
import { useAlumnosPorSalon } from "../../hooks/useAlumnosPorSalon";

const PALETA = [
  { color: "#0284C7", fondo: "#E0F2FE" },
  { color: "#16A34A", fondo: "#DCFCE7" },
  { color: "#E11D48", fondo: "#FFE4E6" },
  { color: "#7C3AED", fondo: "#EDE9FE" },
  { color: "#B45309", fondo: "#FEF3C7" },
];

const quitarTildes = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

function iconoDe(nombre) {
  const n = quitarTildes(nombre);
  if (/(ALGEBRA|ARITMETICA|GEOMETRIA|TRIGONO|FISICA|^RM$|MATEMATICO)/.test(n)) return FunctionsRoundedIcon;
  if (/(QUIMICA|BIOLOGIA)/.test(n)) return ScienceRoundedIcon;
  if (/INGLES/.test(n)) return TranslateRoundedIcon;
  return MenuBookRoundedIcon;
}

const aFecha = (ddmmyyyy) => {
  const [d, m, y] = String(ddmmyyyy || "").split("/").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export default function Cursos() {
  const { user } = useAuth();
  const { salones: alumnosPorSalon } = useAlumnosPorSalon();
  const [config, setConfig] = useState({ cursos: [], salones: [], bimestres: [] });

  useEffect(() => {
    apiAdmin
      .getConfig(user?.profesor)
      .then((res) => setConfig({ cursos: res.cursos || [], salones: res.salones || [], bimestres: res.bimestres || [] }))
      .catch(() => {});
  }, [user]);

  // Avance = porcentaje transcurrido del bimestre habilitado
  const avanceBimestre = useMemo(() => {
    const b = config.bimestres.find((x) => x.habilitado);
    if (!b) return 0;
    const ini = aFecha(b.inicio).getTime();
    const fin = aFecha(b.fin).getTime();
    return Math.max(0, Math.min(100, Math.round(((Date.now() - ini) / (fin - ini)) * 100)));
  }, [config]);

  // Catálogo = los cursos reales del profesor (tabla profesor_curso)
  const CAT_CURSOS = useMemo(
    () => config.cursos.map((nombre, i) => ({ nombre, icon: iconoDe(nombre), ...PALETA[i % PALETA.length], avance: avanceBimestre })),
    [config, avanceBimestre]
  );
  const [busqueda, setBusqueda] = useState("");
  const [filtroTab, setFiltroTab] = useState("TODOS");
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Almacena una lista/arreglo de PDFs por cada curso: { "Matemática": [ { nombre, fileUrl }, ... ] }
  const [archivosPdfCargados, setArchivosPdfCargados] = useState({});

  const [mensajeNotif, setMensajeNotif] = useState({ open: false, texto: "", tipo: "success" });
  const fileInputRef = useRef(null);

  const totalAlumnos = Object.values(alumnosPorSalon).reduce(
    (total, alumnos) => total + alumnos.length,
    0
  );

  // Abrir el explorador de archivos
  const abrirExploradorPDF = (nombreCurso) => {
    setCursoSeleccionado(nombreCurso);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Manejar la carga de múltiples archivos seleccionados desde el escritorio
  const manejarSubidaPDF = (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    const pdfsValidos = archivos.filter((a) => a.type === "application/pdf");

    if (pdfsValidos.length === 0) {
      setMensajeNotif({
        open: true,
        texto: "Por favor, selecciona archivos que sean de formato PDF.",
        tipo: "error",
      });
      return;
    }

    // Crear objetos con URL local para permitir la descarga posterior
    const nuevosPdfs = pdfsValidos.map((archivo) => ({
      nombre: archivo.name,
      fileUrl: URL.createObjectURL(archivo),
      tamano: (archivo.size / 1024 / 1024).toFixed(2) + " MB",
    }));

    setArchivosPdfCargados((prev) => ({
      ...prev,
      [cursoSeleccionado]: [...(prev[cursoSeleccionado] || []), ...nuevosPdfs],
    }));

    setMensajeNotif({
      open: true,
      texto: `¡Se agregaron ${nuevosPdfs.length} PDF(s) a ${cursoSeleccionado}!`,
      tipo: "success",
    });
  };

  // Función para descargar el archivo nuevamente al escritorio
  const descargarPDF = (pdfObj) => {
    const link = document.createElement("a");
    link.href = pdfObj.fileUrl;
    link.download = pdfObj.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para eliminar un PDF específico
  const eliminarPDF = (nombreCurso, indiceEliminar) => {
    setArchivosPdfCargados((prev) => ({
      ...prev,
      [nombreCurso]: prev[nombreCurso].filter((_, index) => index !== indiceEliminar),
    }));
  };

  const cursosFiltrados = CAT_CURSOS.filter((curso) => {
    const asignado = true;
    const coincideNombre = curso.nombre.toLowerCase().includes(busqueda.toLowerCase());

    if (filtroTab === "ASIGNADOS") return asignado && coincideNombre;
    if (filtroTab === "DISPONIBLES") return !asignado && coincideNombre;
    return coincideNombre;
  });

  return (
    <Box>
      {/* Input con propiedad "multiple" activada */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={manejarSubidaPDF}
        accept="application/pdf"
        multiple
        style={{ display: "none" }}
      />

      {/* Encabezado */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
            Gestión de Cursos
          </Typography>
          <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
            Sube múltiples archivos PDF por curso y vuelve a descargarlos en cualquier momento.
          </Typography>
        </Box>
        <Button
          startIcon={<PictureAsPdfRoundedIcon />}
          onClick={() => abrirExploradorPDF("General")}
        >
          Cargar PDF General
        </Button>
      </Box>

      {/* Métricas Globales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: "#EFF6FF", borderRadius: "12px", color: COLORS.blue }}>
              <MenuBookRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate, fontWeight: 700 }}>CURSOS A CARGO</Typography>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: COLORS.navy }}>{config.cursos.length} Cursos</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: "#F0FDF4", borderRadius: "12px", color: "#16A34A" }}>
              <GroupRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate, fontWeight: 700 }}>TOTAL ALUMNOS</Typography>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: COLORS.navy }}>{totalAlumnos} Estudiantes</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: "#FFE4E6", borderRadius: "12px", color: "#E11D48" }}>
              <RoomRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate, fontWeight: 700 }}>AULAS / SALONES</Typography>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: COLORS.navy }}>{config.salones.length} Secciones</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Barra de Filtros */}
      <Card sx={{ mb: 3, p: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Tabs value={filtroTab} onChange={(_, val) => setFiltroTab(val)} sx={{ minHeight: 40, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 40 } }}>
            <Tab label="Todos" value="TODOS" />
            <Tab label="Mis Cursos" value="ASIGNADOS" />
            <Tab label="Disponibles" value="DISPONIBLES" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 20, color: COLORS.slate }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 240 } }}
          />
        </Box>
      </Card>

      {/* Grilla de Cursos */}
      <Grid container spacing={2}>
        {cursosFiltrados.map((curso, index) => {
          const Icon = curso.icon;
          const asignado = true;
          const listaPdfs = archivosPdfCargados[curso.nombre] || [];

          return (
            <Grid item xs={12} sm={6} lg={4} key={curso.nombre}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Encabezado Tarjeta */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        backgroundColor: curso.fondo,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon sx={{ color: curso.color, fontSize: 26 }} />
                    </Box>
                    <Chip
                      label={asignado ? "Asignado" : "Disponible"}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        backgroundColor: asignado ? "#DCFCE7" : "#F1F5F9",
                        color: asignado ? "#15803D" : "#64748B",
                      }}
                    />
                  </Box>

                  {/* Detalle del Curso */}
                  <Box>
                    <Typography sx={{ color: COLORS.navy, fontWeight: 800, fontSize: "1.1rem", mb: 0.5 }}>
                      {curso.nombre}
                    </Typography>
                    <Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", mb: 1.5 }}>
                      {asignado ? "Dictado activo durante este periodo académico." : "Curso de malla curricular general."}
                    </Typography>

                    {/* Lista de PDFs subidos con acciones (Descargar / Eliminar) */}
                    {listaPdfs.length > 0 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2, maxHeight: 160, overflowY: "auto" }}>
                        <Typography sx={{ fontSize: "0.7rem", color: COLORS.slate, fontWeight: 700, textTransform: "uppercase" }}>
                          Archivos Adjuntos ({listaPdfs.length}):
                        </Typography>
                        {listaPdfs.map((pdf, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 1,
                              bgcolor: "#FEF2F2",
                              border: "1px solid #FECACA",
                              borderRadius: "8px",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
                              <PictureAsPdfRoundedIcon sx={{ color: "#DC2626", fontSize: 18 }} />
                              <Box sx={{ overflow: "hidden" }}>
                                <Typography sx={{ fontSize: "0.75rem", color: "#991B1B", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {pdf.nombre}
                                </Typography>
                                <Typography sx={{ fontSize: "0.65rem", color: "#B91C1C" }}>
                                  {pdf.tamano}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Acciones por archivo */}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Tooltip title="Descargar PDF a tu equipo">
                                <IconButton size="small" onClick={() => descargarPDF(pdf)}>
                                  <DownloadRoundedIcon sx={{ fontSize: 16, color: "#991B1B" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar archivo">
                                <IconButton size="small" onClick={() => eliminarPDF(curso.nombre, idx)}>
                                  <DeleteOutlineRoundedIcon sx={{ fontSize: 16, color: "#991B1B" }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Progreso del Curso */}
                    {asignado && (
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography sx={{ fontSize: "0.72rem", color: COLORS.slate, fontWeight: 700 }}>Avance del bimestre</Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: COLORS.navy, fontWeight: 800 }}>{curso.avance}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={curso.avance} sx={{ height: 6, borderRadius: 3, bgcolor: "#F1F5F9", "& .MuiLinearProgress-bar": { bgcolor: curso.color } }} />
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Pie de Tarjeta */}
                <Box sx={{ pt: 2, mt: 2, borderTop: `1px solid ${COLORS.border}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <GroupRoundedIcon sx={{ color: COLORS.slate, fontSize: 16 }} />
                      <Typography sx={{ color: COLORS.slate, fontSize: "0.75rem", fontWeight: 600 }}>
                        {asignado ? totalAlumnos : 0} alumnos
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <RoomRoundedIcon sx={{ color: COLORS.slate, fontSize: 16 }} />
                      <Typography sx={{ color: COLORS.slate, fontSize: "0.75rem", fontWeight: 600 }}>
                        {asignado ? config.salones.length : 0} salones
                      </Typography>
                    </Box>
                  </Box>

                  {/* Acciones principales */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PictureAsPdfRoundedIcon sx={{ color: "#E11D48" }} />}
                      disabled={!asignado}
                      onClick={() => abrirExploradorPDF(curso.nombre)}
                      sx={{ flex: 1, fontSize: "0.75rem", textTransform: "none" }}
                    >
                      Subir PDFs
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Notificación flotante */}
      <Snackbar
        open={mensajeNotif.open}
        autoHideDuration={4000}
        onClose={() => setMensajeNotif((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={mensajeNotif.tipo} onClose={() => setMensajeNotif((prev) => ({ ...prev, open: false }))}>
          {mensajeNotif.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
}