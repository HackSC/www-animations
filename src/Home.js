import * as THREE from 'three'
import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

function useWobble(factor = 1, fn = 'sin', cb) {
  const ref = useRef()
  useFrame(state => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = Math[fn](t) * factor
    if (cb) cb(t, ref.current)
  })
  return ref
}

export function Box(props) {
  const [hovered, set] = useState(false)
  console.log(hovered)
  const ref = useWobble(0.5, 'cos')
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.01))
  return (
    <mesh ref={ref} {...props} onPointerOver={() => set(true)} onPointerOut={() => set(false)}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'white'} />
    </mesh>
  )
}

export function Shapes() {
  const {
    viewport: { width, height }
  } = useThree()
  const ringSize = Math.max(3, width / 2)
  const crossSize = 0.7
  return (
    <>
      <Ring position={[-width * 0.8, height * -3, -5]} scale={[ringSize, ringSize, 1]} />
      <Cross position={[-width / 2.5, height / 8, -1]} scale={[crossSize, crossSize, 1]} rotation={[0, 0, Math.PI / 4]} />
      <Minus position={[width / 3, -height / 3.5, -2]} scale={[0.8, 0.8, 0.8]} rotation={[0, 0, Math.PI / 10]} />
      <Dots position={[-3, 1.5, -5]} scale={[0.7, 0.7, 0.7]} />
      <group rotation={[Math.PI / 8, 0, 0]} position={[-width / 4, -height / 6, 0]}>
        <Box scale={[0.8, 0.8, 0.8]} />
        <Box position={[width / 1.5, height / 4, -3]} scale={[0.5, 0.5, 0.5]} />
        <Lights />
      </group>
    </>
  )
}

function Dots(props) {
  const object = new THREE.Object3D()
  const ref = useWobble(0.1, 'cos')
  const instanced = useRef()

  useEffect(() => {
    let id = 0
    for (let x = 0; x < 5; x++)
      for (let y = 0; y < 5; y++) {
        object.position.set(2.5 - x, 2.5 - y, 0)
        object.updateMatrix()
        instanced.current.setMatrixAt(id++, object.matrix)
      }
    instanced.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame(() => (instanced.current.rotation.z -= 0.001))

  return (
    <group ref={ref}>
      <instancedMesh ref={instanced} args={[null, null, 25]} {...props}>
        <circleBufferGeometry attach="geometry" args={[0.08, 16]} />
        <meshBasicMaterial attach="material" color="#FFDCDC" toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

function Ring(props) {
  return (
    <mesh {...props}>
      <ringBufferGeometry attach="geometry" args={[1, 1.4, 64]} />
      <meshBasicMaterial attach="material" color="#FFF9BE" transparent opacity={1} toneMapped={false} />
    </mesh>
  )
}

function Cross(props) {
  const inner = useRef()
  const ref = useWobble(0.1, 'sin', () => (inner.current.rotation.z += 0.001))
  return (
    <group ref={ref}>
      <group ref={inner} {...props}>
        <mesh>
          <planeBufferGeometry attach="geometry" args={[2, 0.5]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.625, 0]}>
          <planeBufferGeometry attach="geometry" args={[0.5, 0.75]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.625, 0]}>
          <planeBufferGeometry attach="geometry" args={[0.5, 0.75]} />
          <meshBasicMaterial attach="material" color="#FFEDDD" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Minus(props) {
  const ref = useWobble(0.1, 'sin')
  return (
    <group ref={ref}>
      <group {...props}>
        <mesh>
          <planeBufferGeometry attach="geometry" args={[2, 0.7]} />
          <meshBasicMaterial attach="material" color="#DEF5FF" toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[7, -5, 10]} intensity={1} angle={0.3} penumbra={1} />
      <pointLight position={[1, -1, -5]} intensity={0.5} />
    </>
  )
}

export function Categories({ time = 3000 }) {
  const [index, set] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => set((index + 1) % 2), time)
    return () => clearInterval(interval)
  }, [index])
  const cats = useMemo(
    () => [
      { npm: 'Hackers', description: 'is a platform to code the next life-changing experience.' },
      { npm: 'Designers', description: 'is a studio for transforming your ideas into reality.' },
      { npm: 'Entrepreneurs', description: "is a space for innovation and tackling the world's problems." },
      { npm: 'Sponsors', description: 'is a chance to expose your products to the most creative students.' },
      { npm: 'Mentors', description: 'is a hub to share and apply your knowledge to cosmic challenges.' },
      { npm: 'Everyone', description: 'is a inspiring experience that brings together the brightest minds!' }
    ],
    []
  )

  const ref = useRef()
  useEffect(() => {
    ref.current.style.animation = 'none'
    void ref.current.offsetHeight
    ref.current.style.animation = `changewidth ${time / 800}s linear`
  }, [index])

  return (
    <p style={{ height: 70, width: 300 }}>
      <a href="#" style={{ width: 250 }} onClick={() => set((index + 1) % 2)}>
        <div
          ref={ref}
          className="progress"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 2,
            opacity: 0.5,
            background: '#ffa5a5'
          }}
        />
        <span className="mx-5">HackSC X </span>
        {cats.map(({ npm }, i) => (
          <span key={i} hidden={i !== index || undefined} className="transition vertical">
            {npm}
          </span>
        ))}
      </a>
      <br />
      {cats.map(({ description }, i) => (
        <span key={i} hidden={i !== index || undefined} className="transition horizontal" style={{ width: '70%', left: 0 }}>
          {description}
        </span>
      ))}
    </p>
  )
}
