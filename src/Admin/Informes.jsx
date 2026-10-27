import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Avatar,
  TextField,
} from "@mui/material";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import { COLORS, notaColor } from "../utils/constants";
import { apiAdmin } from "../utils/apiAdmin";
import { useAuth } from "../hooks/useAuth";
import { useAlumnosPorSalon } from "../hooks/useAlumnosPorSalon";
import { getBimestresProfesor } from "../utils/bimestresAccess";

function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function Informes() {
  const { user } = useAuth();
  const { salones: alumnosPorSalon } = useAlumnosPorSalon();
  const [config, setConfig] = useState({ bimestres: [], salones: [], cursos: [] });
  const [bimestre, setBimestre] = useState("");
  const [salon, setSalon] = useState("");
  const [alumno, setAlumno] = useState("");
  const [observacion, setObservacion] = useState("");
  const [reporteCursos, setReporteCursos] = useState({ cursos: [], promedioGeneral: null });

  const bimestres = config.bimestres;
  const alumnosDelSalon = alumnosPorSalon[salon] || [];

  useEffect(() => {
    apiAdmin
      .getConfig(user?.profesor)
      .then((res) => {
        const bims = getBimestresProfesor(res.bimestres || []);
        setConfig({ ...res, bimestres: bims });
        setBimestre(bims.find((b) => b.habilitado)?.nombre || bims[0]?.nombre || "");
        setSalon(res.salones?.[0] || "");
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    setAlumno(alumnosDelSalon[0] || "");
    setObservacion("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salon, alumnosPorSalon]);

  // Promedios por curso del alumno (calculados en la base de datos)
  useEffect(() => {
    if (!alumno || !bimestre || !salon) return undefined;
    let activo = true;
    apiAdmin
      .getInforme(bimestre, salon, alumno)
      .then((res) => activo && setReporteCursos({ cursos: res.cursos, promedioGeneral: res.promedio_general }))
      .catch(() => activo && setReporteCursos({ cursos: [], promedioGeneral: null }));
    return () => {
      activo = false;
    };
  }, [bimestre, salon, alumno]);

  const promedioColor = reporteCursos.promedioGeneral ? notaColor(Number(reporteCursos.promedioGeneral)) : null;
  const fechaHoy = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });

  // El PDF lo genera el backend (services/pdf.js) con los datos reales de la base de datos
  const exportarPDF = () => {
    apiAdmin.pdfInforme(bimestre, salon, alumno, observacion).catch((err) => window.alert(err.message));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, displayPrint: "none" }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
          Informes por alumno
        </Typography>
        <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
          Genera la ficha consolidada con los promedios de un alumno, lista para descargar en PDF.
        </Typography>
      </Box>

      {/* Selectores */}
      <Card title="Seleccionar alumno" action={<AssessmentRoundedIcon sx={{ color: COLORS.blue }} />} sx={{ mb: 3, displayPrint: "none" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Bimestre</InputLabel>
            <Select value={bimestre} label="Bimestre" onChange={(e) => setBimestre(e.target.value)}>
              {bimestres.map((b) => (
                <MenuItem key={b.nombre} value={b.nombre}>
                  {b.nombre.replace("BIMESTRE ", "Bimestre ")} {b.habilitado ? "(Habilitado)" : "(Bloqueado)"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Salón</InputLabel>
            <Select value={salon} label="Salón" onChange={(e) => setSalon(e.target.value)}>
              {config.salones.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Alumno</InputLabel>
            <Select value={alumno} label="Alumno" onChange={(e) => setAlumno(e.target.value)}>
              {alumnosDelSalon.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* FICHA IMPRIMIBLE / DESCARGABLE */}
      <Box
        id="ficha-imprimible"
        sx={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${COLORS.border}`,
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            backgroundColor: "#EEF4FF",
            borderBottom: `1px solid ${COLORS.border}`,
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="https://i.imgur.com/8Nmku28.png"
              alt="Logo de Academia"
              sx={{ width: 34, height: 34, borderRadius: "10px", objectFit: "contain" }}
            />
            <Box>
              <Typography sx={{ color: COLORS.navy, fontWeight: 800, fontSize: "1.1rem" }}>
                Academia Esparta
              </Typography>
              <Typography sx={{ color: COLORS.slate, fontSize: "0.75rem" }}>
                Informe académico consolidado
              </Typography>
            </Box>
          </Box>
          <Button
            data-html2canvas-ignore="true"
            startIcon={<PictureAsPdfRoundedIcon />}
            onClick={exportarPDF}
            disabled={!alumno || !reporteCursos.cursos.length}
            sx={{ displayPrint: "none" }}
          >
            Exportar a PDF
          </Button>
        </Box>

        {!alumno ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: COLORS.slate }}>
              Selecciona un alumno para mostrar el informe.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            {/* Datos del alumno */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 58, height: 58, bgcolor: COLORS.blue, fontWeight: 700, fontSize: "1.1rem" }}>
                {iniciales(alumno)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: COLORS.navy }}>
                  {alumno}
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", color: COLORS.slate }}>
                  Salón {salon} · {bimestre.replace("BIMESTRE ", "Bimestre ")}
                </Typography>
              </Box>
              {promedioColor && (
                <Box
                  sx={{
                    textAlign: "center",
                    backgroundColor: promedioColor.bg,
                    borderRadius: "14px",
                    px: 2.2,
                    py: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: promedioColor.fg, lineHeight: 1 }}>
                    {reporteCursos.promedioGeneral}
                  </Typography>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: promedioColor.fg }}>
                    PROMEDIO GENERAL
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Tabla con Solo Cursos y Promedios */}
            <Box sx={{ overflowX: "auto", mb: 3 }}>
              <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                <Box component="thead">
                  <Box component="tr" sx={{ backgroundColor: "#F8FAFC" }}>
                    <Box component="th" sx={{ textAlign: "left", p: 1.5, fontSize: "0.82rem", fontWeight: 700, color: COLORS.navy, border: `1px solid ${COLORS.border}` }}>
                      Curso
                    </Box>
                    <Box component="th" sx={{ textAlign: "center", p: 1.5, fontSize: "0.82rem", fontWeight: 700, color: COLORS.navy, border: `1px solid ${COLORS.border}`, width: "160px" }}>
                      Promedio
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {reporteCursos.cursos.map((c) => {
                    const cColor = c.promedio ? notaColor(Number(c.promedio)) : null;
                    return (
                      <Box component="tr" key={c.curso}>
                        <Box component="td" sx={{ p: 1.3, fontWeight: 700, fontSize: "0.85rem", color: COLORS.navy, border: `1px solid ${COLORS.border}` }}>
                          {c.curso}
                        </Box>
                        <Box component="td" sx={{ textAlign: "center", p: 1.3, fontWeight: 800, fontSize: "0.95rem", color: cColor ? cColor.fg : COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                          {c.promedio ?? "-"}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Observaciones */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <EditNoteRoundedIcon sx={{ fontSize: 18, color: COLORS.slate }} />
                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: COLORS.navy }}>
                  Observación del profesor
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Escribe aquí una sugerencia o comentario para el alumno..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                data-html2canvas-ignore="true"
                sx={{
                  displayPrint: "none",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.85rem" },
                }}
              />

              <Box
                className="pdf-observacion"
                sx={{
                  display: "none",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  p: 1.5,
                  minHeight: 60,
                  fontSize: "0.85rem",
                  color: COLORS.navy,
                  "@media print": { display: "block" },
                  ".html2pdf__page-break &": { display: "block" },
                }}
              >
                {observacion || "Sin observaciones."}
              </Box>
            </Box>

            {/* Pie: Fecha y Firma */}
            <Box
              sx={{
                mt: 4,
                pt: 2,
                borderTop: `1px dashed ${COLORS.border}`,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate }}>
                Emitido el {fechaHoy}
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ width: 160, borderTop: `1px solid ${COLORS.navy}`, mb: 0.5 }} />
                <Typography sx={{ fontSize: "0.72rem", color: COLORS.slate }}>Firma del profesor</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}