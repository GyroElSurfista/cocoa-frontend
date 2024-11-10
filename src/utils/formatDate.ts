export const formatDateToDMY = (dateString: string | undefined): string => {
  if (dateString) {
    const [year, month, day] = dateString.split('-')

    return `${day}/${month}/${year}`
  }
  return ''
}
