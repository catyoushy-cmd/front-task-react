import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const MIN_WIDTH_PX = 72
const INPUT_PADDING_PX = 16 // px-2 left + px-2 right

export interface NumericInputProps {
  value: number
  onChange: (value: number) => void
  onFocus?: () => void
  onBlur?: () => void
  id?: string
  placeholder?: string
  className?: string
}

// '1000000' -> '1 000 000'
function addSpaces(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function toDisplay(n: number): string {
  return n === 0 ? '' : addSpaces(String(n))
}

export function NumericInput({
  value,
  onChange,
  onFocus,
  onBlur,
  id,
  placeholder = '0',
  className,
}: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState(() => toDisplay(value))
  const inputRef = useRef<HTMLInputElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const pendingCursor = useRef<number | null>(null)

  useEffect(() => {
    setDisplayValue(toDisplay(value))
  }, [value])

  useLayoutEffect(() => {
    const input = inputRef.current
    const ghost = ghostRef.current
    if (!input || !ghost) return

    input.style.width = `${Math.max(MIN_WIDTH_PX, ghost.offsetWidth + INPUT_PADDING_PX)}px`

    if (pendingCursor.current !== null) {
      input.setSelectionRange(pendingCursor.current, pendingCursor.current)
      pendingCursor.current = null
    }
  }, [displayValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const cursorPos = e.target.selectionStart ?? raw.length
    // считаем цифры слева от курсора (пробелы не считаем)
    const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length

    const digits = raw.replace(/\D/g, '')
    const formatted = addSpaces(digits)

    setDisplayValue(formatted)
    onChange(digits ? Number(digits) : 0)

    // восстанавливаем курсор: находим позицию после N-й цифры в отформатированной строке
    let count = 0
    let pos = formatted.length
    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] !== ' ') count++
      if (count === digitsBeforeCursor) {
        pos = i + 1
        break
      }
    }
    pendingCursor.current = digitsBeforeCursor === 0 ? 0 : pos
  }

  return (
    <span className="relative inline-block">
      {/* невидимый ghost для измерения ширины текста */}
      <span
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-pre"
        style={{ font: 'inherit' }}
      >
        {displayValue || placeholder}
      </span>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={
          className ??
          'rounded border border-gray-300 px-2 py-1 text-lg outline-none transition-colors focus:border-violet-500'
        }
      />
    </span>
  )
}
