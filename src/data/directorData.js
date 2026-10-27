export const directorBimestres = [
  { id: 1, nombre: "Bimestre 1", estado: "Cerrado", color: "#64748B" },
  { id: 2, nombre: "Bimestre 2", estado: "Cerrado", color: "#64748B" },
  { id: 3, nombre: "Bimestre 3", estado: "Activo", color: "#0F766E" },
  { id: 4, nombre: "Bimestre 4", estado: "Pendiente", color: "#B45309" },
];

export const directorCursos = [
  { id: "matematica", nombre: "Matemática", area: "Ciencias", horas: 5 },
  { id: "comunicacion", nombre: "Comunicación", area: "Letras", horas: 5 },
  { id: "ciencia", nombre: "Ciencia y Tecnología", area: "Ciencias", horas: 4 },
  { id: "historia", nombre: "Historia", area: "Sociales", horas: 3 },
  { id: "aritmetica", nombre: "Aritmética", area: "Ciencias", horas: 3 },
  { id: "biologia", nombre: "Biología", area: "Ciencias", horas: 3 },
  { id: "geologia", nombre: "Geología", area: "Ciencias", horas: 2 },
  { id: "lenguaje", nombre: "Lenguaje", area: "Letras", horas: 3 },
  { id: "psicologia", nombre: "Psicología", area: "Letras", horas: 2 },
  { id: "quimica", nombre: "Química", area: "Ciencias", horas: 3 },
  { id: "razonamiento-matematico", nombre: "Razonamiento Matemático", area: "Ciencias", horas: 3 },
  { id: "razonamiento-verbal", nombre: "Razonamiento Verbal", area: "Letras", horas: 3 },
  { id: "trigonometria", nombre: "Trigonometría", area: "Ciencias", horas: 2 },
  { id: "razonamiento-psicotecnico", nombre: "Razonamiento Psicotécnico y Realidad Nacional Aplicada", area: "Formación", horas: 2 },
];

export const directorProfesores = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    iniciales: "CM",
    curso: "Matemática",
    cursos: ["Matemática", "Aritmética", "Biología", "Geología", "Química"],
    aula: "1A",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Ana Torres",
    iniciales: "AT",
    curso: "Comunicación",
    cursos: ["Comunicación", "Lenguaje", "Psicología", "Razonamiento Verbal", "Razonamiento Psicotécnico y Realidad Nacional Aplicada"],
    aula: "1B",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Luis Vargas",
    iniciales: "LV",
    curso: "Ciencia y Tecnología",
    cursos: ["Ciencia y Tecnología", "Historia", "Razonamiento Matemático", "Trigonometría"],
    aula: "1A",
    estado: "Activo",
  },
];

const DIRECTOR_PROFESORES_KEY = "director_profesores";
export const DIRECTOR_PROFESORES_EVENT = "director-profesores-updated";

export function getDirectorProfesores() {
  try {
    const saved = localStorage.getItem(DIRECTOR_PROFESORES_KEY);
    if (!saved) return directorProfesores;

    const profesores = JSON.parse(saved);
    return Array.isArray(profesores) ? profesores : directorProfesores;
  } catch {
    return directorProfesores;
  }
}

export function saveDirectorProfesores(profesores) {
  localStorage.setItem(DIRECTOR_PROFESORES_KEY, JSON.stringify(profesores));
  window.dispatchEvent(new Event(DIRECTOR_PROFESORES_EVENT));
}

export const directorAulas = {
  "1A": [
    { id: 1, nombre: "Ana Torres", codigo: "AL-001" },
    { id: 2, nombre: "Bruno Salas", codigo: "AL-002" },
    { id: 3, nombre: "Camila Rojas", codigo: "AL-003" },
    { id: 4, nombre: "Diego Vargas", codigo: "AL-004" },
    { id: 5, nombre: "Elena Leon", codigo: "AL-005" },
  ],
  "1B": [
    { id: 6, nombre: "Fabricio Leon", codigo: "AL-006" },
    { id: 7, nombre: "Gabriela Mendoza", codigo: "AL-007" },
    { id: 8, nombre: "Hugo Castillo", codigo: "AL-008" },
    { id: 9, nombre: "Isabel Paredes", codigo: "AL-009" },
  ],
};

export const directorNotasIniciales = {
  "3|1A|Matemática": {
    columnas: ["PC 12/08", "Tarea 19/08", "Examen 02/09"],
    notas: {
      1: [15, 18, 14],
      2: [11, 13, 10],
      3: [17, 19, 16],
      4: [9, 12, 11],
      5: [14, 15, 15],
    },
  },
};

export const directorResumen = [
   { label: "Alumnos", value: String(Object.values(directorAulas).flat().length), detail: "En 2 aulas", color: "#2563EB" },
    { label: "Profesores", value: String(directorProfesores.length), detail: "Equipo activo", color: "#0F766E" },
    { label: "Cursos", value: String(directorCursos.length), detail: "Plan académico completo", color: "#B45309" },
  { label: "Promedio general", value: "15.8", detail: "Bimestre 3", color: "#7C3AED" },
];
