import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import Loader from "../componentes/ui/Loader";
import PerformanceChart from "../componentes/dashboard/PerformanceChart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";
import { COLORS } from "../utils/constants";

export default function Notas() {
  const { user } = useAuth();
  const [bimestres, setBimestres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getNotas(user.nombre, user.salon)
      .then((res) => setBimestres(res.bimestres))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loader label="Cargando notas..." />;

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
        Historial de notas
      </Typography>
      <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem", mb: 3 }}>
        Tu desempeño en los 4 bimestres.
      </Typography>

      {error && <Typography sx={{ color: "#DC2626", fontSize: "0.85rem", mb: 2 }}>{error}</Typography>}

      {bimestres.map((b) => (
        <Card
          key={b.nombre}
          title={b.nombre}
          sx={{ mb: 2 }}
          action={
            b.cursos.length > 0 ? (
              <Button variant="outline" size="small" onClick={() => api.descargarBoleta(b.nombre).catch((err) => setError(err.message))}>
                Descargar boleta PDF
              </Button>
            ) : null
          }
        >
          <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem", mb: 2 }}>
            Detalle de tus notas por curso en {b.nombre}.
          </Typography>
          <PerformanceChart cursos={b.cursos} />
        </Card>
      ))}
    </Box>
  );
}