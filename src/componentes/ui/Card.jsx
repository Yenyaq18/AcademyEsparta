import { Box, Typography } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function Card({ title, action, children, sx = {} }) {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "16px",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        overflow: "hidden",
        ...sx,
      }}
    >
      {(title || action) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
          }}
        >
          {title && (
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: COLORS.navy }}>
              {title}
            </Typography>
          )}
          {action}
        </Box>
      )}
      <Box sx={{ px: 2.5, pb: 2.5, pt: title ? 0 : 2.5 }}>{children}</Box>
    </Box>
  );
}