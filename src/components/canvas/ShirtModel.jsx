import { useGLTF } from '@react-three/drei'
import shirtModelPath from '../../assets/t-shirt_low_poly.glb'

export const ShirtModel = () => {
  const gltf = useGLTF(shirtModelPath)

  return (
    <primitive 
      object={gltf.scene} 
      position={[0, 0, 0]} 
      scale={[1.5, 1.5, 1.5]} 
    />
  )
}
