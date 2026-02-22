import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene3D from './Scene3D'

export default function Canvas3D() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
    </div>
  )
}
