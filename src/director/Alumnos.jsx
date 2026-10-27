import { Box, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../componentes/ui/Card";
import Table from "../componentes/ui/Table";
import Button from "../componentes/ui/Button";
import { COLORS } from "../utils/constants";
import { apiDirector } from "../utils/apiDirector";

export default function Alumnos() {
	const [aulas, setAulas] = useState({});
	const [aulaElegida, setAula] = useState("");
	const [error, setError] = useState("");
	const aula = aulaElegida || Object.keys(aulas)[0] || "";

	useEffect(() => {
		apiDirector
			.aulas()
			.then((res) => setAulas(res.aulas || {}))
			.catch((err) => setError(err.message));
	}, []);

	const columns = [{ key: "codigo", label: "Código" }, { key: "nombre", label: "Alumno", render: (row) => <Typography sx={{ fontWeight: 700, color: COLORS.navy, fontSize: "0.85rem" }}>{row.nombre}</Typography> }, { key: "estado", label: "Estado", render: () => <Chip label="Matriculado" size="small" sx={{ color: "#0F766E", backgroundColor: "#DCEDEA", fontWeight: 700 }} /> }];
	return <Box sx={{ maxWidth: 1100, mx: "auto", py: { xs: 2, md: 3 } }}><Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Comunidad educativa</Typography><Typography component="h1" sx={{ color: COLORS.navy, fontSize: { xs: "1.7rem", md: "2.2rem" }, fontWeight: 800, mt: 0.5 }}>Alumnos</Typography>{error && <Typography sx={{ color: "#DC2626", mb: 1 }}>{error}</Typography>}<Typography sx={{ color: COLORS.slate, mt: 0.5, mb: 3 }}>Consulta los alumnos de las dos aulas y modifica sus notas desde una sola vista.</Typography><Box sx={{ display: "flex", gap: 1, mb: 2 }}>{Object.keys(aulas).map((nombreAula) => <Button key={nombreAula} variant={aula === nombreAula ? "primary" : "outline"} onClick={() => setAula(nombreAula)}>Aula {nombreAula}</Button>)}</Box><Card title={`Alumnos del aula ${aula}`} action={<Button component={Link} to="/director/notas" variant="outline" size="small">Modificar notas</Button>}><Table columns={columns} rows={(aulas[aula] || [])} /></Card></Box>;
}
