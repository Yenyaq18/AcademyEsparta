// import { createContext, useEffect, useState } from "react";
// import { api } from "../utils/api";
// import { apiAdmin } from "../utils/apiAdmin";

// export const AuthContext = createContext(null);
// const STORAGE_KEY = "academia_session";

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // { role: 'admin'|'estudiante', ...datos }
//   const [initializing, setInitializing] = useState(true);

//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         setUser(JSON.parse(saved));
//       } catch {
//         localStorage.removeItem(STORAGE_KEY);
//       }
//     }
//     setInitializing(false);
//   }, []);

//   const persist = (session) => {
//     setUser(session);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
//   };

//   // Usar en el Login del PROFESOR — recibe { email, password, remember }
//   const loginAdmin = async ({ email, password }) => {
//     const res = await apiAdmin.login(email, password);
//     const session = {
//       role: "admin",
//       profesor: res.profesor,
//       cursos: res.cursos,
//       salones: res.salones,
//     };
//     persist(session);
//     return session;
//   };

//   // Usar en el Login del ESTUDIANTE — recibe { email, password, remember }
//   const loginEstudiante = async ({ email, password }) => {
//     const res = await api.loginEstudiante(email, password);
//     const session = { role: "estudiante", token: res.token, usuario: res.usuario, nombre: res.nombre, salon: res.salon };
//     persist(session);
//     return session;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem(STORAGE_KEY);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         loginAdmin,
//         loginEstudiante,
//         logout,
//         initializing,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { createContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import { apiAdmin } from "../utils/apiAdmin";
import { apiDirector } from "../utils/apiDirector";

export const AuthContext = createContext(null);
const STORAGE_KEY = "academia_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: 'admin'|'director'|'estudiante', ...datos }
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setInitializing(false);
  }, []);

  const persist = (session) => {
    setUser(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  // Login de PROFESOR
  const loginAdmin = async ({ usuario, password, email }) => {
    const userOrEmail = usuario || email;
    const res = await apiAdmin.login(userOrEmail, password);
    const session = {
      role: "admin",
      token: res.token || "token-profesor-ok",
      profesor: res.profesor,
      cursos: res.cursos,
      salones: res.salones,
    };
    persist(session);
    return session;
  };

  // Login de ESTUDIANTE (Aseguramos que siempre guarde el TOKEN de sesión)
  const loginEstudiante = async ({ usuario, password, email }) => {
    const userOrEmail = usuario || email;
    const res = await api.loginEstudiante(userOrEmail, password);
    const session = { 
      role: "estudiante", 
      token: res.token || res.usuario || "token-estudiante-ok", // CORRECCIÓN CLAVE: Guarda token para evitar Error 401
      usuario: res.usuario, 
      nombre: res.nombre, 
      salon: res.salon 
    };
    persist(session);
    return session;
  };

  // Login de DIRECTOR
  const loginDirector = async ({ usuario, password, email }) => {
    const userOrEmail = usuario || email;
    const res = await apiDirector.login(userOrEmail, password);
    const session = { 
      role: "director", 
      token: res.token || "token-director-ok", 
      usuario: res.usuario, 
      nombre: res.nombre, 
      rol: res.rol 
    };
    persist(session);
    return session;
  };

  // Login Auto inteligente adaptado a las credenciales recibidas
  const loginAuto = async (credenciales) => {
    // Si viene la acción explícita enviada por Login.jsx, ejecutamos la función adecuada
    if (credenciales.action === "login_est") {
      return await loginEstudiante(credenciales);
    } else if (credenciales.action === "login_dir") {
      return await loginDirector(credenciales);
    } else if (credenciales.action === "login") {
      return await loginAdmin(credenciales);
    }

    // Si no especifica acción, intenta progresivamente:
    const intentos = [loginAdmin, loginDirector, loginEstudiante];
    let ultimoError = null;
    for (const intento of intentos) {
      try {
        return await intento(credenciales);
      } catch (err) {
        ultimoError = err;
        if (!/incorrectos/i.test(err.message)) throw err;
      }
    }
    throw ultimoError || new Error("Usuario o contraseña incorrectos.");
  };

  // Modo demo para pruebas directas
  const loginDemo = (role) => {
    const session =
      role === "director"
        ? {
            role: "director",
            token: "demo-token-director",
            nombre: "Directora Demo",
            institucion: "Academia Demo",
            profesores: 24,
            alumnos: 486,
            cursos: 18,
          }
        : role === "admin"
          ? { 
              role: "admin", 
              token: "demo-token-profesor", 
              profesor: "Profesor Demo", 
              cursos: ["Matemática", "Comunicación"], 
              salones: ["1A", "1B"] 
            }
          : { 
              role: "estudiante", 
              token: "demo-token-estudiante", 
              usuario: "demo", 
              nombre: "Estudiante Demo", 
              salon: "1A" 
            };
    persist(session);
    return session;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAdmin,
        loginEstudiante,
        loginDirector,
        loginAuto,
        loginDemo,
        logout,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}