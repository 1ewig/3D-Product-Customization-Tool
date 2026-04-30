import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, PerspectiveCamera } from '@react-three/drei'
import { ShirtModel } from './ShirtModel'
import { TextOverlay } from './TextOverlay'
import { LogoOverlay } from './LogoOverlay'

export const SceneCanvas = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls 
        enableZoom={true} 
        enableRotate={true} 
        minDistance={1.5} 
        maxDistance={6} 
      />
      
      <Suspense fallback={null}>
        <Center>
          <ShirtModel />
        </Center>
        <TextOverlay />
        <LogoOverlay />
      </Suspense>
    </Canvas>
  )
}
