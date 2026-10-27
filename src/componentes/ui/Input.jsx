import { TextField } from "@mui/material";
import { COLORS } from "../../utils/constants";

export default function Input({ sx = {}, ...props }) {
  return (
    <TextField
      fullWidth
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          fontSize: "0.875rem",
          "& fieldset": { borderColor: COLORS.border },
          "&:hover fieldset": { borderColor: COLORS.blue },
          "&.Mui-focused fieldset": { borderColor: COLORS.blue },
        },
        ...sx,
      }}
      {...props}
    />
  );
}