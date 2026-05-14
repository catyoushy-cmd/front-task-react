import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const MIN_WIDTH_PX = 72

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
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
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
  const pendingCursor = useRef<number | null>(null)

  useEffect(() => {
    setDisplayValue(toDisplay(value))
  }, [value])

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return

    // Сжимаем до минимума → браузер вычисляет scrollWidth в реальном шрифте инпута.
    // scrollWidth (border-box) = ширина текста + padding (без border).
    // Поэтому добавляем borderWidth, чтобы style.width был корректным.
    input.style.width = `${MIN_WIDTH_PX}px`
    const cs = window.getComputedStyle(input)
    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
    input.style.width = `${Math.max(MIN_WIDTH_PX, input.scrollWidth + borderX)}px`

    if (pendingCursor.current !== null) {
      input.setSelectionRange(pendingCursor.current, pendingCursor.current)
      pendingCursor.current = null
    }
  }, [displayValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const cursorPos = e.target.selectionStart ?? raw.length
    // Количество цифр слева от курсора (пробелы не считаем)
    const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length

    const digits = raw.replace(/\D/g, '')
    const formatted = addSpaces(digits)

    setDisplayValue(formatted)
    onChange(digits ? Number(digits) : 0)

    // Восстанавливаем курсор: находим позицию после N-й цифры в отформатированной строке
    let count = 0
    let pos = formatted.length
    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] !== ' ') count++
      if (count === digitsBeforeCursor) {
        pos = i + 1
        break
      }
    }
    pendingCursor.current = digitsBeforeCursor === 0 ? 0 : pos
  }

  return (
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
  )
}
