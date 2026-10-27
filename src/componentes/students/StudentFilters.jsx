import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Input from "../ui/Input";

export default function StudentFilters({ salones, salon, onSalonChange, search, onSearchChange }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Salón</InputLabel>
        <Select value={salon} label="Salón" onChange={(e) => onSalonChange(e.target.value)}>
          {salones.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Input
        placeholder="Buscar alumno..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ maxWidth: 260 }}
        InputProps={{
          startAdornment: <SearchRoundedIcon fontSize="small" sx={{ mr: 1, color: "#94A3B8" }} />,
        }}
      />
    </Box>
  );
}