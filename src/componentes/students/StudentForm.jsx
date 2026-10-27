import { Box } from "@mui/material";
import Input from "../ui/Input";

/**
 * Formulario controlado desde el padre (sin estado propio) para
 * poder reutilizarlo dentro de un Modal.
 */
export default function StudentForm({ value, onChange }) {
  const set = (field) => (e) => onChange({ ...value, [field]: e.target.value });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input label="Nombre del alumno" value={value.alumno} onChange={set("alumno")} autoFocus />
      <Input label="Salón" value={value.salon} onChange={set("salon")} />
      <Input label="Tutor (opcional)" value={value.tutor} onChange={set("tutor")} />
    </Box>
  );
}