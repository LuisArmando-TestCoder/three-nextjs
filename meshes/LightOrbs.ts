import PointLightSet from "./PointLightSet";
import * as THREE from "three";

export default (positions: THREE.Vector3[], color = "#fff", size = 0.65) => {
  return positions.map(({ x, y, z }) => {
    const orb = new THREE.Mesh(
      new THREE.SphereBufferGeometry(size, 100, 100),
      new THREE.MeshBasicMaterial({ color })
    );
    const light = PointLightSet([
      {
        position: new THREE.Vector3(0),
        color,
        decay: 2
      },
    ]);
    const lightOrb = new THREE.Group();

    lightOrb.add(orb);
    lightOrb.add(light);
    lightOrb.position.set(x, y, z);
    lightOrb.name = "lightOrb";

    return lightOrb;
  });
};
