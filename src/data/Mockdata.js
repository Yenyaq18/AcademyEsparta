// ================================================================
//  MOCK DATA — datos de prueba para trabajar 100% en frontend
//  sin depender de los backends de Apps Script todavía.
//  Las formas (shapes) calzan exactamente con lo que devolverían
//  api.js / apiAdmin.js, así que cambiar a datos reales después
//  es solo reemplazar la fuente, no tocar ninguna página.
// ================================================================

// ---------- CONFIG DEL PROFESOR (equivalente a get_config) ----------
export const mockConfigProfesor = {
  bimestres: [
    { nombre: "BIMESTRE 1", habilitado: false, inicio: "03/03/2026", fin: "08/05/2026" },
    { nombre: "BIMESTRE 2", habilitado: false, inicio: "11/05/2026", fin: "17/07/2026" },
    { nombre: "BIMESTRE 3", habilitado: true, inicio: "03/08/2026", fin: "09/10/2026" },
    { nombre: "BIMESTRE 4", habilitado: false, inicio: "12/10/2026", fin: "18/12/2026" },
  ],
  cursos: ["Matemática", "Comunicación", "Ciencia y Tecnología"],
  salones: ["1A", "1B", "2A"],
};

// ---------- ALUMNOS POR SALÓN (equivalente a get_alumnos) ----------
export const mockAlumnosPorSalon = {
  "1A": ["Ana Torres", "Bruno Salas", "Camila Rojas", "Diego Vargas", "Elena Ríos"],
  "1B": ["Fabricio León", "Gabriela Mendoza", "Hugo Castillo"],
  "2A": ["Isabel Paredes", "Joaquín Herrera", "Karla Núñez", "Luis Fernández"],
};

// ---------- NOTAS POR BIMESTRE / SALÓN / CURSO (equivalente a get_notas_bim) ----------
// Estructura: { columnas, col_indices, notas: { alumno: [valores por columna] } }
export const mockNotasBim = {
  "BIMESTRE 3|1A|Matemática": {
    columnas: ["PC 12/08", "TAREA 19/08", "EXAMEN 02/09"],
    col_indices: [3, 4, 5],
    notas: {
      "Ana Torres": ["15", "18", "14"],
      "Bruno Salas": ["11", "13", "10"],
      "Camila Rojas": ["17", "19", "16"],
      "Diego Vargas": ["09", "12", "S.N."],
      "Elena Ríos": ["14", "15", "15"],
    },
  },
};

