import { directorAulas, directorCursos, directorNotasIniciales } from "../data/directorData";

// Utilidades de promedios para el panel del director.
// 👉 Va en src/utils/directorStats.js

const numeros = (valores) => valores.map(Number).filter((n) => !Number.isNaN(n));

export const promedioDe = (lista) =>
  lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : null;

export function valoresDe(bimestre, aula, curso, store = directorNotasIniciales) {
  const datos = store[`${bimestre}|${aula}|${curso}`];
  return datos ? numeros(Object.values(datos.notas).flat()) : [];
}

export const promedioCursoAula = (bimestre, aula, curso, store) =>
  promedioDe(valoresDe(bimestre, aula, curso, store));

export const promedioCurso = (bimestre, curso, store) =>
  promedioDe(Object.keys(directorAulas).flatMap((aula) => valoresDe(bimestre, aula, curso, store)));

export const promedioBimestre = (bimestre, store) =>
  promedioDe(
    Object.keys(directorAulas).flatMap((aula) =>
      directorCursos.flatMap((c) => valoresDe(bimestre, aula, c.nombre, store))
    )
  );