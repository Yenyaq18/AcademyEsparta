    import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { adminMenuItems, directorMenuItems, studentMenuItems } from "../../data/menuItems";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../utils/constants";

const LOGO_URL = "https://i.imgur.com/8Nmku28.png";

export default function Sidebar({ role = "estudiante" }) {
  const { logout } = useAuth();
  const location = useLocation();
  // Los datos del menú se encuentran en src/data/menuItems.jsx.
  // Aquí se decide si se muestra el menú de profesor o el de estudiante.
  const items = role === "admin" ? adminMenuItems : role === "director" ? directorMenuItems : studentMenuItems;
  const [bimestresOpen, setBimestresOpen] = useState(
    location.pathname.startsWith("/estudiante/bimestre/")
  );

  return (
    <Box
      component="nav"
      sx={{
        width: 230,
        flexShrink: 0,
        height: "100vh",
        maxHeight: "100vh",
        position: "sticky",
        top: 0,
        background: "linear-gradient(160deg, #0D6B65 0%, #0F8178 48%, #084B4A 100%)",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        py: 3,
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 3, mb: 4 }}>
          <Box
            component="img"
            src={LOGO_URL}
            alt="Logo de Academia"
            sx={{
              width: 40,
              height: 40,
              p: 0.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #E4F1EF 0%, #C9E5DF 100%)",
              border: "1px solid rgba(255,255,255,0.7)",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#FFFFFF", fontSize: "0.9rem", lineHeight: 1.1 }}>
              Academia
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
              {role === "admin" ? "Panel administrador" : role === "director" ? "Panel director" : "Panel del estudiante"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, px: 2 }}>
          {items.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isActive = item.children.some((child) => location.pathname === child.path);
              const Arrow = bimestresOpen ? ExpandLessRoundedIcon : ExpandMoreRoundedIcon;

              return (
                <Box key={item.label}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setBimestresOpen((open) => !open)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.4,
                      px: 2,
                      py: 1.1,
                      border: 0,
                      borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                      borderRadius: "10px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(159,230,217,0.12))"
                        : "transparent",
                      color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.76)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                      "& svg": { color: "inherit" },
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" },
                    }}
                  >
                    <Icon sx={{ fontSize: 19 }} />
                    <Box component="span" sx={{ flex: 1 }}>{item.label}</Box>
                    <Arrow sx={{ fontSize: 19 }} />
                  </Box>

                  {bimestresOpen && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, pl: 2.5, pt: 0.4 }}>
                      {item.children.map((child) => (
                        <Box
                          key={child.path}
                          component={NavLink}
                          to={child.path}
                          end
                          sx={{
                            display: "block",
                            px: 2,
                            py: 0.8,
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" },
                            "&.active": { backgroundColor: "rgba(255,255,255,0.18)", color: "#FFFFFF" },
                          }}
                        >
                          {child.label}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            }

            return (
              <Box
                key={item.path}
                component={NavLink}
                to={item.path}
                end
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.4,
                  px: 2,
                  py: 1.1,
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  borderLeft: "3px solid transparent",
                  "& svg": { color: "inherit" },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" },
                  "&.active": {
                    background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(159,230,217,0.12))",
                    color: "#FFFFFF",
                    borderLeft: "3px solid #9FE6D9",
                  },
                }}
              >
                <Icon sx={{ fontSize: 19 }} />
                {item.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box
        onClick={logout}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          px: 3,
          py: 1.1,
          mx: 2,
          mt: 1,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          flexShrink: 0,
          borderRadius: "8px",
          color: "rgba(255,255,255,0.76)",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          "&:hover": { color: "#FCA5A5" },
        }}
      >
        <LogoutRoundedIcon sx={{ fontSize: 22 }} />
        Cerrar sesión
      </Box>
    </Box>
  );
}