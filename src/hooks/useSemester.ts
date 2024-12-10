import { useContext } from 'react'
import { SemesterContext, SemesterContextProps } from '../contexts/SemesterContext'

export const useSemester = (): SemesterContextProps => {
  const context = useContext(SemesterContext)
  if (!context) {
    throw new Error('useSemester must be used within a SemesterProvider')
  }
  return context
}
