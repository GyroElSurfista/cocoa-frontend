import axios from "axios";

interface ObjectiveData {
  nombre: string;
  fechaInici: string; 
  fechaFin: string;   
  valorPorce: number;
}

export const createObjective = async (objectiveData: ObjectiveData) => {
  try {
    const response = await axios.post('https://cocoabackend.onrender.com/api/objetivos', objectiveData);
    return response.data;
  } catch (error) {
    console.error('Error creando el objetivo:', error);
    throw error;
  }
};
