import { Box, Typography } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function StatCard({ label, value, icon: Icon, color = COLORS.blue }) {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "14px",
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "12px",
          backgroundColor: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ color }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: COLORS.navy, lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: COLORS.slate }}>{label}</Typography>
      </Box>
    </Box>
  );
}