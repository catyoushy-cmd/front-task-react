import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { NumericInput } from '@/ui/NumericInput'

export default function Settings() {
  const minimumAgeInMonths = useStore((state) => state.minimumAgeInMonths)
  const setMinimumAgeInMonths = useStore((state) => state.setMinimumAgeInMonths)

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-violet-600 hover:underline text-sm">
        &larr; Back
      </Link>

      <h1 className="text-xl font-bold text-gray-700">Settings</h1>

      <div>
        <label
          htmlFor="min-age-input"
          className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-0.5"
        >
          Minimum age
        </label>
        <div className="flex items-center gap-2">
          <NumericInput
            id="min-age-input"
            value={minimumAgeInMonths}
            onChange={setMinimumAgeInMonths}
          />
          <span className="text-gray-600">months</span>
        </div>
      </div>
    </div>
  )
}
