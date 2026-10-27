import { Box } from "@mui/material";

export default function Badge({ children, bg = "#E2E8F0", fg = "#334155" }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        backgroundColor: bg,
        color: fg,
        fontWeight: 700,
        fontSize: "0.72rem",
        px: 1.1,
        py: 0.35,
        borderRadius: "999px",
        lineHeight: 1.4,
      }}
    >
      {children}
    </Box>
  );
}