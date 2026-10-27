
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  Link,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../hooks/useAuth";

const GREEN = "#1DB954";
const GREEN_DARK = "#159a46";

export default function Login() {
  const navigate = useNavigate();
  const { loginAuto } = useAuth();
  const [role, setRole] = useState("estudiante"); // "estudiante" | "admin" | "director"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      // Asignamos la acción exacta que tu backend (api.js) espera según el rol seleccionado:
      // - Estudiante -> 'login_est'
      // - Profesor/Admin -> 'login'
      // - Director -> 'login_dir'
      let accionBackend = "login";
      if (role === "estudiante") {
        accionBackend = "login_est";
      } else if (role === "director") {
        accionBackend = "login_dir";
      }

      // Enviamos la petición al servidor con la acción y las credenciales reales
      const session = await loginAuto({ 
        action: accionBackend, 
        usuario: username, 
        password 
      });

      const destino = {
        admin: "/admin/dashboard",
        director: "/director/dashboard",
        estudiante: "/estudiante/dashboard",
      };
      
      navigate(destino[session.role] || "/login");
    } catch (err) {
      setError(err.message || "Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiInput-underline:before": { borderBottomColor: "rgba(255,255,255,0.25)" },
    "& .MuiInput-underline:hover:before": { borderBottomColor: "rgba(255,255,255,0.45)" },
    "& .MuiInput-underline:after": { borderBottomColor: GREEN },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
      fontSize: "0.9rem",
      py: 0.8,
    },
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(255,255,255,0.45)",
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100svh",
        width: "100%",
        overflow: "auto",
        backgroundImage: `url('https://i.imgur.com/fpn7q6k.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Capa oscura sobre la foto */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(2,10,6,0.75) 0%, rgba(2,10,6,0.35) 45%, rgba(2,10,6,0.15) 100%)",
        }}
      />

      {/* Botón atrás */}
      <IconButton
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 24 },
          left: { xs: 12, sm: 24 },
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.12)",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
        }}
      >
        <ArrowBackIosNewRoundedIcon fontSize="small" />
      </IconButton>

      {/* Contenido principal */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 3, md: 4 },
          py: { xs: 4, sm: 6, md: 4 },
          boxSizing: "border-box",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 980,
            backgroundColor: "transparent",
            boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: { xs: 2.5, sm: 3.5 },
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Bienvenida */}
          <Box
            sx={{
              flex: 1,
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 6, md: 7 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "rgba(4,10,8,0.35)",
              backdropFilter: "blur(4px)",
              borderBottom: { xs: "1px solid rgba(255,255,255,0.12)", md: "none" },
              minHeight: { md: 480 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SchoolRoundedIcon sx={{ color: "#FFFFFF" }} />
              <Typography sx={{ color: "#FFFFFF", fontWeight: 700, letterSpacing: 0.5 }}>
                ACADEMIA
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: { xs: "1.9rem", sm: "2.4rem" },
                lineHeight: 1.15,
                mb: 1.5,
              }}
            >
              Bienvenido de nuevo
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Inicia sesión para continuar con tus cursos, calificaciones y todo
              tu portal académico en un solo lugar.
            </Typography>
          </Box>

          {/* Formulario de acceso */}
          <Box
            sx={{
              flex: 1,
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 6, md: 7 },
              display: "flex",
              gap: 2,
              backgroundColor: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(8px)",
              minHeight: { md: 480 },
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Selector de Roles: Estudiante, Profesor y Director */}
              <Box
                sx={{
                  display: "inline-flex",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  p: 0.4,
                  mb: 3,
                  gap: 0.5,
                }}
              >
                {[
                  { key: "estudiante", label: "Estudiante" },
                  { key: "admin", label: "Profesor" },
                  { key: "director", label: "Director" },
                ].map((opt) => (
                  <Box
                    key={opt.key}
                    onClick={() => setRole(opt.key)}
                    sx={{
                      px: 1.8,
                      py: 0.6,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      color: role === opt.key ? "#0B1220" : "rgba(255,255,255,0.6)",
                      backgroundColor: role === opt.key ? GREEN : "transparent",
                    }}
                  >
                    {opt.label}
                  </Box>
                ))}
              </Box>

              <Typography sx={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1.4rem", mb: 3 }}>
                Iniciar sesión ({role})
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                variant="standard"
                placeholder={role === "admin" ? "Nombre del profesor" : "Usuario"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ ...fieldSx, mb: 3 }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ ...fieldSx, mb: 4 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.1,
                  borderRadius: 1.5,
                  backgroundColor: GREEN,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&:hover": { backgroundColor: GREEN_DARK },
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Iniciar sesión"}
              </Button>

             
            </Box>

            {/* Divisor + Redes Sociales */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                pl: 2,
                flexShrink: 0,
                borderLeft: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                O
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <IconButton
                  size="small"
                  sx={{ backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: "#F1F5F9" } }}
                >
                  <FacebookIcon fontSize="small" sx={{ color: "#1E293B" }} />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: "#F1F5F9" } }}
                >
                  <TwitterIcon fontSize="small" sx={{ color: "#1E293B" }} />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: "#F1F5F9" } }}
                >
                  <GoogleIcon fontSize="small" sx={{ color: "#1E293B" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Presentado por */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 2,
          left: 24,
          bottom: 24,
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "999px",
          px: 1.8,
          py: 0.7,
        }}
      >
        <SchoolRoundedIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
        <Typography sx={{ color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600 }}>
          presentado por Academia
        </Typography>
      </Box>
    </Box>
  );
}