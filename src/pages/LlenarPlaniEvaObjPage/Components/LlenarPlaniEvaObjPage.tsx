import React from 'react'

const LlenarPlaniEvaObjPage = () => {
  return (
    <div className="px-10">
      <h3 className="font-semibold text-3xl">Llenar planilla de evaluación de objetivo</h3>
      <hr className="my-2 border-[1.5px] border-[#c6caff]" />
      <p className="text-lg font-medium">Evaluación del Objetivo X</p>
      <hr className="mt-2 mb-8 border-[1.5px] border-[#c6caff]" />
      <div className="flex flex-row bg-[#eef0ff] rounded-[10px] border-b border-[#c6caff]">
        <div className="w-auto py-4 px-3 border-r border-[#c6caff]">
          <p className="font-medium">Entregable 1</p>
        </div>
        <div className="flex items-center">
          <p className="px-8">Nombre del entregable</p>
        </div>
      </div>
      <div className="pl-28">
        <table className="table-auto text-left">
          <thead>
            <tr>
              <th className="pr-1">Criterios de Evaluación</th>
              <th>¿Se cumple el criterio?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#8680f9] text-[#1c1c1c]">
              <td className=" flex py-2.5 pr-1">
                <div className="pr-5">1.</div>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus assumenda quod facere at quas perferendis culpa animi
                error et corrupti ab fugit, qui molestiae non amet aperiam. In, consequuntur blanditiis?
              </td>
              <td>
                <div className="flex items-center justify-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
            </tr>
            <tr className="border-b border-[#8680f9] text-[#1c1c1c]">
              <td className=" flex py-3 pr-1">
                <div className="pr-5">2.</div>
                epellendus assumenda quod facere at quas perferendis culpa animi aperiam.
              </td>
              <td>
                <div className="flex items-center justify-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr className="my-5 border-[1.5px] border-[#c6caff]" />
      <div className="flex justify-end py-2">
        <button className="button-primary">Guardar Evaluación</button>
      </div>
    </div>
  )
}

export default LlenarPlaniEvaObjPage
