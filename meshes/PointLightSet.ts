import * as THREE from "three";

interface PointLight {
  position?: THREE.Vector3;
  color?: string;
  intensity?: number;
  distance?: number;
  decay?: number;
}

export default (lights: PointLight[]) => {
  const lightSet = new THREE.Group();

  lights.forEach(
    ({
      position = new THREE.Vector3(),
      color = "#fff",
      intensity = 1,
      distance = 50,
      decay = 1,
    }) => {
      const light = new THREE.PointLight(color, intensity, distance, decay);

      light.position.set(position.x, position.y, position.z);

      lightSet.add(light);
    }
  );

  return lightSet;
};

