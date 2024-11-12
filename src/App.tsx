import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import ObjectivePage from './pages/ObjectivePage/ObjectivePage'
import SeguimientoPage from './pages/SeguimientoPage/SeguimientoPage'
import EntregablePage from './pages/EntregablePage/EntregablePage'
import TrackingSheet from './pages/SeguimientoPage/TrackingSheet/TrackingSheet'
import ActivityPage from './pages/ActivityPage/ActivityPage'
import PlanillasPage from './pages/PlanillasPage/Seguimiento/PlanillasPage'
import SelectorObservationModal from './pages/SeguimientoPage/NewObservation/Components/Selector/SelectorObservationModal'
import DeleteActivityPage from './pages/ActivityPage/DeleteActivityPage'
import DeleteObservationPage from './pages/SeguimientoPage/NewObservation/Components/Delete/DeleteObservationPage'
import EvaluacionPage from './pages/PlanillasPage/Evaluacion/EvaluacionPage'
import SelectorServices from './pages/SelectorServices'
import PlanillaEquipoPage from './pages/PlanillasPage/Equipo/PlanillaEquipoPage'
import CrearPlantillaPage from './pages/PlantillaPage/CrearPlantillaPage'
import { PlantillaDeletePage } from './pages/Plantillas/Delete/PlantillaDeletePage'
import LlenarPlaniEvaObjPage from './pages/LlenarPlaniEvaObjPage/LlenarPlaniEvaObjPage'
import CrearPlantillaPage from './pages/PlantillaPage/CrearPlantillaPage'

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
          <Route path="seguimiento" element={<SeguimientoPage />}>
            <Route path="objetivo/:idObjetivo" element={<TrackingSheet />} />
          </Route>
          <Route path="crear-actividad" element={<ActivityPage />}></Route>
          <Route path="eliminar-actividad" element={<DeleteActivityPage />}></Route>
          <Route path="crear-plantilla" element={<CrearPlantillaPage />}></Route>
          <Route path="planilla-evaluacion/:idObjetivo" element={<LlenarPlaniEvaObjPage />}></Route>
          <Route path="crear-plantilla" element={<CrearPlantillaPage />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
