import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Card from "../componentes/ui/Card";
import { COLORS } from "../utils/constants";
import { apiAdmin } from "../utils/apiAdmin";
import { useAuth } from "../hooks/useAuth";
import { useAlumnosPorSalon } from "../hooks/useAlumnosPorSalon";

export default function AdminSection({ title, description }) {
  const { user } = useAuth();
  const { salones: alumnosPorSalon } = useAlumnosPorSalon();
  const [config, setConfig] = useState({ cursos: [], salones: [], bimestres: [] });

  useEffect(() => {
    apiAdmin
      .getConfig(user?.profesor)
      .then((res) => setConfig({ cursos: res.cursos || [], salones: res.salones || [], bimestres: res.bimestres || [] }))
      .catch(() => {});
  }, [user]);

  const totalAlumnos = Object.values(alumnosPorSalon).reduce((total, alumnos) => total + alumnos.length, 0);

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.navy, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem", mb: 3 }}>
        {description}
      </Typography>
      <Card>
        {title === "Cursos" && config.cursos.map((curso) => (
          <Typography key={curso} sx={{ color: COLORS.navy, fontSize: "0.9rem", mb: 1 }}>
            {curso}
          </Typography>
        ))}
        {title === "Asistencia" && (
          <Typography sx={{ color: COLORS.slate, fontSize: "1.9rem" }}>
            {totalAlumnos} alumnos distribuidos en {config.salones.length} salones.
          </Typography>
        )}
        {title === "Reportes" && (
          <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
            Genera informes por alumno desde la sección Informes.
          </Typography>
        )}
        {title === "Configuración" && (
          <Typography sx={{ color: COLORS.slate, fontSize: "0.9rem" }}>
            {config.bimestres.length} bimestres y {config.salones.length} salones configurados.
          </Typography>
        )}
      </Card>
    </Box>
  );
}
