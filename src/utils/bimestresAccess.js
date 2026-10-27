// Antes el estado habilitado/deshabilitado se guardaba en localStorage (solo en ese navegador).
// Ahora viene de la base de datos (tabla bimestres), así que simplemente se respeta lo que manda la API.
export function getBimestresProfesor(bimestres) {
  return bimestres.map((b) => ({ ...b, habilitado: Boolean(b.habilitado) }));
}

export function saveBimestresProfesor() {
  /* ya no se usa: el director cambia el estado con apiDirector.setBimestre() */
}
