import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconDanger from './../../../../assets/ico-danger.svg'
import { deletePlantilla } from '../../../../services/plantillasDelete.service'

export interface NewPlantillaDeleteModalProps {
  plantillaId: number
  eliminadoLogic: boolean
  onDeleteConfirm: () => void
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const NewPlantillaDeleteModal: React.FC<NewPlantillaDeleteModalProps> = ({ plantillaId, eliminadoLogic, onDeleteConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsFinalConfirmModalOpen(false)
  }

  const handleInitialConfirmDelete = () => {
    if (eliminadoLogic) {
      setIsModalOpen(false)
      setIsFinalConfirmModalOpen(true)
    } else {
      handleConfirmDelete()
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deletePlantilla(plantillaId)
      onDeleteConfirm()
    } catch (error) {
      console.error('Error deleting plantilla:', error)
    } finally {
      setIsModalOpen(false)
      setIsFinalConfirmModalOpen(false)
    }
  }

  return (
    <>
      <DeleteIcon
        onClick={handleDeleteClick}
        sx={{
          color: 'gray', // Color base
          cursor: 'pointer',
          '&:hover': {
            color: 'red', // Color al hacer hover
          },
        }}
      />

      {/* Modal inicial */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
            <div className="flex justify-center mb-4">
              <img className="mx-auto" src={IconDanger} alt="Warning Icon" />
            </div>
            {eliminadoLogic && <p className="text-sm text-center">Esta plantilla ya fue usada para la evaluación de proyectos</p>}
            <h5 className="text-xl font-semibold text-center">¿Estás seguro de eliminar esta plantilla de evaluación?</h5>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={handleCloseModal} className="button-secondary_outlined">
                Cancelar
              </button>
              <button onClick={handleInitialConfirmDelete} className="button-primary">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación final si eliminadoLogic es true */}
      {isFinalConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
            <div className="flex justify-center mb-4">
              <img className="mx-auto" src={IconDanger} alt="Warning Icon" />
            </div>
            <p className="text-xl font-semibold text-center">La plantilla ya no se mostrará en la lista de plantillas</p>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={handleCloseModal} className="button-secondary_outlined">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="button-primary">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
