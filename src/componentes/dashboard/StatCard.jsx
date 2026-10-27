import { Box, Typography } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function StatCard({ label, value, icon: Icon, color = COLORS.blue }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        p: 1.5,
        borderRadius: "14px",
        border: `1px solid ${COLORS.border}`,
        backgroundColor: "#FFFFFF",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "11px",
          backgroundColor: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Icon && <Icon sx={{ color }} />}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: COLORS.navy, lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}