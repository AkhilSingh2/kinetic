import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useDesktop, useReducedMotion } from '../../hooks/useMediaQuery'
import { pointer } from '../../lib/pointer'
import { Headphone } from './Headphone'

export default function HeroCanvas() {
  const reduced = useReducedMotion()
  const desktop = useDesktop()
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = host.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.04 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const move = (event: PointerEvent) => {
      pointer.nx = (event.clientX / window.innerWidth) * 2 - 1
      pointer.ny = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reduced])

  return (
    <div className="webgl-host" ref={host}>
      <Canvas
        dpr={desktop ? [1, 1.6] : [1, 1.15]}
        frameloop={reduced || !visible ? 'demand' : 'always'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0.15, 0.4, 5.2], fov: 30, near: 0.1, far: 40 }}
        onCreated={({ gl, camera, invalidate }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.12
          camera.lookAt(0.1, 0.22, 0)
          invalidate()
        }}
      >
        <ambientLight intensity={0.2} />
        <spotLight position={[3.4, 4.4, 3.6]} intensity={110} angle={0.48} penumbra={0.85} color="#fff4e8" />
        <spotLight position={[-3.6, 1.8, 2]} intensity={48} angle={0.62} penumbra={1} color="#e0a078" />
        <directionalLight position={[0.4, 1.2, -3.2]} intensity={1.5} color="#f3ecdf" />
        <Suspense fallback={null}>
          <Environment frames={1} resolution={desktop ? 256 : 128} environmentIntensity={1.08}>
            <Lightformer form="rect" intensity={4.2} color="#fff6ec" position={[0, 2.2, 3.2]} scale={[6, 3, 1]} />
            <Lightformer form="rect" intensity={2.5} color="#e7b089" position={[-4.2, 1, 0.2]} scale={[2.2, 5, 1]} />
            <Lightformer form="rect" intensity={1.7} color="#f3ecdf" position={[4.2, 0.5, 1]} scale={[2, 3.2, 1]} />
            <Lightformer form="rect" intensity={0.8} color="#2c261f" position={[0, -2.2, 2]} scale={[8, 2, 1]} />
          </Environment>
        </Suspense>
        <Headphone compact={!desktop} reduced={reduced} />
      </Canvas>
    </div>
  )
}
