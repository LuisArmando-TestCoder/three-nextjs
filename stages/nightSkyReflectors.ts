import * as THREE from "three";
import { consulters } from "scene-preset";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";

import starfieldMaterial from "../materials/starfield";
import worleyNoiseWatersMaterial from "../materials/worleyNoiseWaters";
import LightOrbs from "../meshes/LightOrbs";

export default {
  sky: {
    properties: {
      rotation: {
        z: -Math.PI,
        x: -Math.PI / 2,
      },
      position: {
        y: -500,
      },
    },
    object: () =>
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(1500, 100),
        starfieldMaterial
      ),
  } as unknown as Scene,
  ocean: {
    properties: {
      rotation: {
        y: -Math.PI / 4,
      },
      position: new THREE.Vector3(0, -100, 0),
    },
    object: () =>
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(3000, 3000),
        worleyNoiseWatersMaterial
      ),
    onSetup({ object3D: floor }: SceneExport) {
      floor.rotateX(Math.PI / 2);
    },
  } as unknown as Scene,
  lights: {
    properties: {
      position: new THREE.Vector3(0, 20, 0),
    },
    object: () => {
      const length = 12;
      const distance = 40;

      return consulters.getProceduralGroup([
        {
          dimensions: [length],
          getIntersectionMesh([index]) {
            const [lightOrb] = LightOrbs([new THREE.Vector3(0, 0, 0)]);
            const ring = new THREE.Mesh(
              new THREE.RingBufferGeometry(0.5, 1, 73),
              new THREE.MeshPhongMaterial({
                color: "#fff",
                specular: "#fff",
                shininess: 30,
                side: THREE.DoubleSide,
              })
            );

            ring.scale.set(1.5, 1.5, 1.5);

            const lightGroup = new THREE.Group();

            lightGroup.add(lightOrb as unknown as THREE.Object3D);
            lightGroup.add(ring);

            const step = (index / length) * Math.PI * 2;
            const overStep = 0.5;

            ring.position.set(
              Math.sin(step) * (distance + overStep),
              overStep,
              Math.cos(step) * (distance + overStep)
            );

            lightOrb.position.set(
              Math.sin(step) * distance,
              0,
              Math.cos(step) * distance
            );

            return lightGroup;
          },
        },
      ]);
    },
    onSetup({ object3D }: SceneExport) {
      object3D.children.forEach((child) => {
        child.children.forEach((child) => {
          child.lookAt(new THREE.Vector3());
        });
      });
    },
  } as unknown as Scene,
  floor: {
    properties: {
      position: {
        y: -3,
      },
    },
    object: () =>
      new THREE.Mesh(
        new THREE.CylinderGeometry(45, 45, 1, 100),
        new THREE.MeshPhongMaterial({
          color: "#000",
          specular: "#fff",
          shininess: 30,
        })
      ),
  } as unknown as Scene,
} as Scenes;
