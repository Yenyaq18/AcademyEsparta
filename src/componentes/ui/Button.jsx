import { Button as MuiButton, CircularProgress } from "@mui/material";
import { COLORS } from "../../utils/constants";

/**
 * Botón base del sistema.
 * variant: "primary" | "secondary" | "outline" | "danger"
 */
export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  sx = {},
  ...props
}) {
  const variants = {
    primary: {
      backgroundColor: COLORS.blue,
      color: "#FFFFFF",
      "&:hover": { backgroundColor: COLORS.blueDark },
    },
    secondary: {
      backgroundColor: COLORS.navy,
      color: "#FFFFFF",
      "&:hover": { backgroundColor: "#0B1220" },
    },
    outline: {
      backgroundColor: "transparent",
      color: COLORS.navy,
      border: `1px solid ${COLORS.border}`,
      "&:hover": { backgroundColor: "#F8FAFC" },
    },
    danger: {
      backgroundColor: "#DC2626",
      color: "#FFFFFF",
      "&:hover": { backgroundColor: "#B91C1C" },
    },
  };

  return (
    <MuiButton
      disableElevation
      fullWidth={fullWidth}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      disabled={loading || props.disabled}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: "10px",
        py: 1,
        px: 2.2,
        fontSize: "0.875rem",
        ...variants[variant],
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={18} color="inherit" /> : children}
    </MuiButton>
  );
}