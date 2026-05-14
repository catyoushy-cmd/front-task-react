import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store'
import { NumericInput } from '@/ui/NumericInput'

export default function PersonEdit() {
  const { id } = useParams<{ id: string }>()
  const person = useStore((state) => state.people.find((p) => p.id === Number(id)))
  const updatePersonAge = useStore((state) => state.updatePersonAge)
  const [focused, setFocused] = useState(false)

  if (!person) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-gray-600">Person not found</p>
        <Link to="/" className="text-violet-600 hover:underline text-sm">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-violet-600 hover:underline text-sm">
        &larr; Back
      </Link>

      <div className="flex items-center gap-3">
        <img
          src="/img.png"
          alt={person.name}
          className={`w-14 h-14 rounded-full object-cover ring-2 transition-colors ${
            focused ? 'ring-violet-500' : 'ring-gray-200'
          }`}
        />
        <div>
          <label
            htmlFor="hours-input"
            className={`block text-xs font-bold tracking-widest uppercase transition-colors ${
              focused ? 'text-violet-600' : 'text-gray-500'
            }`}
          >
            {person.name} is
          </label>
          <div className="flex items-center gap-2 mt-0.5">
            <NumericInput
              id="hours-input"
              value={person.ageInHours}
              onChange={(v) => updatePersonAge(person.id, v)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <span className="text-gray-600">hours old</span>
          </div>
        </div>
      </div>
    </div>
  )
}
