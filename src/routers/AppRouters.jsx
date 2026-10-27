import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../componentes/layout/MainLayout";

// Auth
import Login from "../pages/auth/Login";

// Admin
import AdminDashboard from "../Admin/Dashboard";
import Students from "../Admin/students";
import Grades from "../Admin/Grades";
import AdminSection from "../Admin/Section";
import Informes from "../Admin/Informes";
import AsistenciaGeneral from "../componentes/admin/AsistenciaGeneral";
import Cursos from "../componentes/admin/Cursos";

// Estudiante
import StudentDashboard from "../Estudiantes/Dashboard";
import Bimestre from "../Estudiantes/Bimestre";
import Notas from "../Estudiantes/Notas";
import Asistencia from "../Estudiantes/Asistencia";
import Graficos from "../Estudiantes/Graficos";

// Director
import DirectorDashboard from "../director/Dashboard";
import DirectorBimestres from "../director/Bimestres";
import DirectorCursos from "../director/Cursos";
import DirectorProfesores from "../director/Profesores";
import DirectorAlumnos from "../director/Alumnos";
import DirectorNotas from "../director/Notas";

// Hace que Bimestre se vuelva a cargar cuando cambia la URL
function BimestreRoute() {
  const location = useLocation();

  return <Bimestre key={location.pathname} />;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* ==================== ADMIN ==================== */}
          <Route
            element={
              <PrivateRoute requireRole="admin">
                <MainLayout role="admin" />
              </PrivateRoute>
            }
          >
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/alumnos"
              element={<Students />}
            />

            <Route
              path="/admin/cursos"
              element={<Cursos />}
            />

            <Route
              path="/admin/asistencia"
              element={
                <AsistenciaGeneral />
              }
            />

            <Route
              path="/admin/notas"
              element={<Grades />}
            />

            <Route
              path="/admin/reportes"
              element={
                <Informes />
              }
            />

            <Route
              path="/admin/configuracion"
              element={
                <AdminSection
                  title="Configuración"
                  description="Administra la configuración de tu panel."
                />
              }
            />
          </Route>

          {/* ==================== ESTUDIANTE ==================== */}
          <Route
            element={
              <PrivateRoute requireRole="estudiante">
                <MainLayout role="estudiante" />
              </PrivateRoute>
            }
          >
            <Route
              path="/estudiante/dashboard"
              element={<StudentDashboard />}
            />

            {/* BIMESTRES */}
            <Route
              path="/estudiante/bimestre/:numero"
              element={<BimestreRoute />}
            />

            <Route
              path="/estudiante/notas"
              element={<Notas />}
            />

            <Route
              path="/estudiante/asistencia"
              element={<Asistencia />}
            />

            <Route
              path="/estudiante/graficos"
              element={<Graficos />}
            />
          </Route>

          {/* ==================== DIRECTOR ==================== */}
          <Route
            element={
              <PrivateRoute requireRole="director">
                <MainLayout role="director" />
              </PrivateRoute>
            }
          >
            <Route
              path="/director/dashboard"
              element={<DirectorDashboard />}
            />
            <Route path="/director/bimestres" element={<DirectorBimestres />} />
            <Route path="/director/cursos" element={<DirectorCursos />} />
            <Route path="/director/profesores" element={<DirectorProfesores />} />
            <Route path="/director/alumnos" element={<DirectorAlumnos />} />
            <Route path="/director/notas" element={<DirectorNotas />} />
          </Route>

          {/* RUTA POR DEFECTO */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}