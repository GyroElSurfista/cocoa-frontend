import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import GoalIcon from '../assets/goalIcon'
import TrackerIcon from '../assets/TrackerIcon'
import ItemSidebar from './ItemSidebar'
import CheckIcon from '../assets/checkIcon'
import EntregableIcon from '../assets/entregableIcon'
import PlantillaEva from '../assets/PlantillaEva'
import SelectorProjectEntregable from '../pages/EntregablePage/Components/SelectorProjectEntregable'
import ProjectSelectorModalEvaluacion from '../pages/PlanillasPage/Evaluacion/Components/ProjectSelectorModalEvaluacion'
import PlaniEvaIcon from '../assets/PlaniEvaIcon'
import PlaniSeguiIcon from '../assets/PlaniSeguiIcon'
import SelectorPlaniEvaObj from '../pages/LlenarPlaniEvaObjPage/Components/SelectorPlaniEvaObj'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [isProjectModalEntregableOpen, setIsProjectModalEntregableOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const openProjectModalEntregable = () => setIsProjectModalEntregableOpen(true)
  const closeProjectModalEntregable = () => setIsProjectModalEntregableOpen(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const openProjectModal = () => setIsProjectModalOpen(true)
  const closeProjectModal = () => setIsProjectModalOpen(false)

  const handleProjectSelect = (identificadorPlani: number, objetivoIds: number[], nombrePlani: string) => {
    closeProjectModalEntregable()
    navigate('/objetivos-entregables', { state: { identificadorPlani, objetivoIds, nombrePlani } })
  }

  return (
    <div>
      {/* Sidebar en vista de escritorio (vertical) */}
      <div
        className={`hidden lg:block ${isOpen ? 'w-72' : 'w-20'} h-[calc(100vh-5rem)] bg-white shadow border-r-4 border-[#e7e7e7] transition-all duration-300 relative`}
      >
        <button onClick={toggleSidebar} className="focus:outline-none -right-4 top-8 bg-[#d1d1d1] text-white absolute rounded-full">
          {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRight />}
        </button>

        {/* Sidebar content */}
        <nav className={`${isOpen ? 'block' : 'hidden'} pl-16 pt-8`}>
          <h2 className="text-black text-xl font-semibold">Servicios</h2>
          <div className="flex flex-col mt-9">
            <ItemSidebar name="Registrar y Añadir">
              <>
                <NavLink
                  to="/objetivos"
                  className={({ isActive }) =>
                    `hover:text-[#6344e7] py-3 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Pasa el estado isActive para cambiar el color del icono */}
                      <GoalIcon fill={isActive ? '#6344e7' : '#5d5d5d'} />
                      Objetivos
                    </>
                  )}
                </NavLink>
                <div className="py-3 px-2.5 text-base font-normal gap-1 items-center flex" onClick={openProjectModalEntregable}>
                  <EntregableIcon />
                  Entregables
                </div>
                <SelectorProjectEntregable
                  isOpen={isProjectModalEntregableOpen}
                  onClose={closeProjectModalEntregable}
                  onSelect={handleProjectSelect}
                />
                <NavLink
                  to="/crear-actividad"
                  className={({ isActive }) =>
                    `hover:text-[#6344e7] py-3 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <CheckIcon fill={isActive ? '#6344e7' : '#5d5d5d'} />
                      Actividades
                    </>
                  )}
                </NavLink>
              </>
            </ItemSidebar>
            <ItemSidebar name="Generar y Crear">
              <>
                <div className="py-3 px-2.5 text-base font-normal gap-1 items-center flex" onClick={openProjectModalEntregable}>
                  <EntregableIcon />
                  Planillas de Seguimiento Semanal
                </div>
                <div className="py-3 px-2.5 text-base font-normal gap-1 items-center flex" onClick={openProjectModal}>
                  <PlaniEvaIcon />
                  Planillas de Evaluación de Objetivo
                </div>
                <ProjectSelectorModalEvaluacion isOpen={isProjectModalOpen} onClose={closeProjectModal} />

                <NavLink
                  to="/crear-plantilla"
                  className={({ isActive }) =>
                    `hover:text-[#6344e7] py-2 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <PlantillaEva fill={isActive ? '#6344e7' : '#5d5d5d'} />
                      Plantillas de Evaluación Final
                    </>
                  )}
                </NavLink>
              </>
            </ItemSidebar>
            <ItemSidebar name="Llenar y Completar">
              <>
                <div className="py-3 px-2.5 text-base font-normal gap-1 items-center flex" onClick={openProjectModalEntregable}>
                  <PlaniSeguiIcon />
                  Planillas de Seguimiento Semanal
                </div>
                <div className="py-3 px-2.5 text-base font-normal gap-1 items-center flex" onClick={openModal}>
                  <PlaniEvaIcon />
                  Planillas de Evaluación de Objetivo
                </div>
                <SelectorPlaniEvaObj isOpen={isModalOpen} onClose={closeModal} />
              </>
            </ItemSidebar>
            <ItemSidebar name="Eliminar">
              <>
                <NavLink
                  to="/eliminar-actividad"
                  className={({ isActive }) =>
                    `hover:text-[#6344e7] py-2 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <CheckIcon fill={isActive ? '#6344e7' : '#5d5d5d'} />
                      Actividades
                    </>
                  )}
                </NavLink>
                <NavLink
                  to="/eliminar-plantillas"
                  className={({ isActive }) =>
                    `hover:text-[#6344e7] py-2 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <EntregableIcon fill={isActive ? '#6344e7' : '#5d5d5d'} />
                      Planillas de Evaluación Final
                    </>
                  )}
                </NavLink>
              </>
            </ItemSidebar>
          </div>
        </nav>
      </div>

      {/* Sidebar en vista móvil (horizontal) */}
      <div className="lg:hidden relative bg-white shadow mt-6 border-b-2">
        <button onClick={toggleSidebar} className="focus:outline-none absolute bg-[#d1d1d1] text-white rounded-lg -top-4 right-4">
          {isOpen ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
        </button>

        {isOpen && (
          <div className="px-5">
            <h2 className="text-black text-xl font-semibold">Nombre_Proyecto</h2>
            <div className="flex items-center w-full pt-2 bg-white shadow-lg">
              <NavLink
                to="/objetivos"
                className={({ isActive }) =>
                  `hover:text-[#6344e7] py-4 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-t-2 border-[#6344e7]' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Pasa el estado isActive para cambiar el color del icono */}
                    <GoalIcon fill={isActive ? '#6344e7' : 'currentColor'} />
                    Objetivos
                  </>
                )}
              </NavLink>
              <NavLink
                to="/seguimiento"
                className={({ isActive }) =>
                  `hover:text-[#6344e7] py-4 px-2.5 text-base font-normal gap-1 items-center flex ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-t-2 border-[#6344e7]' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <TrackerIcon fill={isActive ? '#6344e7' : 'currentColor'} />
                    Seguimiento
                  </>
                )}
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