// ---------- NOTAS DEL ESTUDIANTE (equivalente a get_notas) ----------
export const mockNotasEstudiante = {
  bimestres: [
    {
      nombre: "BIMESTRE 1",
      cursos: [
        {
          curso: "Matemática",
          notas: {
            PC: [{ fecha: "10/03", nota: 14 }, { fecha: "24/03", nota: 16 }],
            TAREA: [{ fecha: "17/03", nota: 15 }],
            ACTITUD: [{ fecha: "31/03", nota: 18 }],
            EXAMEN: [{ fecha: "21/04", nota: 13 }],
          },
          promedios: { PC: 15, TAREA: 15, ACTITUD: 18, EXAMEN: 13, FINAL: 15.3 },
        },
        {
          curso: "Comunicación",
          notas: {
            PC: [{ fecha: "12/03", nota: 17 }],
            TAREA: [{ fecha: "19/03", nota: 16 }],
            ACTITUD: [{ fecha: "02/04", nota: 17 }],
            EXAMEN: [{ fecha: "23/04", nota: 15 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 17, EXAMEN: 15, FINAL: 16.3 },
        },
      ],
    },
    {
      nombre: "BIMESTRE 2",
      cursos: [
        {
          curso: "Matemática",
          notas: {
            PC: [{ fecha: "15/05", nota: 12 }],
            TAREA: [{ fecha: "22/05", nota: 14 }],
            ACTITUD: [{ fecha: "05/06", nota: 16 }],
            EXAMEN: [{ fecha: "26/06", nota: 11 }],
          },
          promedios: { PC: 12, TAREA: 14, ACTITUD: 16, EXAMEN: 11, FINAL: 13.3 },
        },
        {
          curso: "Ciencia y Tecnología",
          notas: {
            PC: [{ fecha: "18/05", nota: 18 }],
            TAREA: [{ fecha: "25/05", nota: 17 }],
            ACTITUD: [{ fecha: "08/06", nota: 19 }],
            EXAMEN: [{ fecha: "29/06", nota: 17 }],
          },
          promedios: { PC: 18, TAREA: 17, ACTITUD: 19, EXAMEN: 17, FINAL: 17.8 },
        },
      ],
    },
    {
      nombre: "BIMESTRE 3",
      cursos: [
        {
          curso: "Matemática",
          notas: {
            PC: [{ fecha: "12/08", nota: 15 }],
            TAREA: [{ fecha: "19/08", nota: 18 }],
            ACTITUD: [],
            EXAMEN: [{ fecha: "02/09", nota: 14 }],
          },
          promedios: { PC: 15, TAREA: 18, ACTITUD: null, EXAMEN: 14, FINAL: 15.7 },
        },
        {
          curso: "Comunicación",
          notas: {
            PC: [{ fecha: "14/08", nota: 16 }],
            TAREA: [{ fecha: "21/08", nota: 15 }],
            ACTITUD: [{ fecha: "04/09", nota: 17 }],
            EXAMEN: [],
          },
          promedios: { PC: 16, TAREA: 15, ACTITUD: 17, EXAMEN: null, FINAL: 16 },
        },
        {
          curso: "Aritmética",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
          {
          curso: "Biologia",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
          {
          curso: "Geologia",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
          {
          curso: "Historia",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
              {
          curso: "Lenguaje",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
      {
          curso: "Psicologia",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
      {
          curso: "Quimica",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
            {
          curso: "Razonamiento Matematico",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
     {
          curso: "Razonamiento Verbal",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
            {
          curso: "Trigonometria",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },
             {
          curso: "Razonamiento psicotecnico y realidad nacional aplicada",
          notas: {
            PC: [{ fecha: "16/08", nota: 17 }],
            TAREA: [{ fecha: "23/08", nota: 16 }],
            ACTITUD: [{ fecha: "06/09", nota: 18 }],
            EXAMEN: [{ fecha: "13/09", nota: 17 }],
          },
          promedios: { PC: 17, TAREA: 16, ACTITUD: 18, EXAMEN: 17, FINAL: 17 },
        },

      ],
    },
    { nombre: "BIMESTRE 4", cursos: [] },
  ],
};

// ---------- ASISTENCIA DEL ESTUDIANTE (equivalente a get_asist) ----------
function generarRegistrosAsistencia() {
  const estados = ["P", "P", "P", "P", "T", "P", "A", "P", "P", "P", "P", "T", "P", "P", "A"];
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const registros = [];
  const inicio = new Date(2026, 7, 3); // 03/08/2026
  for (let i = 0; i < estados.length; i++) {
    const fecha = new Date(inicio);
    fecha.setDate(inicio.getDate() + i);
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    registros.push({
      fecha: `${dd}/${mm}/${fecha.getFullYear()}`,
      dia: dias[fecha.getDay()],
      estado: estados[i],
    });
  }
  return registros;
}

export const mockAsistenciaEstudiante = (() => {
  const registros = generarRegistrosAsistencia();
  const P = registros.filter((r) => r.estado === "P").length;
  const A = registros.filter((r) => r.estado === "A").length;
  const T = registros.filter((r) => r.estado === "T").length;
  const total = P + A + T;
  return { registros, resumen: { P, A, T, total, pct_asist: Math.round((P / total) * 100) } };
})();

// Sesión del estudiante demo (usada por AuthContext mientras no hay backend)
export const mockSesionEstudiante = { usuario: "demo", nombre: "Ana Torres", salon: "1A" };

// Sesión del profesor demo
export const mockSesionAdmin = {
  profesor: "Profesor Demo",
  cursos: mockConfigProfesor.cursos,
  salones: mockConfigProfesor.salones,
};