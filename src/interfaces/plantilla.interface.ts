export interface CriterioEvaluacionFinal {
  identificador: number
  nombre: string
  descripcion: string
}

export interface ParametroEvaluacionFinal {
  identificador: number
  nombre: string
  tipo: string
}

export interface ParametroCualitativo extends ParametroEvaluacionFinal {
  tipo: 'cualitativo'
  campos: {
    identificador: number
    nombre: string
    orden: number
    valorPorce: number
    identificadorParamEvaluCuali: number
  }[]
}

export interface ParametroCuantitativo extends ParametroEvaluacionFinal {
  tipo: 'cuantitativo'
  valorMinim: number
  cantidadInter: number
}

export interface CrearPlantillaEvaluacionFinal {
  nombre: string
  descripcion: string
  puntaje: number // Es la suma de puntaje de todas las rúbricas
  rubricas: {
    identificadorCriteEvaluFinal: number
    identificadorParamEvalu: number
    valorMaxim: number // Es el puntaje de cada rúbrica
  }[]
}

export interface Plantilla {
  identificador: number
  nombre: string // Es parte de crear plantilla
  descripcion: string // Es parte de crear plantilla
  puntaje: number // Es parte de crear plantilla
  fechaCreac: string // Debería ser Date
  eliminadoLogic: true | false
  identificadorUsuar: number // Es el mismo valor que el ID de usuario_cread
  rubricas: {
    // Es parte de crear plantilla
    criterio_evalu_final: CriterioEvaluacionFinal
    param_evalu: ParametroCualitativo | ParametroCualitativo
    valorMaxim: number
  }[]

  usuario_cread: {
    id: number
    name: string
  }
}
