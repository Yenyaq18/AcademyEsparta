import Badge from "../ui/Badge";
import { notaColor } from "../../utils/constants";

export default function GradeStatus({ nota }) {
  const { bg, fg } = notaColor(nota);
  const display = nota === "" || nota === null || nota === undefined ? "S.N." : nota;
  return (
    <Badge bg={bg} fg={fg}>
      {display}
    </Badge>
  );
}