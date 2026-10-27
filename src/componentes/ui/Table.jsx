import { Box } from "@mui/material";
import { COLORS } from "../../utils/constants";

/**
 * Tabla genérica y reutilizable.
 * columns: [{ key, label, align, render(row) }]
 * rows: array de objetos
 */
export default function Table({ columns, rows, emptyLabel = "No hay datos para mostrar." }) {
  return (
    <Box sx={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <Box component="thead">
          <Box component="tr" sx={{ backgroundColor: "#F8FAFC" }}>
            {columns.map((col) => (
              <Box
                component="th"
                key={col.key}
                sx={{
                  textAlign: col.align || "left",
                  px: 2,
                  py: 1.4,
                  fontWeight: 700,
                  color: COLORS.navy,
                  whiteSpace: "nowrap",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {col.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.length === 0 ? (
            <Box component="tr">
              <Box
                component="td"
                colSpan={columns.length}
                sx={{ textAlign: "center", py: 5, color: COLORS.slate }}
              >
                {emptyLabel}
              </Box>
            </Box>
          ) : (
            rows.map((row, i) => (
              <Box
                component="tr"
                key={row.id ?? i}
                sx={{
                  "&:hover": { backgroundColor: "#F8FAFC" },
                  "&:not(:last-of-type)": { borderBottom: `1px solid ${COLORS.border}` },
                }}
              >
                {columns.map((col) => (
                  <Box
                    component="td"
                    key={col.key}
                    sx={{ textAlign: col.align || "left", px: 2, py: 1.2 }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}