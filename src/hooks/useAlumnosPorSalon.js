import { useEffect, useState } from "react";
import { apiAdmin } from "../utils/apiAdmin";

// Devuelve { salones: { ALFA: [nombres], BRAVO: [nombres] }, loading, error }
export function useAlumnosPorSalon() {
  const [salones, setSalones] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    apiAdmin
      .getAlumnosPorSalon()
      .then((res) => activo && setSalones(res.salones || {}))
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  return { salones, loading, error };
}
