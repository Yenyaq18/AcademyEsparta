// Cliente HTTP compartido por api.js, apiAdmin.js y apiDirector.js
// URL del backend Node:  VITE_API_URL=http://localhost:3000/api   (archivo .env del frontend)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const STORAGE_KEY = "academia_session";

function tokenGuardado() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").token || null;
  } catch {
    return null;
  }
}

function cabeceras() {
  const t = tokenGuardado();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function armarQuery(action, params) {
  const query = { action };
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    query[key] = typeof value === "object" ? JSON.stringify(value) : value;
  });
  return query;
}

// Si el servidor dice "sesión vencida", se cierra la sesión y se vuelve al login
function revisarSesion(res) {
  if (res.status === 401 && tokenGuardado()) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.assign("/login");
  }
}

export async function request(action, params = {}, method = "GET") {
  const query = armarQuery(action, params);
  let res;
  try {
    if (method === "GET") {
      const url = new URL(API_URL);
      Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
      res = await fetch(url.toString(), { headers: cabeceras() });
    } else {
      res = await fetch(API_URL, { method: "POST", headers: cabeceras(), body: new URLSearchParams(query) });
    }
  } catch {
    throw new Error("No se pudo conectar con el servidor. ¿Está corriendo el backend (npm run dev)?");
  }

  revisarSesion(res);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor.");
  }
  if (!data.ok) throw new Error(data.error || "Error desconocido del servidor.");
  return data;
}

// Descarga un PDF generado por el backend (usa la sesión para autorizar)
export async function descargarPdf(action, params = {}, nombreSugerido = "documento.pdf") {
  const url = new URL(API_URL);
  Object.entries(armarQuery(action, params)).forEach(([k, v]) => url.searchParams.set(k, v));
  let res;
  try {
    res = await fetch(url.toString(), { headers: cabeceras() });
  } catch {
    throw new Error("No se pudo conectar con el servidor. ¿Está corriendo el backend (npm run dev)?");
  }
  revisarSesion(res);
  if (!(res.headers.get("content-type") || "").includes("application/pdf")) {
    let msg = "No se pudo generar el PDF.";
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(msg);
  }
  const archivo = /filename="?([^"]+)"?/i.exec(res.headers.get("content-disposition") || "")?.[1] || nombreSugerido;
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(await res.blob());
  enlace.download = archivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 10000);
}
