import { useState } from "react";
import { Box, Typography, InputBase } from "@mui/material";
import GradeStatus from "./GradesStatus";
import { COLORS, TIPO_COLORS } from "../../utils/constants";

/**
 * columnas: string[]  -> etiquetas "TIPO dd/mm"
 * colIndices: number[] -> índice real de columna en el sheet (para editar_nota)
 * notas: { [alumno]: string[] } -> un valor por columna, alineado con `columnas`
 * onEditCell(alumno, colIdx, nuevaNota)
 */
export default function GradesTable({ columnas, colIndices, notas, onEditCell }) {
  const [editing, setEditing] = useState(null); // `${alumno}__${col}`
  const [draft, setDraft] = useState("");

  const alumnos = Object.keys(notas).sort();

  const tipoOf = (label) => label.split(" ")[0];

  const startEdit = (alumno, col, value) => {
    setEditing(`${alumno}__${col}`);
    setDraft(value === "S.N." ? "" : value);
  };

  const commitEdit = async (alumno, col) => {
    const colIdx = colIndices[col];
    await onEditCell(alumno, colIdx, draft.trim());
    setEditing(null);
  };

  if (alumnos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6, color: COLORS.slate }}>
        No hay notas registradas para este bimestre / salón / curso todavía.
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <Box component="thead">
          <Box component="tr" sx={{ backgroundColor: "#F8FAFC" }}>
            <Box
              component="th"
              sx={{
                position: "sticky",
                left: 0,
                backgroundColor: "#F8FAFC",
                textAlign: "left",
                px: 2,
                py: 1.4,
                fontWeight: 700,
                color: COLORS.navy,
                borderBottom: `1px solid ${COLORS.border}`,
                whiteSpace: "nowrap",
                zIndex: 1,
              }}
            >
              Alumno
            </Box>
            {columnas.map((col, i) => {
              const tipo = tipoOf(col);
              const c = TIPO_COLORS[tipo] || { bg: "#E2E8F0", fg: "#1E293B" };
              return (
                <Box
                  component="th"
                  key={i}
                  sx={{
                    textAlign: "center",
                    px: 1.5,
                    py: 1.4,
                    fontWeight: 700,
                    color: c.fg,
                    backgroundColor: c.bg,
                    borderBottom: `1px solid ${COLORS.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box component="tbody">
          {alumnos.map((alumno) => (
            <Box
              component="tr"
              key={alumno}
              sx={{
                "&:hover": { backgroundColor: "#F8FAFC" },
                "&:not(:last-of-type)": { borderBottom: `1px solid ${COLORS.border}` },
              }}
            >
              <Box
                component="td"
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#FFFFFF",
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  color: COLORS.navy,
                  whiteSpace: "nowrap",
                }}
              >
                {alumno}
              </Box>
              {notas[alumno].map((valor, col) => {
                const key = `${alumno}__${col}`;
                const isEditing = editing === key;
                return (
                  <Box
                    component="td"
                    key={col}
                    onClick={() => !isEditing && startEdit(alumno, col, valor)}
                    sx={{ textAlign: "center", px: 1, py: 0.8, cursor: "pointer" }}
                  >
                    {isEditing ? (
                      <InputBase
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commitEdit(alumno, col)}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit(alumno, col)}
                        inputProps={{
                          style: { textAlign: "center", padding: "2px 4px", width: 48 },
                        }}
                        sx={{
                          border: `1px solid ${COLORS.blue}`,
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                        }}
                      />
                    ) : (
                      <GradeStatus nota={valor} />
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
      <Typography sx={{ fontSize: "0.72rem", color: COLORS.slate, px: 2, py: 1 }}>
        Haz clic sobre una nota para editarla.
      </Typography>
    </Box>
  );
}