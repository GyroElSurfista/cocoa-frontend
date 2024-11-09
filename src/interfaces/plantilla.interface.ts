interface Rubrica {
  valorMaxim: number
  criterio_evalu_final: {
    identificador: number
    nombre: string
    descripcion: string
  }
  param_evalu: {
    identificador: number
    nombre: string
    tipo: string
    valorMaxim?: number
    valorMinim?: number
    cantidadInter?: number
    campos?: Array<{
      identificador: number
      nombre: string
      orden: number
      valorPorce: string
      identificadorParamEvaluCuali: number
    }>
  }
}

interface Plantilla {
  identificador: number
  nombre: string
  descripcion: string
  puntaje: number
  fechaCreac: string
  eliminadoLogic: boolean
  identificadorUsuar: number
  rubricas: Rubrica[]
}

interface Usuario {
  id: number
  name: string
  identificadorPerso: number
  identificadorGrupoEmpre: number
  identificadorRol: number
}

interface GrupoEmpresa {
  identificador: number
  nombreLargo: string
  nombreCorto: string
}
