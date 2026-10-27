import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CalendarViewMonthRoundedIcon from "@mui/icons-material/CalendarViewMonthRounded";

// ---- Panel del ADMINISTRADOR (profesor) — ve todo ----
export const adminMenuItems = [
  { label: "Panel general", path: "/admin/dashboard", icon: DashboardRoundedIcon },
  { label: "Datos alumnos", path: "/admin/alumnoS", icon: GroupRoundedIcon },
  { label: "Cursos", path: "/admin/cursos", icon: MenuBookRoundedIcon },
  { label: "Asistencia", path: "/admin/asistencia", icon: FactCheckRoundedIcon },
  { label: "Reportes", path: "/admin/reportes", icon: SummarizeRoundedIcon },
];

// ---- Panel del ESTUDIANTE — solo lo suyo ----
export const studentMenuItems = [
  { label: "Panel general", path: "/estudiante/dashboard", icon: DashboardRoundedIcon },
  {
    label: "Notas",
    icon: CalendarViewMonthRoundedIcon,
    children: [
      { label: "Bimestre 1", path: "/estudiante/bimestre/1" },
      { label: "Bimestre 2", path: "/estudiante/bimestre/2" },
      { label: "Bimestre 3", path: "/estudiante/bimestre/3" },
      { label: "Bimestre 4", path: "/estudiante/bimestre/4" },
    ],
  },
  { label: "Asistencias", path: "/estudiante/asistencia", icon: EventNoteRoundedIcon },
  { label: "Gráficos", path: "/estudiante/graficos", icon: BarChartRoundedIcon },
];

// ---- Panel del DIRECTOR ----
export const directorMenuItems = [
  { label: "Bimestres", path: "/director/bimestres", icon: CalendarViewMonthRoundedIcon },
  { label: "Panel general", path: "/director/dashboard", icon: DashboardRoundedIcon },
  { label: "Profesores", path: "/director/profesores", icon: GroupRoundedIcon },
  { label: "Cursos", path: "/director/cursos", icon: MenuBookRoundedIcon },
  { label: "Modificar notas", path: "/director/notas", icon: FactCheckRoundedIcon },
];