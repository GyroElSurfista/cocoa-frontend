import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
			<App />
		</PrimeReactProvider>
	</StrictMode>
)
