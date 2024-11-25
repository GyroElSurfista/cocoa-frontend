export interface Planificacion {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  costo: string
  identificadorGrupoEmpre: number
  diaRevis: string
  planillasSeguiGener: boolean
  fechaPlaniSeguiGener: string
  grupo_empresa: {
    identificador: number
    nombreLargo: string
    nombreCorto: string
  }
}
