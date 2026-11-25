import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../../lib/pointer'
import { pose } from '../../lib/pose'

const DRIVER_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const DRIVER_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
void main() {
  vec2 p = vUv - 0.5;
  float r = length(p);
  float rings = sin(r * 86.0 - uTime * 1.4);
  float tone = smoothstep(0.5, 0.05, r);
  vec3 copper = vec3(0.72, 0.4, 0.24);
  vec3 dark = vec3(0.05, 0.045, 0.04);
  vec3 col = mix(dark, copper, tone * (0.28 + 0.42 * rings));
  float rim = smoothstep(0.5, 0.42, r) * smoothstep(0.22, 0.34, r);
  col += copper * rim;
  float core = smoothstep(0.05, 0.0, r);
  col += vec3(0.95, 0.9, 0.82) * core * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`

const PROFILE = [
  new THREE.Vector2(0.4, 0.0),
  new THREE.Vector2(0.52, 0.045),
  new THREE.Vector2(0.58, 0.13),
  new THREE.Vector2(0.55, 0.23),
  new THREE.Vector2(0.4, 0.33),
  new THREE.Vector2(0.22, 0.39),
  new THREE.Vector2(0.015, 0.42),
]

function DriverDisc() {
  const material = useRef<THREE.ShaderMaterial>(null)
  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.325, 0]}>
      <circleGeometry args={[0.15, 64]} />
      <shaderMaterial
        ref={material}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={DRIVER_VERT}
        fragmentShader={DRIVER_FRAG}
        toneMapped={false}
      />
    </mesh>
  )
}

function Cup({ side, shell }: { side: 1 | -1; shell: THREE.LatheGeometry }) {
  const rot = side === 1 ? -Math.PI / 2 : Math.PI / 2
  return (
    <group position={[side * 1.08, 0, 0]} rotation={[0, 0, rot]}>
      <mesh geometry={shell} dispose={null}>
        <meshPhysicalMaterial
          color="#121314"
          metalness={1}
          roughness={0.3}
          clearcoat={0.62}
          clearcoatRoughness={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.4, 0.072, 20, 72]} />
        <meshPhysicalMaterial color="#241c17" metalness={0.04} roughness={0.88} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.46, 0.014, 16, 80]} />
        <meshPhysicalMaterial color="#e0a078" metalness={1} roughness={0.16} emissive="#8a3d1c" emissiveIntensity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.31, 48]} />
        <meshStandardMaterial color="#0b0a09" roughness={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <torusGeometry args={[0.19, 0.013, 14, 72]} />
        <meshPhysicalMaterial color="#c47a4a" metalness={1} roughness={0.2} emissive="#5a2a14" emissiveIntensity={0.55} />
      </mesh>
      <DriverDisc />
    </group>
  )
}

function Yoke({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 1.08, 0.64, 0]}>
      <mesh>
        <sphereGeometry args={[0.072, 28, 28]} />
        <meshPhysicalMaterial color="#2a2927" metalness={1} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.034, 0.044, 0.44, 20]} />
        <meshPhysicalMaterial color="#4a4743" metalness={1} roughness={0.36} />
      </mesh>
    </group>
  )
}

function Shadow() {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 122)
    grad.addColorStop(0, 'rgba(0,0,0,0.5)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => () => map?.dispose(), [map])
  if (!map) return null

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.25, -0.62, 0]}>
      <planeGeometry args={[3.4, 1.7]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} />
    </mesh>
  )
}

export function Headphone({ compact, reduced }: { compact: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const shell = useMemo(() => new THREE.LatheGeometry(PROFILE, 80), [])
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.08, 0.92, 0),
        new THREE.Vector3(-0.7, 1.42, 0.04),
        new THREE.Vector3(0, 1.66, 0.1),
        new THREE.Vector3(0.7, 1.42, 0.04),
        new THREE.Vector3(1.08, 0.92, 0),
      ]),
    [],
  )
  const padCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.46, 1.42, 0.08),
        new THREE.Vector3(0, 1.6, 0.14),
        new THREE.Vector3(0.46, 1.42, 0.08),
      ]),
    [],
  )
  const band = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.05, 18, false), [curve])
  const pad = useMemo(() => new THREE.TubeGeometry(padCurve, 48, 0.09, 16, false), [padCurve])

  useEffect(
    () => () => {
      shell.dispose()
      band.dispose()
      pad.dispose()
    },
    [band, pad, shell],
  )

  const spin = useRef(-0.72)

  useLayoutEffect(() => {
    group.current?.rotation.set(-0.1, -0.72, -0.08)
  }, [])

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return
    const restY = compact ? 0.04 : 0.2
    if (reduced) {
      node.position.y = restY
      return
    }
    spin.current += delta * 0.08
    const targetY = spin.current + pointer.dragY + pointer.nx * 0.28 + pose.story * 1.25
    const targetX = -0.1 + pointer.dragX * 0.65 - pointer.ny * 0.08
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetY, 3.4, delta)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, targetX, 3.4, delta)
    node.position.y = restY + Math.sin(state.clock.elapsedTime * 0.5) * 0.028
  })

  return (
    <>
      <group ref={group} position={[compact ? 0 : 0.72, compact ? 0.04 : 0.16, 0]} scale={compact ? 0.78 : 0.9}>
        <mesh geometry={band} dispose={null}>
          <meshPhysicalMaterial color="#6d6862" metalness={1} roughness={0.36} clearcoat={0.3} clearcoatRoughness={0.4} />
        </mesh>
        <mesh geometry={pad} dispose={null}>
          <meshPhysicalMaterial color="#2b221c" metalness={0} roughness={0.92} />
        </mesh>
        <Cup side={1} shell={shell} />
        <Cup side={-1} shell={shell} />
        <Yoke side={1} />
        <Yoke side={-1} />
      </group>
      <Shadow />
    </>
  )
}
