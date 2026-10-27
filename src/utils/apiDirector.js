// ================================================================
//  API DIRECTOR  (backend PHP + MariaDB en XAMPP)
// ================================================================
import { request } from "./http";

export const apiDirector = {
  login: (usuario, clave) => request("login_dir", { usuario, clave }),
  resumen: () => request("dir_resumen"),
  promedios: () => request("dir_promedios"),
  bimestres: () => request("dir_bimestres"),
  setBimestre: (nombre, habilitado) => request("set_bimestre", { nombre, habilitado: habilitado ? 1 : 0 }, "POST"),
  aulas: () => request("dir_aulas"),
  profesores: () => request("dir_profesores"),
  cursos: () => request("dir_cursos"),
  guardarCurso: (curso_id, horas, area, profesor_id) =>
    request("dir_guardar_curso", { curso_id, horas, area, profesor_id }, "POST"),
  agregarProfesor: (datos) => request("dir_agregar_profesor", datos, "POST"),
  profesorCurso: (profesor_id, curso, accion) => request("dir_prof_curso", { profesor_id, curso, accion }, "POST"),
};
