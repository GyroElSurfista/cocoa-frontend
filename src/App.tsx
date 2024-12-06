import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import ObjectivePage from './pages/ObjectivePage/ObjectivePage'
import SeguimientoPage from './pages/SeguimientoPage/SeguimientoPage'
import EntregablePage from './pages/EntregablePage/EntregablePage'
import ActivityPage from './pages/ActivityPage/ActivityPage'
import DeleteActivityPage from './pages/ActivityPage/DeleteActivityPage'
import DeleteObservationPage from './pages/SeguimientoPage/NewObservation/Components/Delete/DeleteObservationPage'
import EvaluacionPage from './pages/PlanillasPage/Evaluacion/EvaluacionPage'
import SelectorServices from './pages/SelectorServices'
import CrearPlantillaPage from './pages/PlantillaPage/CrearPlantillaPage'
import { PlantillaDeletePage } from './pages/Plantillas/Delete/PlantillaDeletePage'
import LlenarPlaniEvaObjPage from './pages/LlenarPlaniEvaObjPage/LlenarPlaniEvaObjPage'
import PlanillaEquipoPage from './pages/PlanillasPage/Equipo/PlanillaEquipoPage'
import { getSemester, Semester } from './services/semester.service'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [semester, setSemester] = useState<Semester>()
  const currentDate = localStorage.getItem('date') ?? '2024-08-12'

  useEffect(() => {
    const fetchSemester = async () => {
      setSemester((await getSemester()).data)
    }

    fetchSemester()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {semester && currentDate && (
            <>
              <Route path="servicios" element={<SelectorServices />} />
              {currentDate >= semester.fechaPlaniInici && currentDate < semester.fechaPlaniFin && (
                <>
                  <Route path="objetivos" element={<ObjectivePage />} />
                  <Route path="objetivos-entregables" element={<EntregablePage />} />
                  <Route path="eliminar-observaciones" element={<DeleteObservationPage />} />
                </>
              )}

              {/* <Route path="planillas" element={<PlanillasPage />} /> */}
              <Route path="planillas-seguimiento/:idProject" element={<SeguimientoPage />} />
              {currentDate >= semester.fechaPlaniInici && currentDate < semester.fechaDesaFin && (
                <>
                  <Route path="crear-actividad" element={<ActivityPage />}></Route>
                  <Route path="eliminar-actividad" element={<DeleteActivityPage />}></Route>
                </>
              )}

              {currentDate >= semester.fechaDesaInici && currentDate < semester.fechaDesaFin && (
                <>
                  <Route path="/planilla-equipo/:planillaId" element={<PlanillaEquipoPage />} />
                  <Route path="planilla-evaluacion/:idObjetivo" element={<LlenarPlaniEvaObjPage />}></Route>
                  <Route path="planilla-evaluacion" element={<EvaluacionPage />} />
                </>
              )}

              <Route path="crear-plantilla" element={<CrearPlantillaPage />}></Route>
              <Route path="eliminar-plantillas" element={<PlantillaDeletePage />} />
            </>
          )}
        </Route>
      </Routes>
    </>
  )
}

export default App
