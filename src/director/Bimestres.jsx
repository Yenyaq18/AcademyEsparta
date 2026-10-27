import { Box, Chip, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link } from "react-router-dom";
import Card from "../componentes/ui/Card";
import Button from "../componentes/ui/Button";
import { COLORS } from "../utils/constants";
import { useEffect, useState } from "react";
import { apiDirector } from "../utils/apiDirector";
import { Switch } from "@mui/material";

export default function Bimestres() {
	const [bimestres, setBimestres] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		apiDirector
			.bimestres()
			.then((res) => setBimestres(res.bimestres || []))
			.catch((err) => setError(err.message));
	}, []);

	// Guarda el cambio en la base de datos (tabla bimestres)
	const cambiarAcceso = async (bimestre) => {
		const nuevo = !bimestre.habilitado;
		setBimestres((actuales) => actuales.map((b) => (b.id === bimestre.id ? { ...b, habilitado: nuevo } : b)));
		try {
			await apiDirector.setBimestre(bimestre.nombre, nuevo);
		} catch (err) {
			setError(err.message);
			setBimestres((actuales) => actuales.map((b) => (b.id === bimestre.id ? { ...b, habilitado: !nuevo } : b)));
		}
	};

	return (
		<Box sx={{ maxWidth: 1100, mx: "auto", py: { xs: 2, md: 3 } }}>
			<Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
				Calendario académico
			</Typography>
			<Typography component="h1" sx={{ color: COLORS.navy, fontSize: { xs: "1.7rem", md: "2.2rem" }, fontWeight: 800, mt: 0.5 }}>
				Bimestres
			</Typography>
			<Typography sx={{ color: COLORS.slate, mt: 0.5, mb: 3 }}>
				Controla qué periodos pueden consultar y calificar los profesores.
			</Typography>
			{error && <Typography sx={{ color: "#DC2626", mb: 2 }}>{error}</Typography>}

			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
				{bimestres.map((bimestre) => {
					const activo = bimestre.habilitado;

					return (
						<Card key={bimestre.id} sx={{ border: activo ? "2px solid #0F766E" : undefined }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start" }}>
								<Box>
									<Typography sx={{ color: COLORS.navy, fontSize: "1.1rem", fontWeight: 800 }}>{bimestre.nombre}</Typography>
									<Typography sx={{ color: COLORS.slate, fontSize: "0.8rem", mt: 0.5 }}>Periodo académico 2026</Typography>
								</Box>
								<Chip
									icon={activo ? <CheckCircleRoundedIcon /> : undefined}
									label={activo ? "Habilitado" : "Bloqueado"}
									size="small"
									sx={{ color: activo ? "#0F766E" : "#64748B", backgroundColor: `${activo ? "#0F766E" : "#64748B"}18`, fontWeight: 700 }}
								/>
							</Box>

							<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, p: 1, borderRadius: 2, backgroundColor: "#F8FAFC" }}>
								<Typography sx={{ color: COLORS.navy, fontSize: "0.85rem", fontWeight: 700 }}>
									{activo ? "Profesores pueden trabajar" : "Profesores no pueden trabajar"}
								</Typography>
								<Switch checked={activo} onChange={() => cambiarAcceso(bimestre)} inputProps={{ "aria-label": `Habilitar ${bimestre.nombre}` }} />
							</Box>

							<Box sx={{ display: "flex", gap: 1, mt: 2 }}>
								<Button component={Link} to={`/director/notas?bimestre=${bimestre.id}`} variant={activo ? "primary" : "outline"} size="small">Ver notas</Button>
								<Button component={Link} to="/director/cursos" variant="outline" size="small">Cursos</Button>
							</Box>
						</Card>
					);
				})}
			</Box>
		</Box>
	);
}
