import { ReactElement, useState } from 'react'

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
      <div className="pb-2" onClick={toggleAccordion}>
        <p className="font-semibold">{name}</p>
      </div>
      {isExpanded && <div className="pl-2">{children}</div>}
    </>
  )
}

export default ItemSidebar
