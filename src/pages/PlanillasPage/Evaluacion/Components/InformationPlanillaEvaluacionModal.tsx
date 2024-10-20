export const InformationPlanillaEvaluacionModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Generar planilla de evaluación</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <p className="font-inter font-normal mb-2 text-sm">Selecciona el objetivo para la cual desees generar la planilla de evaluación.</p>

        <label htmlFor="objetivo" className="block mb-1 text-sm font-medium text-gray-900">
          Objetivo <span className="text-[#f60c2e]">*</span>
        </label>

        <option value="">Objetivo</option>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="button-secondary_outlined">
            Cancelar
          </button>
          <button type="button" className="button-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
