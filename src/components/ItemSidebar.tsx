import { ReactElement, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface ItemSidebarProps {
  name: string
  children: ReactElement
}

const ItemSidebar = ({ name, children }: ItemSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleAccordion = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <>
      <div className="mb-2 mx-2 pb-1 cursor-pointer flex justify-between border-b border-[#888888]" onClick={toggleAccordion}>
        <p className="font-semibold">{name}</p>
        <KeyboardArrowDownIcon />
      </div>
      {isExpanded && <div className="pl-2">{children}</div>}
    </>
  )
}

export default ItemSidebar
