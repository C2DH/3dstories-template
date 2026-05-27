import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const SIZE = 180
const RANGE = 15

function toMap(v: number): number {
  return ((v / RANGE) * 0.5 + 0.5) * SIZE
}

const SceneMinimap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { scene, camera } = useThree()

  useFrame(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.fillStyle = 'rgba(10,10,20,0.8)'
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const p = (i / 4) * SIZE
      ctx.beginPath()
      ctx.moveTo(p, 0)
      ctx.lineTo(p, SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, p)
      ctx.lineTo(SIZE, p)
      ctx.stroke()
    }

    // Origin cross
    const ox = toMap(0)
    const oz = toMap(0)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(ox - 6, oz)
    ctx.lineTo(ox + 6, oz)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(ox, oz - 6)
    ctx.lineTo(ox, oz + 6)
    ctx.stroke()

    // Scene objects
    scene.traverse((obj) => {
      const asLight = obj as THREE.Light
      const asMesh = obj as THREE.Mesh
      if (asLight.isLight) {
        ctx.fillStyle = '#ffd54f'
        ctx.beginPath()
        ctx.arc(toMap(obj.position.x), toMap(obj.position.z), 4, 0, Math.PI * 2)
        ctx.fill()
      } else if (asMesh.isMesh) {
        const wp = new THREE.Vector3()
        obj.getWorldPosition(wp)
        ctx.fillStyle = '#4fc3f7'
        ctx.beginPath()
        ctx.arc(toMap(wp.x), toMap(wp.z), 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Camera dot + direction arrow
    const cx = toMap(camera.position.x)
    const cz = toMap(camera.position.z)
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    ctx.strokeStyle = '#ef5350'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cz)
    ctx.lineTo(cx + dir.x * 16, cz + dir.z * 16)
    ctx.stroke()
    ctx.fillStyle = '#ef5350'
    ctx.beginPath()
    ctx.arc(cx, cz, 5, 0, Math.PI * 2)
    ctx.fill()

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '9px monospace'
    ctx.fillText('+X', SIZE - 14, oz - 3)
    ctx.fillText('+Z', ox + 3, SIZE - 4)
  })

  return (
    <Html
      calculatePosition={(_el, _cam, size) => [
        size.width - SIZE - 16,
        size.height - SIZE - 46,
      ]}
      zIndexRange={[100, 0]}
    >
      <div
        style={{
          pointerEvents: 'none',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <canvas ref={canvasRef} width={SIZE} height={SIZE} />
        <div
          style={{
            padding: '3px 6px',
            background: 'rgba(10,10,20,0.8)',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            gap: 8,
            fontSize: 10,
            fontFamily: 'monospace',
          }}
        >
          <span style={{ color: '#ef5350' }}>● cam</span>
          <span style={{ color: '#4fc3f7' }}>● mesh</span>
          <span style={{ color: '#ffd54f' }}>● light</span>
        </div>
      </div>
    </Html>
  )
}

export default SceneMinimap
