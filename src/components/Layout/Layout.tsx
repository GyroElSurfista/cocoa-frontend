import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="sm:flex">
        <main className="sm:flex-grow p-6 h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Layout
