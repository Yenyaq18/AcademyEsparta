import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Paper, Stack, Tooltip } from "@mui/material";
import DonutChart from "../componentes/dashboard/DonutChart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";

// Paleta Dashboard Soft UI
const DASH_COLORS = {
  navy: "#0F172A",
  slate: "#64748B",
  bgTrack: "#F8FAFC",
  // Colores por Bimestre
  bimestres: {
    B1: { fg: "#2563EB", bg: "linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)" },
    B2: { fg: "#F97316", bg: "linear-gradient(180deg, #FB923C 0%, #EA580C 100%)" },
    B3: { fg: "#10B981", bg: "linear-gradient(180deg, #34D399 0%, #059669 100%)" },
    B4: { fg: "#EC4899", bg: "linear-gradient(180deg, #F472B6 0%, #DB2777 100%)" },
  },
  asistencia: {
    P: "#10B981",
    A: "#EF4444",
    T: "#F59E0B",
  },
};

export default function Graficos() {
  const { user } = useAuth();
  const [bimestresData, setBimestresData] = useState([]);
  const [asistencia, setAsistencia] = useState(null);

  useEffect(() => {
    let activo = true;
    api
      .getTodo(user.nombre, user.salon)
      .then((res) => {
        if (!activo) return;
        setBimestresData(res.notas || []);
        setAsistencia(res.asistencia || null);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [user]);

  // 1. Extraer la lista única de asignaturas
  const listaCursos = useMemo(() => {
    const cursosMap = new Map();
    bimestresData.forEach((b) => {
      b.cursos?.forEach((c) => {
        const nombre = c.curso || c.nombre;
        if (nombre && !cursosMap.has(nombre)) {
          cursosMap.set(nombre, nombre);
        }
      });
    });
    return Array.from(cursosMap.values());
  }, [bimestresData]);

  // Estado para el curso activo en el menú lateral
  const [cursoElegido, setCursoSeleccionado] = useState("");
  const cursoSeleccionado = cursoElegido || listaCursos[0] || "";

  // 2. Obtener notas por bimestre del curso seleccionado
  const notasCursoSeleccionado = useMemo(() => {
    if (!cursoSeleccionado) return [];
    return bimestresData.map((b) => {
      const cEncontrado = b.cursos?.find((c) => (c.curso || c.nombre) === cursoSeleccionado);
      return {
        bimestre: b.nombre.replace("BIMESTRE ", "B"),
        nombreCompleto: b.nombre,
        nota: cEncontrado?.promedios?.FINAL ?? null,
      };
    });
  }, [bimestresData, cursoSeleccionado]);

  // 3. Promedio general anual por bimestre
  const promediosGenerales = useMemo(
    () =>
      bimestresData.map((b) => {
        const finales = b.cursos?.map((c) => c.promedios?.FINAL).filter((n) => n != null) || [];
        const prom = finales.length
          ? Math.round((finales.reduce((a, x) => a + x, 0) / finales.length) * 10) / 10
          : null;
        return {
          bimestre: b.nombre.replace("BIMESTRE ", "B"),
          promedio: prom,
        };
      }),
    [bimestresData]
  );

  const resumen = asistencia?.resumen || { P: 0, A: 0, T: 0, total: 0 };
  const segmentosAsistencia = [
    { label: "Presente", value: resumen.P, color: DASH_COLORS.asistencia.P },
    { label: "Ausente", value: resumen.A, color: DASH_COLORS.asistencia.A },
    { label: "Tardanza", value: resumen.T, color: DASH_COLORS.asistencia.T },
  ];

  const notaMaxima = 20;

  return (
    <Box sx={{ pb: 5, width: "100%", boxSizing: "border-box" }}>
      {/* Encabezado Principal */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: DASH_COLORS.navy }}>
          Gráficos y Estadísticas
        </Typography>
        <Typography sx={{ color: DASH_COLORS.slate, fontSize: "0.875rem" }}>
          Monitorea tu evolución académica detallada y el resumen de asistencia.
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* SECCIÓN SUPERIOR: EVOLUCIÓN POR CURSO (ALINEACIÓN FLEXIBLE STRICTA) */}
      {/* ========================================================= */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4,
          borderRadius: "18px",
          border: "1px solid #E2E8F0",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.02)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: DASH_COLORS.navy, mb: 2.5 }}>
          Evolución Detallada por Curso
        </Typography>

        {/* Usamos FLEXBOX para evitar que la columna derecha caiga hacia abajo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* MENU IZQUIERDO: ANCHO FIJO CONTROLADO */}
          <Box
            sx={{
              width: { xs: "100%", md: "28px", lg: "350px" },
              flexShrink: 0, // Impide que se reduzca rompiendo el gráfico
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.88rem",
                color: DASH_COLORS.slate,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: 2.5,
              }}
            >
              SELECCIONAR CURSO
            </Typography>
            <Stack
              spacing={2.5}
              sx={{
                maxHeight: 250,
                overflowY: "auto",
                pr: 5,
                "&::-webkit-scrollbar": { width: 10 },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#CBD5E1", borderRadius: 8 },
              }}
            >
              {listaCursos.map((curso) => {
                const isSelected = curso === cursoSeleccionado;
                return (
                  <Tooltip key={curso} title={curso} placement="top-start" arrow>
                    <Box
                      onClick={() => setCursoSeleccionado(curso)}
                      sx={{
                        p: "15px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: "0.83rem",
                        color: isSelected ? "#3B82F6" : DASH_COLORS.slate,
                        backgroundColor: isSelected ? "#EFF6FF" : "#F8FAFC",
                        borderLeft: isSelected ? "4px solid #3B82F6" : "4px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        overflow: "hidden",
                        "&:hover": {
                          backgroundColor: isSelected ? "#EFF6FF" : "#F1F5F9",
                          color: isSelected ? "#3B82F6" : DASH_COLORS.navy,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "inherit",
                          fontWeight: "inherit",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis", // Recorta el texto largo con '...'
                          width: "100%",
                        }}
                      >
                        {curso}
                      </Typography>
                      {isSelected && (
                        <Box
                          sx={{
                            width: 9,
                            height: 7,
                            borderRadius: "90%",
                            backgroundColor: "#3B82F6",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          </Box>

          {/* GRÁFICO DERECHO: EXPANSIÓN TOTAL (flex: 1) */}
          <Box
            sx={{
              flex: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 350,
              backgroundColor: "#FAFBFD",
              borderRadius: "10px",
              border: "1px dashed #CBD5E1",
              p: { xs: 8, sm: 2.5, md: 3 },
              boxSizing: "border-box",
              minWidth: 0, // Crucial para permitir que flexbox adapte el contenido sin desbordar
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: DASH_COLORS.navy, mb: 1 }}>
              Calificaciones en <span style={{ color: "#3B82F6" }}>{cursoSeleccionado}</span>
            </Typography>

            {/* Barras por Bimestre */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-end",
                flex: 1,
                pt: 2,
                width: "100%",
              }}
            >
              {notasCursoSeleccionado.map((item) => {
                const tieneNota = item.nota !== null;
                const alturaPct = tieneNota ? (item.nota / notaMaxima) * 100 : 0;
                const configBimestre = DASH_COLORS.bimestres[item.bimestre] || {
                  fg: "#64748B",
                  bg: "#CBD5E1",
                };

                return (
                  <Box
                    key={item.bimestre}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      maxHeight: 230,
                      flex: 1,
                      maxWidth: 80,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 900,
                        color: tieneNota ? configBimestre.fg : DASH_COLORS.slate,
                        mb: 1,
                      }}
                    >
                      {tieneNota ? item.nota : "—"}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        width: "100%",
                        maxWidth: 48,
                        borderRadius: "12px",
                        backgroundColor: "#E2E8F0",
                        display: "flex",
                        alignItems: "flex-end",
                        overflow: "hidden",
                        p: 0.4,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: `${alturaPct}%`,
                          borderRadius: "8px",
                          background: tieneNota ? configBimestre.bg : "transparent",
                          transition: "height 0.5s ease-in-out",
                          boxShadow: tieneNota ? `0px 4px 12px ${configBimestre.fg}44` : "none",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: DASH_COLORS.navy,
                        mt: 1.5,
                        fontWeight: 700,
                      }}
                    >
                      {item.bimestre}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Leyenda de Bimestres */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 8, sm: 4 }, mt: 3, flexWrap: "wrap" }}>
              {Object.entries(DASH_COLORS.bimestres).map(([bKey, bVal]) => (
                <Box key={bKey} sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "8px",
                      backgroundColor: bVal.fg,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.8rem", color: DASH_COLORS.slate, fontWeight: 800 }}>
                    Bimestre {bKey.replace("B", "")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ========================================================= */}
      {/* SECCIÓN INFERIOR: MITAD Y MITAD (PROMEDIO Y ASISTENCIA)  */}
      {/* ========================================================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* LADO IZQUIERDO: Promedio General (50%) */}
        <Box sx={{ minWidth: 0 }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: "18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.02)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: DASH_COLORS.navy, mb: 2 }}>
              Promedio General por Bimestre
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: 210, px: 1, pt: 1 }}>
              {promediosGenerales.map((b) => {
                const alturaPct = b.promedio ? (b.promedio / notaMaxima) * 100 : 0;
                return (
                  <Box
                    key={b.bimestre}
                    sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}
                  >
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: DASH_COLORS.navy, mb: 1 }}>
                      {b.promedio ?? "—"}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        width: "100%",
                        maxWidth: 42,
                        borderRadius: "12px",
                        backgroundColor: DASH_COLORS.bgTrack,
                        display: "flex",
                        alignItems: "flex-end",
                        overflow: "hidden",
                        p: 0.4,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: `${alturaPct}%`,
                          borderRadius: "8px",
                          background: DASH_COLORS.bimestres[b.bimestre]?.bg || "#3B82F6",
                          transition: "height 0.6s ease",
                        }}
                      />
                    </Box>

                    <Typography sx={{ fontSize: "0.78rem", color: DASH_COLORS.slate, mt: 1.5, fontWeight: 700 }}>
                      {b.bimestre}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>

        {/* LADO DERECHO: Asistencia Acumulada (50%) */}
        <Box sx={{ minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: DASH_COLORS.navy, mb: 1 }}>
              Asistencia Acumulada
            </Typography>

            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 2 }}>
              <DonutChart
                segments={segmentosAsistencia}
                centerValue={`${resumen.total}`}
                centerLabel="registros"
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}