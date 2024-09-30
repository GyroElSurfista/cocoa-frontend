import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StyledEngineProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StyledEngineProvider>
)
