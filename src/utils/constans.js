export const COLORS = {
  navy: "#1E293B",
  blue: "#3B5EFF",
  blueDark: "#2C46D9",
  blueSoft: "#EEF1FF",
  slate: "#64748B",
  bgApp: "#DCEDEA",
  border: "#E5E7EB",
  cardDark: "#1E2A4A",
};

export const ASISTENCIA_COLORS = {
  P: { bg: "#DCFCE7", fg: "#166534", label: "Presente" },
  A: { bg: "#FEE2E2", fg: "#991B1B", label: "Ausente" },
  T: { bg: "#FEF3C7", fg: "#92400E", label: "Tardanza" },
  "": { bg: "#F1F5F9", fg: "#94A3B8", label: "Sin registro" },
};

export const TIPOS_EVALUACION = ["PC", "EP", "EF"];

export const TIPO_COLORS = {
  PC: { bg: "#DBEAFE", fg: "#1D4ED8" },
  EP: { bg: "#FEF3C7", fg: "#92400E" },
  EF: { bg: "#DCFCE7", fg: "#166534" },
};

export function notaColor(nota) {
  if (nota === null || nota === undefined) return { bg: "#F1F5F9", fg: "#94A3B8" };
  const n = Number(nota);
  if (isNaN(n)) return { bg: "#F1F5F9", fg: "#94A3B8" };
  if (n >= 13) return { bg: "#DCFCE7", fg: "#166534" };
  if (n >= 11) return { bg: "#FEF3C7", fg: "#92400E" };
  return { bg: "#FEE2E2", fg: "#991B1B" };
}