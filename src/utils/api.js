// ================================================================
//  API ESTUDIANTE  (backend PHP + MariaDB en XAMPP)
// ================================================================
import { request, descargarPdf } from "./http";

export const api = {
  loginEstudiante: (usuario, clave) => request("login_est", { usuario, clave }),
  getNotas: (nombre, salon) => request("get_notas", { nombre, salon }),
  getAsistencia: (nombre, salon) => request("get_asist", { nombre, salon }),
  // Notas + asistencia en una sola llamada (Dashboard)  ->  { notas, asistencia }
  getTodo: (nombre, salon) => request("get_todo", { nombre, salon }),
  // Descarga la boleta del alumno que inició sesión (PDF generado en el backend)
  descargarBoleta: (bimestre) => descargarPdf("pdf_informe", { bimestre }, "Boleta.pdf"),
};
