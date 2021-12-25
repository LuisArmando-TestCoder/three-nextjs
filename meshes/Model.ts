import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const loaders = {
  GLTFLoader,
  GLBLoader: GLTFLoader,
  FBXLoader
}

export default (
  path: string,
): Promise<{
  object3D: THREE.Group;
  animations: Map<string, (animationSpeed: number) => THREE.AnimationAction>;
}> => {
  return new Promise((resolve, reject) => {
    const loader = path.split(".").reverse()[0].toUpperCase() as (
      "GLTF" | "FBX"
    );

    new loaders[`${loader}Loader`]().load(
      path,
      (object) => {
        const model = (object as GLTF).scene || object;

        model.traverse((object: THREE.Object3D<THREE.Event>) => {
          object.castShadow = true;
        });

        const objectAnimations: THREE.AnimationClip[] = object.animations;
        const mixer = new THREE.AnimationMixer(model);
        const animations: Map<string, (animationSpeed: number) => THREE.AnimationAction> = new Map();

        objectAnimations.forEach((a: THREE.AnimationClip) => {
          const action = mixer.clipAction(a);

          animations.set(a.name, (animationSpeed: number) => {
            mixer.update(animationSpeed);

            return action;
          });
        });

        resolve({ object3D: model, animations });
      },
      undefined,
      reject
    );
  });
};
