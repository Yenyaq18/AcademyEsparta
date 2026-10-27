import { Box, Typography } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function Footer() {
  return (
    <Box sx={{ px: 3, py: 2, textAlign: "center" }}>
      <Typography sx={{ fontSize: "0.72rem", color: COLORS.slate }}>
        © {new Date().getFullYear()} Academia — Portal del Estudiante
      </Typography>
    </Box>
  );
}