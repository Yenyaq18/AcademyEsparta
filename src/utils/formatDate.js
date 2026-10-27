export function toDDMM(date) {
  const d = date instanceof Date ? date : new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

export function toDDMMYYYY(date) {
  const d = date instanceof Date ? date : new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const DIAS_ES = {
  dom: "domingo",
  domingo: "domingo",
  lun: "lunes",
  lunes: "lunes",
  mar: "martes",
  martes: "martes",
  mié: "miércoles",
  mie: "miércoles",
  miércoles: "miércoles",
  miercoles: "miércoles",
  jue: "jueves",
  jueves: "jueves",
  vie: "viernes",
  viernes: "viernes",
  sáb: "sábado",
  sab: "sábado",
  sábado: "sábado",
  sabado: "sábado",
};

export function normalizarDia(dia) {
  const clave = String(dia || "").trim().toLowerCase();
  return DIAS_ES[clave] || "día no disponible";
}