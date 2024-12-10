import { createContext, useState, ReactNode, useEffect } from 'react'
import { getSemesters, Semester } from '../services/semester.service'

export interface SemesterContextProps {
  currentSemester: Semester | null
  setCurrentSemester: (semester: Semester | null) => void
  semesters: Semester[] | null
  setSemesters: (semesters: Semester[] | null) => void
}

export const SemesterContext = createContext<SemesterContextProps | undefined>(undefined)

export const SemesterProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)
  const [semesters, setSemesters] = useState<Semester[] | null>(null)

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await getSemesters()
        const semesters: Semester[] = response.data
        setSemesters(semesters)
        const selectedSemesterId = localStorage.getItem('id-semester')

        // Configura el semestre actual basándote en el almacenamiento local o selecciona el primero por defecto
        const defaultSemester = semesters.find((semester) => semester.identificador.toString() === selectedSemesterId) || semesters[0]

        if (defaultSemester) {
          setCurrentSemester(defaultSemester)
          localStorage.setItem('id-semester', defaultSemester.identificador.toString())
        }
      } catch (error) {
        console.error('Error fetching semesters:', error)
      }
    }

    fetchSemesters()
  }, [])

  return (
    <SemesterContext.Provider value={{ currentSemester, setCurrentSemester, semesters, setSemesters }}>{children}</SemesterContext.Provider>
  )
}
