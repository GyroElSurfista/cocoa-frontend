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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="servicios" element={<SelectorServices />} />
          <Route path="objetivos" element={<ObjectivePage />} />
          <Route path="eliminar-plantillas" element={<PlantillaDeletePage />} />
          <Route path="eliminar-observaciones" element={<DeleteObservationPage />} />
          <Route path="objetivos-entregables" element={<EntregablePage />} />
          <Route path="planilla-evaluacion" element={<EvaluacionPage />} />
          {/* <Route path="planillas" element={<PlanillasPage />} /> */}
          <Route path="planillas-seguimiento/:idProject" element={<SeguimientoPage />} />
          <Route path="crear-actividad" element={<ActivityPage />}></Route>
          <Route path="eliminar-actividad" element={<DeleteActivityPage />}></Route>
          <Route path="crear-plantilla" element={<CrearPlantillaPage />}></Route>
          <Route path="planilla-evaluacion/:idObjetivo" element={<LlenarPlaniEvaObjPage />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
