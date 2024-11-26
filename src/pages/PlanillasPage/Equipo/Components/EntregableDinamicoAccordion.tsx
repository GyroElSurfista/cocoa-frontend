// EntregableDinamicoAccordion.tsx
import React, { useState } from 'react'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import NewEntregableDinamicoModal from './NewEntregableDinamicoModal'
import axios from 'axios'
import IconDanger from '../../../../assets/ico-danger.svg'
import DeleteIcon from '@mui/icons-material/Delete'

interface EntregableDinamicoAccordionProps {
  entregables: Entregable[]
  fechas: string[]
  objectiveName: string
  isReadOnly: boolean
  onEntregableUpdated: () => void // Para actualizar la lista de entregables
  onShowSnackbar: (message: string) => void // Función para mostrar Snackbar
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string | null
  identificadorObjet: number
  identificadorPlaniSegui?: number
  dinamico?: boolean
  fechaCreac?: string
  criterio_aceptacion_entregable: CriterioAceptacion[]
}

interface CriterioAceptacion {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

export const EntregableDinamicoAccordion: React.FC<EntregableDinamicoAccordionProps> = ({
  entregables,
  onEntregableUpdated,
  objectiveName,
  isReadOnly,
  fechas,
  onShowSnackbar,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [selectedEntregable, setSelectedEntregable] = useState<Entregable | null>(null)

  const toggleAccordion = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }

  const handleEditClick = (event: React.MouseEvent, entregable: Entregable) => {
    console.log(entregable)
    event.stopPropagation() // Evita que el evento de expansión se dispare
    setSelectedEntregable(entregable)
    setEditModalOpen(true) // Abre el modal de edición
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedEntregable(null)
  }

  const handleDeleteClick = (event: React.MouseEvent, entregable: Entregable) => {
    event.stopPropagation() // Evita que el evento de expansión se dispare
    setSelectedEntregable(entregable)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    console.log('fechas:' + fechas)
    if (selectedEntregable) {
      try {
        await axios.delete(`https://cocoabackend.onrender.com/api/entregables/eliminar/${selectedEntregable.identificador}`)
        setDeleteModalOpen(false)
        onEntregableUpdated()
        onShowSnackbar('Entregable eliminado exitosamente')
      } catch (error) {
        console.error('Error al eliminar el entregable:', error)
      }
    }
  }

  return (
    <>
      {entregables.map((entregable, index) => (
        <div className="bg-[#e0e3ff] rounded my-3" key={entregable.identificador}>
          <div
            onClick={() => toggleAccordion(entregable.identificador)}
            className="group hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4 cursor-pointer relative"
          >
            <div className="flex flex-row w-full justify-between">
              <div className="flex items-center">
                <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                  <span className="text-center text-[#1c1c1c] text-lg font-semibold">Entregable {index + 1}</span>
                </div>
                <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">
                  {entregable.nombre || 'Sin descripción'}
                </span>
              </div>
              <div
                className="flex items-center border-l-2 border-[#c6caff] pl-2 space-x-4"
                onClick={(e) => e.stopPropagation()} // Detenemos la propagación
              >
                {!isReadOnly && (
                  <BorderColorIcon
                    onClick={(e) => handleEditClick(e, entregable)}
                    sx={{
                      color: 'gray',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'red', // Color en hover
                      },
                    }}
                  />
                )}
                {!isReadOnly && (
                  <DeleteIcon
                    onClick={(e) => handleDeleteClick(e, entregable)}
                    sx={{
                      color: 'gray',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'red', // Color en hover
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {expanded === entregable.identificador && (
              <div className="mt-2 pl-4">
                <ul className="pl-4">
                  {entregable.criterio_aceptacion_entregable && entregable.criterio_aceptacion_entregable.length > 0 ? (
                    entregable.criterio_aceptacion_entregable.map((criterio) => (
                      <li key={criterio.identificador} className="text-gray-600 font-normal">
                        {criterio.descripcion}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600 font-normal">No hay criterios de aceptación.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {editModalOpen && selectedEntregable && (
        <NewEntregableDinamicoModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          onCreate={onEntregableUpdated}
          onShowSnackbar={onShowSnackbar}
          initialData={selectedEntregable} // Pasa los datos del entregable seleccionado
          entregable={entregables}
          objectiveId={selectedEntregable.identificadorObjet}
          objectiveName={objectiveName}
          planillaSeguiId={selectedEntregable.identificadorPlaniSegui}
          fechas={fechas}
        />
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <div className="flex justify-center">
              <img src={IconDanger} alt="" />
            </div>

            <h5 className="text-xl font-semibold mb-4">¿Está seguro de eliminar este entregable?</h5>
            <p className="mb-6">Eliminar un entregable tiene que ser en consenso con la grupo empresa</p>
            <div className="flex justify-center gap-4">
              <button className="button-secondary_outlined" onClick={() => setDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="button-primary" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EntregableDinamicoAccordion
