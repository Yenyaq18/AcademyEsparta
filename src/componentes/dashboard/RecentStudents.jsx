import { useMemo } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { COLORS } from "../../utils/constants";

const COLORES_AVATAR = ["#0284C7", "#7C3AED", "#059669", "#D97706", "#DB2777", "#4F46E5"];

function obtenerColorHash(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORES_AVATAR[Math.abs(hash) % COLORES_AVATAR.length];
}

function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function RecentStudents({ alumnosPorSalon = {}, limite = 5 }) {
  const recientes = useMemo(() => {
    return Object.entries(alumnosPorSalon)
      .flatMap(([salon, alumnos]) =>
        alumnos.slice(-2).map((nombre, i) => ({
          nombre,
          salon,
          orden: alumnos.length - alumnos.slice(-2).length + i,
        }))
      )
      .sort((a, b) => b.orden - a.orden)
      .slice(0, limite);
  }, [alumnosPorSalon, limite]);

  if (recientes.length === 0) {
    return (
      <Box
        sx={{
          py: 3,
          px: 2,
          textAlign: "center",
          backgroundColor: "#F8FAFC",
          borderRadius: "12px",
          border: `1px dashed ${COLORS.border}`,
        }}
      >
        <SchoolRoundedIcon sx={{ fontSize: 32, color: "#94A3B8", mb: 0.5 }} />
        <Typography sx={{ color: COLORS.navy, fontWeight: 700, fontSize: "0.85rem" }}>
          Sin alumnos recientes
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
      {recientes.map((a) => {
        const avatarColor = obtenerColorHash(a.nombre);

        return (
          <Box
            key={`${a.salon}-${a.nombre}`}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.2,
              p: { xs: 1.2, sm: 1.4 },
              borderRadius: "12px",
              border: `1px solid ${COLORS.border}`,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  fontSize: { xs: "0.75rem", sm: "0.82rem" },
                  fontWeight: 800,
                  bgcolor: avatarColor,
                  flexShrink: 0,
                }}
              >
                {iniciales(a.nombre)}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.82rem", sm: "0.88rem" },
                    fontWeight: 700,
                    color: COLORS.navy,
                    lineHeight: 1.2,
                  }}
                  noWrap
                >
                  {a.nombre}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                  <Chip
                    label={`Salón ${a.salon}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      backgroundColor: COLORS.blueSoft,
                      color: COLORS.blue,
                      borderRadius: "5px",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Chip
              icon={<PersonAddAlt1RoundedIcon style={{ fontSize: 12, color: "#059669" }} />}
              label="Nuevo"
              size="small"
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 800,
                backgroundColor: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
                borderRadius: "999px",
                flexShrink: 0,
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}