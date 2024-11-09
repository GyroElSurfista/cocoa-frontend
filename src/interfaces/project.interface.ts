export interface Planificacion {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  costo: string
  identificadorGrupoEmpre: number
  diaRevis: string
  grupo_empresa: {
    identificador: number
    nombreLargo: string
    nombreCorto: string
  }
}
