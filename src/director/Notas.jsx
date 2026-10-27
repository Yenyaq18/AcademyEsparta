import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Paper,
  InputAdornment,
  Button
} from "@mui/material";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";

import { apiAdmin } from "../utils/apiAdmin";
import { apiDirector } from "../utils/apiDirector";
import { useAuth } from "../hooks/useAuth";

const VACIO = { columnas: [], col_indices: [], notas: {} };

export default function Notas() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [bimestres, setBimestres] = useState([]);
  const [aulas, setAulas] = useState({});
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const [bimestreSel, setBimestre] = useState(searchParams.get("bimestre") || "");
  const [aulaSel, setAula] = useState("");
  const [cursoSel, setCurso] = useState(searchParams.get("curso") || "");

  const [data, setData] = useState(VACIO);
  const [cambios, setCambios] = useState({}); // { "alumnoId|evaluacionId": valor }
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");
  const [searchAlumno, setSearchAlumno] = useState("");

  // Control de celda activa para edición rápida sin congelar la app
  const [editandoCelda, setEditandoCelda] = useState(null); // `${alumnoId}-${colIndex}`

  useEffect(() => {
    Promise.all([apiDirector.bimestres(), apiDirector.aulas(), apiDirector.cursos(), apiDirector.profesores()])
      .then(([b, a, c, p]) => {
        setBimestres(b.bimestres || []);
        setAulas(a.aulas || {});
        setCursos(c.cursos || []);
        setProfesores(p.profesores || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  const bimestre = bimestreSel || String(bimestres.find((b) => b.habilitado)?.id || bimestres[0]?.id || "");
  const aula = aulaSel || Object.keys(aulas)[0] || "";
  const curso = cursoSel || cursos[0]?.nombre || "";
  const bimestreActual = bimestres.find((item) => String(item.id) === String(bimestre));
  const profesor = profesores.find((item) => item.cursos?.includes(curso));
  const nombreBimestre = bimestreActual ? bimestreActual.nombre.toUpperCase() : "";

  useEffect(() => {
    if (!nombreBimestre || !aula || !curso) return;

    let isMounted = true;
    apiAdmin
      .getNotasBim(nombreBimestre, aula, curso)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setCambios({});
        }
      })
      .catch((err) => {
        if (isMounted) {
          setData(VACIO);
          setError(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [nombreBimestre, aula, curso]);

  const cargarNotas = useCallback(() => {
    if (!nombreBimestre || !aula || !curso) return;
    apiAdmin
      .getNotasBim(nombreBimestre, aula, curso)
      .then((res) => {
        setData(res);
        setCambios({});
      })
      .catch((err) => {
        setData(VACIO);
        setError(err.message);
      });
  }, [nombreBimestre, aula, curso]);

  const columnas = data.columnas;
  const alumnos = useMemo(() => {
    return (aulas[aula] || []).filter((a) => data.notas && data.notas[a.nombre]);
  }, [aulas, aula, data]);

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) =>
      a.nombre.toLowerCase().includes(searchAlumno.toLowerCase())
    );
  }, [alumnos, searchAlumno]);

  const getValorNota = useCallback((alumnoId, colIndex, nombreAlumno) => {
    const evaluacionId = data.col_indices[colIndex];
    const clave = `${alumnoId}|${evaluacionId}`;
    if (clave in cambios) return cambios[clave];
    const original = data.notas[nombreAlumno]?.[colIndex] ?? "";
    return original === "S.N." ? "" : original;
  }, [cambios, data]);

  const cambiarNota = (alumnoId, columnaIndex, valor) => {
    const evaluacionId = data.col_indices[columnaIndex];
    const numVal = valor === "" ? "" : Math.min(20, Math.max(0, Number(valor)));
    setCambios((actuales) => ({ ...actuales, [`${alumnoId}|${evaluacionId}`]: numVal }));
  };

  const agregarEvaluacion = async () => {
    const tipo = window.prompt("Tipo de evaluación (PC, TAREA, ACTITUD, EXAMEN):", "PC");
    if (!tipo) return;
    const hoy = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const fecha = window.prompt("Fecha (dd/mm/aaaa):", hoy);
    if (!fecha) return;
    try {
      await apiAdmin.guardarNotas(nombreBimestre, aula, curso, user?.usuario, fecha, tipo, []);
      setError("");
      cargarNotas();
    } catch (err) {
      setError(err.message);
    }
  };

  const guardarNotas = async () => {
    const pendientes = Object.entries(cambios);
    if (pendientes.length === 0) {
      setError("No hay cambios pendientes por guardar.");
      return;
    }

    try {
      for (const [clave, valor] of pendientes) {
        const [alumnoId, evaluacionId] = clave.split("|");
        const alumno = alumnos.find((a) => String(a.id) === alumnoId);
        if (!alumno) continue;

        await apiAdmin.editarNota(
          nombreBimestre,
          aula,
          curso,
          alumno.nombre,
          evaluacionId,
          String(valor)
        );
      }
      setError("");
      setCambios({});
      setGuardado(true);
      cargarNotas();
    } catch (err) {
      setError("Error al guardar en la base de datos: " + err.message);
    }
  };

  const getNotaColor = (val) => {
    if (val === "" || val === undefined || isNaN(val)) return { bg: "#FFFFFF", color: "#64748B", border: "#E2E8F0" };
    const num = Number(val);
    if (num < 11) return { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" };
    if (num >= 16) return { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" };
    return { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" };
  };

  return (
    <Box sx={{ maxWidth: 1250, mx: "auto", py: { xs: 2, md: 3 } }}>
      {error && <Typography sx={{ color: "#DC2626", mb: 2 }}>{error}</Typography>}
      
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          mb: 3
        }}
      >
        <Typography sx={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Gestión Académica
        </Typography>
        <Typography component="h1" sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, fontWeight: 800, color: "#0F172A", mt: 0.3 }}>
          Modificación de Notas
        </Typography>
        <Typography sx={{ color: "#475569", mt: 0.5, fontSize: "0.92rem" }}>
          Haz clic en cualquier celda para editar una nota. Los cambios se sincronizarán al guardar.
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          mb: 3
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "#475569", fontWeight: 600 }}>Bimestre</InputLabel>
            <Select
              value={bimestre}
              label="Bimestre"
              onChange={(e) => setBimestre(e.target.value)}
              sx={{ borderRadius: "10px", backgroundColor: "#F8FAFC", color: "#0F172A", fontWeight: 600 }}
            >
              {bimestres.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "#475569", fontWeight: 600 }}>Aula</InputLabel>
            <Select
              value={aula}
              label="Aula"
              onChange={(e) => setAula(e.target.value)}
              sx={{ borderRadius: "10px", backgroundColor: "#F8FAFC", color: "#0F172A", fontWeight: 600 }}
            >
              {Object.keys(aulas).map((nombre) => (
                <MenuItem key={nombre} value={nombre}>
                  Aula {nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "#475569", fontWeight: 600 }}>Curso</InputLabel>
            <Select
              value={curso}
              label="Curso"
              onChange={(e) => setCurso(e.target.value)}
              sx={{ borderRadius: "10px", backgroundColor: "#F8FAFC", color: "#0F172A", fontWeight: 600 }}
            >
              {cursos.map((item) => (
                <MenuItem key={item.id} value={item.nombre}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "16px",
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <Box sx={{ p: 1.2, borderRadius: "10px", backgroundColor: "#E2E8F0", color: "#1E293B", display: "grid", placeItems: "center" }}>
          <ClassRoundedIcon />
        </Box>
        <Box>
          <Typography component="h2" sx={{ color: "#0F172A", fontSize: "1.15rem", fontWeight: 800 }}>
            {curso}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
            <MeetingRoomRoundedIcon sx={{ fontSize: 16 }} />
            {profesor ? `Docente: ${profesor.nombre} · Aula ${aula}` : `Aula ${aula} · Sin docente asignado`}
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2
          }}
        >
          <TextField
            placeholder="Buscar por alumno..."
            size="small"
            value={searchAlumno}
            onChange={(e) => setSearchAlumno(e.target.value)}
            sx={{ width: { xs: "100%", sm: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={agregarEvaluacion}
            variant="outlined"
            sx={{ color: "#334155", borderColor: "#CBD5E1", fontWeight: 700, textTransform: "none", borderRadius: "8px" }}
          >
            Agregar Evaluación
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                <TableCell sx={{ color: "#334155", fontWeight: 800, fontSize: "0.88rem", backgroundColor: "#F8FAFC" }}>Estudiante</TableCell>
                {columnas.map((columna, i) => (
                  <TableCell key={`${columna}-${i}`} align="center" sx={{ color: "#334155", fontWeight: 800, fontSize: "0.88rem", backgroundColor: "#F8FAFC" }}>
                    {columna}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ color: "#334155", fontWeight: 800, fontSize: "0.88rem", backgroundColor: "#F8FAFC" }}>
                  Promedio
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {alumnosFiltrados.map((alumno, index) => {
                const notasFila = columnas.map((_, colIndex) => getValorNota(alumno.id, colIndex, alumno.nombre));
                const numericos = notasFila.map(Number).filter((valor) => Number.isFinite(valor));
                const promedioAlumno = numericos.length
                  ? (numericos.reduce((a, b) => a + b, 0) / numericos.length).toFixed(1)
                  : "--";

                const estiloPromedio = getNotaColor(promedioAlumno);

                return (
                  <TableRow key={alumno.id} sx={{ backgroundColor: index % 2 ? "#FAFAFA" : "#FFFFFF" }}>
                    <TableCell sx={{ color: "#0F172A", fontWeight: 700 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", backgroundColor: "#E2E8F0", color: "#1E293B" }}>
                          {alumno.nombre.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ color: "#0F172A", fontWeight: 600, fontSize: "0.9rem" }}>
                          {alumno.nombre}
                        </Typography>
                      </Box>
                    </TableCell>

                    {columnas.map((columna, columnaIndex) => {
                      const valNota = notasFila[columnaIndex];
                      const notaStyle = getNotaColor(valNota);
                      const cellKey = `${alumno.id}-${columnaIndex}`;
                      const isEditing = editandoCelda === cellKey;

                      return (
                        <TableCell 
                          key={`${columna}-${columnaIndex}`} 
                          align="center"
                          onClick={() => setEditandoCelda(cellKey)}
                          sx={{ 
                            cursor: "pointer", 
                            backgroundColor: notaStyle.bg,
                            border: `1px solid ${notaStyle.border}`,
                            p: 1,
                            minWidth: 65
                          }}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              type="number"
                              value={valNota}
                              onChange={(e) => cambiarNota(alumno.id, columnaIndex, e.target.value)}
                              onBlur={() => setEditandoCelda(null)}
                              onKeyDown={(e) => { if (e.key === "Enter") setEditandoCelda(null); }}
                              style={{
                                width: "50px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.9rem",
                                border: "1px solid #0F172A",
                                borderRadius: "4px",
                                padding: "4px",
                                background: "#FFFFFF",
                                color: "#0F172A"
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontWeight: 800, color: notaStyle.color, fontSize: "0.9rem" }}>
                              {valNota !== "" ? valNota : "-"}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}

                    <TableCell align="center">
                      <Chip
                        label={promedioAlumno}
                        sx={{
                          fontWeight: 800,
                          backgroundColor: estiloPromedio.bg,
                          color: estiloPromedio.color,
                          border: `1px solid ${estiloPromedio.border}`
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
          <Typography sx={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>
            Sincronización activa — {bimestreActual?.nombre || "Bimestre"}
          </Typography>

          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={guardarNotas}
            sx={{ backgroundColor: "#0F172A", color: "#FFFFFF", fontWeight: 700, borderRadius: "8px", textTransform: "none" }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Paper>

      <Snackbar open={guardado} autoHideDuration={3000} onClose={() => setGuardado(false)}>
        <Alert severity="success" onClose={() => setGuardado(false)} sx={{ backgroundColor: "#15803D", color: "#FFFFFF" }}>
          ¡Las notas han sido guardadas con éxito en la base de datos!
        </Alert>
      </Snackbar>
    </Box>
  );
}