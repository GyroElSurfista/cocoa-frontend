import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      {/* Sidebar en vista de escritorio (vertical) */}
      <div
        className={`hidden lg:block ${isOpen ? 'w-72' : 'w-20'} h-[calc(100vh-5rem)] bg-white shadow border-r-4 border-[#e7e7e7] transition-all duration-300 relative`}
      >
        <button onClick={toggleSidebar} className="focus:outline-none -right-2 top-8 bg-[#d1d1d1] text-white absolute rounded-full">
          {isOpen ? '<' : '>'}
        </button>

        {/* Sidebar content */}
        <nav className={`${isOpen ? 'block' : 'hidden'} pl-16 pt-8`}>
          <h2 className="text-black text-xl font-semibold">Nombre_Proyecto</h2>
          <div className="flex flex-col mt-9">
            <NavLink
              to="/objetivos"
              className={({ isActive }) =>
                `hover:text-[#6344e7] py-4 px-2.5 text-base font-normal ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
              }
            >
              Objetivos
            </NavLink>
            <NavLink
              to="/seguimiento"
              className={({ isActive }) =>
                `hover:text-[#6344e7] py-4 px-2.5 text-base font-normal ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''}`
              }
            >
              Seguimiento
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Sidebar en vista móvil (horizontal) */}
      <div className="lg:hidden relative bg-white shadow mt-6 border-b-2">
        <button onClick={toggleSidebar} className="focus:outline-none absolute bg-[#d1d1d1] text-white p-1 rounded-lg -top-4 right-4">
          {isOpen ? '^' : '-'}
        </button>

        {isOpen && (
          <div className="px-5">
            <h2 className="text-black text-xl font-semibold">Nombre_Proyecto</h2>
            <div className="flex items-center w-full pt-2 bg-white shadow-lg">
              <NavLink
                to="/objetivos"
                className={({ isActive }) =>
                  `hover:text-[#6344e7] py-2 px-4 text-base font-normal ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-t-2 border-[#6344e7]' : ''}`
                }
                onClick={toggleSidebar}
              >
                Objetivos
              </NavLink>
              <NavLink
                to="/seguimiento"
                className={({ isActive }) =>
                  `hover:text-[#6344e7] py-2 px-4 text-base font-normal ${isActive ? 'bg-[#e0e3ff] text-[#6344e7] border-t-2 border-[#6344e7]' : ''}`
                }
                onClick={toggleSidebar}
              >
                Seguimiento
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
