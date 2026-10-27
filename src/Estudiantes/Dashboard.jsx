import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import Card from "../componentes/ui/Card";
import StatCard from "../componentes/dashboard/StatCard";
import AttendanceChart from "../componentes/dashboard/AttendanceChart";
import PerformanceChart from "../componentes/dashboard/PerformanceChart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";
import Loader from "../componentes/ui/Loader";
import { COLORS } from "../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    api
      .getTodo(user.nombre, user.salon)
      .then((res) => activo && setData({ notas: res.notas, asistencia: res.asistencia }))
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, [user]);

  // Último bimestre con cursos registrados
  const bimestreActual = useMemo(() => {
    if (!data?.notas?.length) return null;
    const conCursos = [...data.notas].reverse().find((b) => b.cursos.length > 0);
    return conCursos || data.notas[data.notas.length - 1];
  }, [data]);

  const promedioGeneral = useMemo(() => {
    const finales = (bimestreActual?.cursos || [])
      .map((c) => c.promedios?.FINAL)
      .filter((n) => n != null);
    if (!finales.length) return null;
    return Math.round((finales.reduce((a, b) => a + b, 0) / finales.length) * 10) / 10;
  }, [bimestreActual]);

  const initials = user?.nombre
    ? user.nombre.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "E";

  if (!user) return null;
  if (loading) return <Loader label="Cargando tu panel..." />;

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
      {/* Columna principal */}
      <Box sx={{ flex: 2, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
          Hola, {user?.nombre?.split(" ")[0]} 👋
        </Typography>
        <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem", mb: 3 }}>
          Este es el resumen de tu desempeño en {bimestreActual?.nombre || "el bimestre actual"}.
        </Typography>

        {error && (
          <Typography sx={{ color: "#DC2626", fontSize: "0.85rem", mb: 2 }}>{error}</Typography>
        )}

        <Card title="Rendimiento por curso" sx={{ mb: 3 }}>
          <PerformanceChart cursos={bimestreActual?.cursos || []} />
        </Card>
      </Box>

      {/* Panel derecho: perfil y calendario */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: "100%",
          mt: { xs: 2, lg: 10 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ backgroundColor: COLORS.cardDark, borderRadius: "18px", p: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: COLORS.blue, fontWeight: 700, mb: 1.2 }}>
              {initials}
            </Avatar>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.95rem" }}>
                {user?.nombre}
              </Typography>
              <VerifiedRoundedIcon sx={{ fontSize: 16, color: COLORS.blue }} />
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>
              Salón {user?.salon}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
            <Box sx={{ minWidth: 0, "& > *": { width: "100%" } }}>
              <StatCard
                label="Cursos"
                value={bimestreActual?.cursos?.length ?? 0}
                icon={MenuBookRoundedIcon}
              />
            </Box>
            <Box sx={{ minWidth: 0, "& > *": { width: "100%" } }}>
              <StatCard label="Promedio" value={promedioGeneral ?? "—"} icon={GradingRoundedIcon} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden" }}>
          <AttendanceChart registros={data?.asistencia?.registros || []} />
        </Box>
      </Box>
    </Box>
  );
}