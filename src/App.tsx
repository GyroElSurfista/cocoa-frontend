import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import ObjectivePage from './pages/ObjectivePage/ObjectivePage'
import SeguimientoPage from './pages/SeguimientoPage/SeguimientoPage'
import EntregablePage from './pages/EntregablePage/EntregablePage'
import TrackingSheet from './pages/SeguimientoPage/TrackingSheet/TrackingSheet'
import ActivityPage from './pages/ActivityPage/ActivityPage'
import PlanillasPage from './pages/PlanillasPage/Seguimiento/PlanillasPage'
import AuxiliaraSelector from './pages/SeguimientoPage/NewObservation/Components/Selector/auxiliaraSelector'
import DeleteActivityPage from './pages/ActivityPage/DeleteActivityPage'
import DeleteObservationPage from './pages/SeguimientoPage/NewObservation/Components/Delete/DeleteObservationPage'
import EvaluacionPage from './pages/PlanillasPage/Evaluacion/EvaluacionPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="objetivos" element={<ObjectivePage />} />
          <Route path="editar-observaciones" element={<AuxiliaraSelector />} />
          <Route path="eliminar-observaciones" element={<DeleteObservationPage />} />
          <Route path="objetivos-entregables" element={<EntregablePage />} />
          <Route path="planilla-evaluacion" element={<EvaluacionPage />} />
          {/* <Route path="planillas" element={<PlanillasPage />} /> */}
          <Route path="seguimiento" element={<SeguimientoPage />}>
            <Route path="objetivo/:idObjetivo" element={<TrackingSheet />} />
          </Route>
          <Route path="crear-actividad" element={<ActivityPage />}></Route>
          <Route path="eliminar-actividad" element={<DeleteActivityPage />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
