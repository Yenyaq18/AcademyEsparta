import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  Chip,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

import { COLORS } from "../../utils/constants";

const notasIniciales = () => [
  {
    id: 1,
    texto: "Revisar entregas del proyecto integrador",
    completada: false,
    prioridad: "alta",
    fecha: new Date().toISOString().split("T")[0],
  },
  {
    id: 2,
    texto: "Preparar material de la siguiente sesión",
    completada: true,
    prioridad: "normal",
    fecha: new Date().toISOString().split("T")[0],
  },
];

export default function Header({ role = "estudiante" }) {
  const [agendaAbierta, setAgendaAbierta] = useState(false);
  const [nuevaNota, setNuevaNota] = useState("");
  const [prioridad, setPrioridad] = useState("normal");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [filtro, setFiltro] = useState("todas");

  const [notas, setNotas] = useState(() => {
    try {
      const saved = localStorage.getItem("agenda_notas");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : notasIniciales();
    } catch {
      localStorage.removeItem("agenda_notas");
      return notasIniciales();
    }
  });

  useEffect(() => {
    localStorage.setItem("agenda_notas", JSON.stringify(notas));
  }, [notas]);

  const handleAgregarNota = (e) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;

    const nueva = {
      id: Date.now(),
      texto: nuevaNota.trim(),
      completada: false,
      prioridad,
      fecha: fecha || new Date().toISOString().split("T")[0],
    };

    setNotas([nueva, ...notas]);
    setNuevaNota("");
  };

  const handleToggleNota = (id) => {
    setNotas(
      notas.map((nota) =>
        nota.id === id ? { ...nota, completada: !nota.completada } : nota
      )
    );
  };

  const handleEliminarNota = (id) => {
    setNotas(notas.filter((nota) => nota.id !== id));
  };

  const notasFiltradas = notas.filter((nota) => {
    if (filtro === "pendientes") return !nota.completada;
    if (filtro === "completadas") return nota.completada;
    return true;
  });

  const pendientesCount = notas.filter((n) => !n.completada).length;
  const completadasCount = notas.filter((n) => n.completada).length;

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <Box
        sx={{
          height: 72,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: COLORS.bgApp,
        }}
      >
        {(role === "admin" || role === "director" || role === "profesor") && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="Mi Agenda y Tareas">
              <IconButton
                aria-label="Abrir agenda"
                onClick={() => setAgendaAbierta(true)}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.slate,
                  position: "relative",
                  "&:hover": { backgroundColor: COLORS.blueSoft, color: COLORS.blue },
                }}
              >
                <EventNoteRoundedIcon sx={{ fontSize: 18 }} />
                {pendientesCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                      border: "2px solid #FFFFFF",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* AGENDA DRAWER */}
      <Drawer
        anchor="right"
        open={agendaAbierta}
        onClose={() => setAgendaAbierta(false)}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 420, md: 450 },
            p: 3,
            backgroundColor: COLORS.bgApp,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* BOTÓN CERRAR SUPERIOR */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton
            aria-label="Cerrar agenda"
            size="small"
            onClick={() => setAgendaAbierta(false)}
            sx={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${COLORS.border}`,
              "&:hover": { backgroundColor: COLORS.blueSoft },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* CABECERA (MÁS ABAJO Y RESALTADA) */}
        <Box sx={{ mb: 3, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.5 }}>
            <EventNoteRoundedIcon sx={{ color: COLORS.blue, fontSize: 28 }} />
            <Typography sx={{ color: COLORS.navy, fontWeight: 800, fontSize: "1.3rem" }}>
              Mi Agenda & Notas
            </Typography>
          </Box>
          <Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", pl: 4.8 }}>
            Organiza tus tareas y compromisos pendientes
          </Typography>
        </Box>

        {/* MÉTRICAS DE RESUMEN */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <Box
            sx={{
              p: 1.8,
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <PendingActionsRoundedIcon sx={{ color: "#F59E0B", fontSize: 26 }} />
            <Box>
              <Typography sx={{ fontSize: "0.68rem", color: COLORS.slate, fontWeight: 700, letterSpacing: 0.5 }}>
                PENDIENTES
              </Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: COLORS.navy }}>
                {pendientesCount}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.8,
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <CheckCircleOutlineRoundedIcon sx={{ color: "#10B981", fontSize: 26 }} />
            <Box>
              <Typography sx={{ fontSize: "0.68rem", color: COLORS.slate, fontWeight: 700, letterSpacing: 0.5 }}>
                COMPLETADAS
              </Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: COLORS.navy }}>
                {completadasCount}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* FORMULARIO DE NUEVA TAREA */}
        <Box
          component="form"
          onSubmit={handleAgregarNota}
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Escribe una nueva nota o tarea..."
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.85rem",
                borderRadius: "8px",
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <TextField
              type="date"
              size="small"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": { fontSize: "0.78rem", borderRadius: "8px" },
              }}
            />
            <Chip
              label={prioridad === "alta" ? "Urgente" : "Normal"}
              size="small"
              onClick={() => setPrioridad(prioridad === "alta" ? "normal" : "alta")}
              sx={{
                fontSize: "0.75rem",
                cursor: "pointer",
                height: 38,
                px: 1.5,
                backgroundColor: prioridad === "alta" ? "#FEE2E2" : "#F1F5F9",
                color: prioridad === "alta" ? "#EF4444" : COLORS.slate,
                fontWeight: 700,
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddRoundedIcon />}
            disabled={!nuevaNota.trim()}
            sx={{
              fontSize: "0.82rem",
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: COLORS.blue,
              py: 0.9,
              boxShadow: "none",
              fontWeight: 600,
              "&:hover": { boxShadow: "none" },
            }}
          >
            Guardar Tarea
          </Button>
        </Box>

        {/* CONTROLES DE FILTRO */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={filtro}
            exclusive
            onChange={(_, val) => val && setFiltro(val)}
            size="small"
            sx={{
              backgroundColor: "#FFFFFF",
              p: 0.4,
              borderRadius: "10px",
              border: `1px solid ${COLORS.border}`,
              width: "100%",
              display: "flex",
              "& .MuiToggleButton-root": {
                flex: 1,
                border: 0,
                fontSize: "0.75rem",
                textTransform: "none",
                fontWeight: 600,
                py: 0.5,
                borderRadius: "8px",
                color: COLORS.slate,
                "&.Mui-selected": {
                  backgroundColor: COLORS.blueSoft,
                  color: COLORS.blue,
                },
              },
            }}
          >
            <ToggleButton value="todas">Todas</ToggleButton>
            <ToggleButton value="pendientes">Pendientes</ToggleButton>
            <ToggleButton value="completadas">Listas</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* LISTA DE TAREAS */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
          {notasFiltradas.length === 0 ? (
            <Typography
              sx={{
                color: COLORS.slate,
                fontSize: "0.82rem",
                textAlign: "center",
                mt: 4,
                fontStyle: "italic",
              }}
            >
              No hay tareas en esta sección.
            </Typography>
          ) : (
            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {notasFiltradas.map((nota) => (
                <ListItem
                  key={nota.id}
                  disablePadding
                  sx={{
                    p: 1.5,
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    opacity: nota.completada ? 0.6 : 1,
                    "&:hover": {
                      borderColor: COLORS.blue,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, flex: 1, minWidth: 0 }}>
                    <Checkbox
                      checked={nota.completada}
                      onChange={() => handleToggleNota(nota.id)}
                      size="small"
                      sx={{ p: 0, mt: 0.2, color: COLORS.slate, "&.Mui-checked": { color: COLORS.blue } }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: COLORS.navy,
                          fontWeight: 500,
                          textDecoration: nota.completada ? "line-through" : "none",
                          wordBreak: "break-word",
                          lineHeight: 1.35,
                        }}
                      >
                        {nota.texto}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.8 }}>
                        <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: COLORS.slate }} />
                        <Typography sx={{ fontSize: "0.7rem", color: COLORS.slate }}>
                          {nota.fecha}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
                    {nota.prioridad === "alta" && !nota.completada && (
                      <Chip
                        label="Urgente"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.62rem",
                          backgroundColor: "#FEE2E2",
                          color: "#EF4444",
                          fontWeight: 700,
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleEliminarNota(nota.id)}
                      sx={{
                        color: COLORS.slate,
                        "&:hover": { color: "#EF4444" },
                      }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}