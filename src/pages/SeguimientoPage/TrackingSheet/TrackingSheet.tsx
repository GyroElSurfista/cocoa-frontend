import { useParams } from "react-router-dom";

const TrackingSheet = () => {
  const { idObjetivo } = useParams();

  return (
    <div>
      <h1>Detalles del Objetivo</h1>
      <p>ID del objetivo: {idObjetivo}</p>
    </div>
  );}

export default TrackingSheet
