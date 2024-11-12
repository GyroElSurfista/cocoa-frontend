// Exporta cada interfaz
export interface Rubrica {
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

export interface Plantilla {
  identificador: number
  nombre: string
  descripcion: string
  puntaje: number
  fechaCreac: string
  eliminadoLogic: boolean
  identificadorUsuar: number
  rubricas: Rubrica[]
  usuario_cread: UsuarioCreador
}

export interface Usuario {
  id: number
  name: string
  identificadorPerso: number
  identificadorGrupoEmpre: number
  identificadorRol: number
}

export interface GrupoEmpresa {
  identificador: number
  nombreLargo: string
  nombreCorto: string
}

export interface UsuarioCreador {
  id: number
  name: string
}
