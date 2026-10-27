import Table from "../ui/Table";
import Badge from "../ui/Badge";
import { COLORS } from "../../utils/constants";

export default function StudentTable({ alumnos, salon }) {
  const rows = alumnos.map((nombre, i) => ({ id: i, nombre }));

  const columns = [
    {
      key: "nombre",
      label: "Alumno",
      render: (row) => (
        <span style={{ fontWeight: 600, color: COLORS.navy }}>{row.nombre}</span>
      ),
    },
    {
      key: "salon",
      label: "Salón",
      align: "center",
      render: () => <Badge bg="#E0F2FE" fg="#0369A1">{salon}</Badge>,
    },
  ];

  return <Table columns={columns} rows={rows} emptyLabel="No hay alumnos en este salón." />;
}