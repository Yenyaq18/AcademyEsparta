import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import Loader from "../componentes/ui/Loader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";
import { COLORS } from "../utils/constants";

const ESTILOS_CURSO = {
  matematica: {
    icon: FunctionsRoundedIcon,
    bg: "#BDE3F7",
    fg: "#0369A1",
  },
  aritmetica: {
    icon: CalculateRoundedIcon,
    bg: "#D8C7F3",
    fg: "#6D28D9",
  },
  comunicacion: {
    icon: TranslateRoundedIcon,
    bg: "#BCEBCB",
    fg: "#15803D",
  },
  biologia: {
    icon: BiotechRoundedIcon,
    bg: "#FFE69A",
    fg: "#92400E",
  },
  "ciencia y tecnologia": {
    icon: ScienceRoundedIcon,
    bg: "#FFC8D1",
    fg: "#BE123C",
  },
  geologia: {
    icon: PublicRoundedIcon,
    bg: "#BBD5F5",
    fg: "#1D4ED8",
  },
  historia: {
    icon: HistoryEduRoundedIcon,
    bg: "#FFD0A3",
    fg: "#C2410C",
  },
  lenguaje: {
    icon: MenuBookRoundedIcon,
    bg: "#EBC5DF",
    fg: "#BE185D",
  },
  psicologia: {
    icon: PsychologyRoundedIcon,
    bg: "#DDBFF2",
    fg: "#7E22CE",
  },
  quimica: {
    icon: LocalFireDepartmentRoundedIcon,
    bg: "#FFC2C8",
    fg: "#B91C1C",
  },
  "razonamiento matematico": {
    icon: ChangeHistoryRoundedIcon,
    bg: "#DDF3A0",
    fg: "#4D7C0F",
  },
  "razonamiento verbal": {
    icon: TranslateRoundedIcon,
    bg: "#A9E3D9",
    fg: "#0F766E",
  },
  trigonometria: {
    icon: ChangeHistoryRoundedIcon,
    bg: "#C2CEF4",
    fg: "#4338CA",
  },
  "razonamiento psicotecnico y realidad nacional aplicada": {
    icon: MenuBookRoundedIcon,
    bg: "#D9E1EA",
    fg: "#475569",
  },
};

const estiloCurso = (nombre) => {
  const clave = String(nombre || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return (
    ESTILOS_CURSO[clave] || {
      icon: MenuBookRoundedIcon,
      bg: "#D9E1EA",
      fg: "#475569",
    }
  );
};

export default function Bimestre() {
  const { numero } = useParams();
  const { user } = useAuth();

  const [notas, setNotas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar las notas
  useEffect(() => {
    let activo = true;
    api
      .getNotas(user.nombre, user.salon)
      .then((res) => activo && (setNotas(res.bimestres), setError("")))
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [user]);

  // Obtener el número del bimestre directamente desde la URL
  const numeroBimestre = String(numero || "").match(/\d+/)?.[0] || "";

  // Buscar el bimestre correspondiente
  const bimestre = useMemo(() => {
    if (!notas) return null;

    return notas.find((periodo) => {
      const numeroDelPeriodo = String(periodo.nombre || "").match(/\d+/)?.[0];

      return numeroDelPeriodo === numeroBimestre;
    });
  }, [notas, numeroBimestre]);

  // Título y descripción dinámicos
  const nombreBimestre = numeroBimestre
    ? `BIMESTRE ${numeroBimestre}`
    : "Bimestre";

  const descripcionBimestre = numeroBimestre
    ? `el Bimestre ${numeroBimestre}`
    : "el bimestre seleccionado";

  // Obtener todos los cursos
  const cursos = useMemo(() => {
    const cursosUnicos = [];

    notas?.forEach((periodo) => {
      periodo.cursos.forEach((curso) => {
        if (!cursosUnicos.includes(curso.curso)) {
          cursosUnicos.push(curso.curso);
        }
      });
    });

    return cursosUnicos.map((nombre) => {
      return (
        bimestre?.cursos.find((curso) => curso.curso === nombre) || {
          curso: nombre,
          promedios: {},
        }
      );
    });
  }, [notas, bimestre]);

  if (loading) {
    return <Loader label="Cargando bimestre..." />;
  }

  return (
    <Box>
      {/* TÍTULO */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.4rem",
          color: COLORS.navy,
          mb: 0.5,
        }}
      >
        {nombreBimestre}
      </Typography>

      {/* DESCRIPCIÓN DINÁMICA */}
      <Typography
        sx={{
          color: COLORS.slate,
          fontSize: "0.9rem",
          mb: 3,
        }}
      >
        Detalle de tus notas por curso en {descripcionBimestre}.
      </Typography>

      {/* ERROR */}
      {error && (
        <Typography
          sx={{
            color: "#DC2626",
            fontSize: "0.85rem",
            mb: 2,
          }}
        >
          {error}
        </Typography>
      )}

      {/* TODOS LOS CURSOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 4,
        }}
      >
        {cursos.map((c) => {
          const estilo = estiloCurso(c.curso);
          const Icon = estilo.icon;
          const final = c.promedios?.FINAL;

          return (
            <Box
              key={c.curso}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "14px",
                backgroundColor: estilo.bg,
                p: 2,
                minHeight: 118,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: `0 12px 30px ${estilo.bg}`,
              }}
            >
              {/* CÍRCULO DECORATIVO */}
              <Box
                sx={{
                  position: "absolute",
                  top: -24,
                  right: -24,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.35)",
                }}
              />

              {/* ICONO */}
              <Box
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "11px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Icon
                  sx={{
                    color: estilo.fg,
                    fontSize: 21,
                  }}
                />
              </Box>

              {/* CURSO Y NOTA */}
              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: estilo.fg,
                    mb: 0.3,
                  }}
                >
                  {c.curso}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 0.6,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: estilo.fg,
                      lineHeight: 1,
                    }}
                  >
                    {final ?? "—"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: estilo.fg,
                      opacity: 0.7,
                    }}
                  >
                    / 20
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* SIN CURSOS */}
        {!cursos.length && (
          <Box
            sx={{
              gridColumn: "1 / -1",
            }}
          >
            <Typography
              sx={{
                color: COLORS.slate,
                fontSize: "0.9rem",
              }}
            >
              Todavía no hay cursos registrados.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}