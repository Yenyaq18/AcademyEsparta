// ================================================================
//  API PROFESOR  (backend PHP + MariaDB en XAMPP)
// ================================================================
import { request, descargarPdf } from "./http";

export const apiAdmin = {
  login: (profesor, clave) => request("login", { profesor, clave }, "POST"),
  getConfig: (profesor) => request("get_config", { profesor }),
  getAlumnos: (salon, curso) => request("get_alumnos", { salon, curso }),
  getAlumnosPorSalon: () => request("get_alumnos_por_salon"),
  getNotasBim: (bimestre, salon, curso) => request("get_notas_bim", { bimestre, salon, curso }),
  getInforme: (bimestre, salon, alumno) => request("get_informe", { bimestre, salon, alumno }),
  guardarNotas: (bimestre, salon, curso, profesor, fecha, tipo, datos) =>
    request("guardar_notas", { bimestre, salon, curso, profesor, fecha, tipo, datos }, "POST"),
  editarNota: (bimestre, salon, curso, alumno, col_idx, nueva_nota) =>
    request("editar_nota", { bimestre, salon, curso, alumno, col_idx, nueva_nota }, "POST"),
  agregarAlumno: (alumno, salon, tutor) => request("agregar_alumno", { alumno, salon, tutor }, "POST"),
  // Asistencia
  getAsistenciaDia: (salon, fecha) => request("get_asistencia_dia", { salon, fecha }),
  guardarAsistencia: (fecha, datos) => request("guardar_asistencia", { fecha, datos }, "POST"),
  // PDF generados por el backend
  pdfInforme: (bimestre, salon, alumno, observacion) => descargarPdf("pdf_informe", { bimestre, salon, alumno, observacion }, "Informe.pdf"),
  pdfRegistro: (bimestre, salon, curso) => descargarPdf("pdf_registro", { bimestre, salon, curso }, "Registro.pdf"),
  pdfAsistencia: (salon, fecha) => descargarPdf("pdf_asistencia", { salon, fecha }, "Asistencia.pdf"),
};
