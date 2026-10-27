import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import Input from "../componentes/ui/Input";
import Loader from "../componentes/ui/Loader";
import Modal from "../componentes/ui/Modal";
import GradesTable from "../componentes/grades/GradesTable";
import { useAuth } from "../hooks/useAuth";
import { apiAdmin as api } from "../utils/apiAdmin";
import { COLORS, TIPOS_EVALUACION } from "../utils/constants";
import { toDDMMYYYY } from "../utils/formatDate";
import { getBimestresProfesor } from "../utils/bimestresAccess";

export default function Grades() {
  const { user } = useAuth();

  const [config, setConfig] = useState(null);
  const [bimestre, setBimestre] = useState("");
  const [salon, setSalon] = useState("");
  const [curso, setCurso] = useState("");

  const [data, setData] = useState(null); // { columnas, col_indices, notas }
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Modal "nueva evaluación"
  const [modalOpen, setModalOpen] = useState(false);
  const [tipo, setTipo] = useState("PC");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [alumnos, setAlumnos] = useState([]);
  const [nuevasNotas, setNuevasNotas] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getConfig(user?.profesor)
      .then((res) => {
        const configConAcceso = { ...res, bimestres: getBimestresProfesor(res.bimestres || []) };
        setConfig(configConAcceso);
        if (configConAcceso.bimestres?.length) setBimestre(configConAcceso.bimestres.find((b) => b.habilitado)?.nombre || configConAcceso.bimestres[0].nombre);
        if (res.salones?.length) setSalon(res.salones[0]);
        if (res.cursos?.length) setCurso(res.cursos[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingConfig(false));
  }, [user]);

  const cargarNotas = () => {
    if (!bimestre || !salon || !curso) return;
    setLoadingNotas(true);
    setError("");
    api
      .getNotasBim(bimestre, salon, curso)
      .then((res) => setData(res))
      .catch((err) => {
        setData({ columnas: [], col_indices: [], notas: {} });
        setError(err.message);
      })
      .finally(() => setLoadingNotas(false));
  };

  useEffect(cargarNotas, [bimestre, salon, curso]);

  const bimestreActual = useMemo(
    () => config?.bimestres?.find((b) => b.nombre === bimestre),
    [config, bimestre]
  );

  const handleEditCell = async (alumno, colIdx, nuevaNota) => {
    try {
      await api.editarNota(bimestre, salon, curso, alumno, colIdx, nuevaNota);
      setToast("Nota actualizada correctamente.");
      cargarNotas();
    } catch (err) {
      setError(err.message);
    }
  };

  const abrirModal = async () => {
    setModalOpen(true);
    setNuevasNotas({});
    try {
      const res = await api.getAlumnos(salon, curso);
      setAlumnos(res.alumnos || []);
    } catch (err) {
      setAlumnos([]);
      setError(err.message);
    }
  };

  const guardarEvaluacion = async () => {
    setSaving(true);
    setError("");
    try {
      const datos = alumnos.map((al) => ({ alumno: al, nota: nuevasNotas[al] ?? "" }));
      const res = await api.guardarNotas(
        bimestre,
        salon,
        curso,
        user?.profesor,
        toDDMMYYYY(fecha),
        tipo,
        datos
      );
      setToast(res.mensaje || "Notas guardadas.");
      setModalOpen(false);
      cargarNotas();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig) return <Loader label="Cargando configuración..." />;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
            Notas
          </Typography>
          <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
            Registra y edita las notas de tus alumnos por bimestre.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outline"
            startIcon={<PictureAsPdfRoundedIcon />}
            onClick={() => api.pdfRegistro(bimestre, salon, curso).catch((err) => setError(err.message))}
            disabled={!bimestre || !salon || !curso}
          >
            Descargar PDF
          </Button>
          <Button
            startIcon={<AddRoundedIcon />}
            onClick={abrirModal}
            disabled={!bimestreActual?.habilitado}
          >
            Nueva evaluación
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Bimestre</InputLabel>
            <Select value={bimestre} label="Bimestre" onChange={(e) => setBimestre(e.target.value)}>
              {config?.bimestres?.map((b) => (
                <MenuItem key={b.nombre} value={b.nombre}>
                  {b.nombre} {!b.habilitado && "(bloqueado)"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Salón</InputLabel>
            <Select value={salon} label="Salón" onChange={(e) => setSalon(e.target.value)}>
              {config?.salones?.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Curso</InputLabel>
            <Select value={curso} label="Curso" onChange={(e) => setCurso(e.target.value)}>
              {config?.cursos?.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      <Card title={`${curso || ""} · ${salon || ""} · ${bimestre || ""}`}>
        {loadingNotas ? (
          <Loader label="Cargando notas..." />
        ) : (
          <GradesTable
            columnas={data?.columnas || []}
            colIndices={data?.col_indices || []}
            notas={data?.notas || {}}
            onEditCell={handleEditCell}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva evaluación"
        maxWidth="sm"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button loading={saving} onClick={guardarEvaluacion}>
              Guardar notas
            </Button>
          </>
        }
      >
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select value={tipo} label="Tipo" onChange={(e) => setTipo(e.target.value)}>
              {TIPOS_EVALUACION.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Input
            type="date"
            label="Fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: COLORS.navy, mb: 1 }}>
          Notas por alumno
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 320, overflowY: "auto" }}>
          {alumnos.map((al) => (
            <Box key={al} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ fontSize: "0.85rem", color: COLORS.navy }}>{al}</Typography>
              <Input
                sx={{ width: 90 }}
                placeholder="S.N."
                value={nuevasNotas[al] ?? ""}
                onChange={(e) =>
                  setNuevasNotas((prev) => ({ ...prev, [al]: e.target.value }))
                }
              />
            </Box>
          ))}
          {alumnos.length === 0 && (
            <Typography sx={{ fontSize: "0.85rem", color: COLORS.slate }}>
              No hay alumnos en este salón.
            </Typography>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}