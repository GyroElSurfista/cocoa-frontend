import logo from '../assets/Logo Project.png'

const NavBar = (): JSX.Element => {
  return (
    <div className="w-full h-20 bg-[#e0e3ff] shadow">
      <div className="flex h-full py-4 sm:mx-4 pl-10 items-center justify-between">
        <img src={logo} className="h-10 sm:h-full" alt="Logo Proyecto Cocoa" />
      </div>
    </div>
  )
}

export default NavBar
