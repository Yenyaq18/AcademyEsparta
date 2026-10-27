import { Box, CircularProgress, Typography } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function Loader({ label = "Cargando..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 6,
      }}
    >
      <CircularProgress size={28} sx={{ color: COLORS.blue }} />
      <Typography sx={{ color: COLORS.slate, fontSize: "0.85rem" }}>{label}</Typography>
    </Box>
  );
}