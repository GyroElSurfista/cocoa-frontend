import { Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Layout from './components/Layout/Layout'
import ObjectivePage from './pages/ObjectivePage/ObjectivePage'
import SeguimientoPage from './pages/SeguimientoPage/SeguimientoPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/objetivos" element={<ObjectivePage />} />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
        </Route>
      </Routes>
      <Sidebar />
    </>
  )
}

export default App
