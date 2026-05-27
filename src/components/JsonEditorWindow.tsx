import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface JsonEditorWindowProps {
  title?: string
  value: unknown
  onChange: (nextValue: unknown) => void
  initialPosition?: {
    x: number
    y: number
  }
}

const JsonEditorWindow: React.FC<JsonEditorWindowProps> = ({
  title = 'JSON Editor',
  value,
  onChange,
  initialPosition = { x: 24, y: 24 },
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const serializedValue = useMemo(
    () => JSON.stringify(value ?? {}, null, 2),
    [value],
  )

  const [editorText, setEditorText] = useState(serializedValue)
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setEditorText(serializedValue)
    setParseError(null)
  }, [serializedValue])

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const onMouseMove = (event: MouseEvent) => {
      setPosition({
        x: Math.max(8, event.clientX - dragOffsetRef.current.x),
        y: Math.max(8, event.clientY - dragOffsetRef.current.y),
      })
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  const handleHeaderMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = event.target.value
    setEditorText(nextText)

    try {
      const parsed = JSON.parse(nextText)
      setParseError(null)
      onChange(parsed)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }

  if (!isMounted) {
    return null
  }

  return createPortal(
    <div
      className='fixed z-[999] w-[min(560px,calc(100vw-2rem))] rounded-md border border-neutral-400 bg-white/95 shadow-lg backdrop-blur-sm'
      style={{ left: position.x, top: position.y }}
    >
      <div
        className='cursor-move select-none rounded-t-md border-b border-neutral-300 bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-800'
        onMouseDown={handleHeaderMouseDown}
      >
        {title}
      </div>

      <div className='p-3'>
        <textarea
          className='h-72 w-full resize-y rounded border border-neutral-300 bg-white p-2 font-mono text-xs leading-5 text-neutral-900 outline-none focus:border-neutral-500'
          value={editorText}
          onChange={handleTextChange}
          spellCheck={false}
        />

        <p
          className={`mt-2 text-xs ${
            parseError ? 'text-red-600' : 'text-green-700'
          }`}
        >
          {parseError ? `Invalid JSON: ${parseError}` : 'Valid JSON'}
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default JsonEditorWindow
