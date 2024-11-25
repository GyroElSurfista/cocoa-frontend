import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../NavBar'
import Sidebar from '../Sidebar'
import ImgHome from '../../assets/Multi-device targeting-amico.png'

const Layout = () => {
  const location = useLocation()

  const isHome = location.pathname === '/'
  return (
    <>
      <NavBar />
      <div className="sm:flex">
        <Sidebar />
        <main className="sm:flex-grow py-6 h-[calc(100vh-5rem)]">
          {isHome ? (
            <div className="inline-flex justify-center items-center mx-8">
              <p className="text-5xl w-1/2">
                <span className="text-[#3c2d82]  font-semibold">Cocoa</span> te ayuda con distintos servicios a gestionar tus proyectos
              </p>
              <div className="w-1/2">
                <img src={ImgHome} alt="image home cocoa" />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </>
  )
}

export default Layout
