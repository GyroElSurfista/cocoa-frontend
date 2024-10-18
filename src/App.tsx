import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import ObjectivePage from './pages/ObjectivePage/ObjectivePage'
import SeguimientoPage from './pages/SeguimientoPage/SeguimientoPage'
import EntregablePage from './pages/EntregablePage/EntregablePage'
import TrackingSheet from './pages/SeguimientoPage/TrackingSheet/TrackingSheet'
import ActivityPage from './pages/ActivityPage/ActivityPage'
import DeleteActivityPage from './pages/ActivityPage/DeleteActivityPage'
import { ObservationPage } from './pages/SeguimientoPage/NewObservation/ObservationPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="objetivos" element={<ObjectivePage />} />
          <Route path="observaciones" element={<ObservationPage />} />
          <Route path="entregables" element={<EntregablePage />} />
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
