import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default (
  path: string
): Promise<{
  object3D: THREE.Group;
  animations: Map<string, THREE.AnimationAction>;
}> => {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(
      path,
      (gltf: GLTF) => {
        const model = gltf.scene;

        model.traverse((object: THREE.Object3D<THREE.Event>) => {
          object.castShadow = true;
        });

        const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
        const animations: Map<string, THREE.AnimationAction> = new Map();

        gltfAnimations.forEach((a: THREE.AnimationClip) => {
          animations.set(a.name, mixer.clipAction(a));
        });

        resolve({ object3D: model, animations });
      },
      undefined,
      reject
    );
  });
};
