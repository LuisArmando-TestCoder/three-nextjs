import * as THREE from "three";
import Victor from "Victor";
import gsap from "gsap";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../utils/getTextureMaterial";
import getQuixelMaterial from "../../utils/getQuixelMaterial";
import PointLightSet from "../../meshes/PointLightSet";
import getPathPositions from "./getPathPositions";

const pathPositions = getPathPositions(123456789, 2);
const pathSize = 10;
const displacement = pathSize / 2;

function getFloorTable(y: number) {
  return function ([index]: number[], mesh: THREE.Object3D) {
    mesh.position.set(
      pathPositions[index].x * pathSize,
      y,
      pathPositions[index].z * pathSize
    );

    mesh.rotateZ(Math.PI / 2);

    return mesh;
  };
}

function getPexelsSrc(index: number, pair: number): string {
  const imageIndex = 1671323 + (index + pathPositions.length * pair);

  return (
    "https://images.pexels.com/photos/" +
    imageIndex +
    "/pexels-photo-" +
    imageIndex +
    ".jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  );
}

export default {
  path: {
    object: () =>
      consulters.getProceduralGroup([
        {
          // floor through the path
          dimensions: [pathPositions.length],
          material: getQuixelMaterial({
            multiplyScalar: pathSize / 4,
            name: "Marble_Polished",
            code: "vdfjajdv",
            mapNames: ["AO", "Displacement", "Metalness"],
          }),
          geometry: new THREE.BoxBufferGeometry(0.1, pathSize, pathSize),
          getIntersectionMesh: getFloorTable(0),
        },
        {
          // rectangular looking lights
          dimensions: [pathPositions.length],
          material: new THREE.MeshBasicMaterial({ color: "#fff" }),
          geometry: new THREE.BoxBufferGeometry(0.1, pathSize, pathSize),
          getIntersectionMesh: getFloorTable(10),
        },
        {
          // canvases
          dimensions: [pathPositions.length, 2],
          // corners, side-lanes and frontals have
          // ... always two spots in which an art work can be placed
          material: new THREE.MeshStandardMaterial({ color: "#fff" }),
          geometry: new THREE.BoxBufferGeometry(
            pathSize / 2,
            pathSize / 2,
            0.1
          ),
          getIntersectionMesh: async (
            [index, pair]: number[],
            object: THREE.Object3D
          ) => {
            if (index > 0 && index < pathPositions.length - 1) {
              const mesh = object as THREE.Mesh;
              try {
                const { mesh: image, aspectRatio } = await Image(
                  getPexelsSrc(index, pair),
                  pathSize / 2
                );

                mesh.material = image.material;
                mesh.scale.x *= aspectRatio;
              } catch (error) {
                console.error(error);
              }

              const wrapper = new THREE.Group();

              wrapper.add(mesh);

              const { x, z } = pathPositions[index];

              wrapper.position.set(x * pathSize, 5, z * pathSize);

              const canvasPosition =
                pathPositions[index].displays?.[pair].position;

              mesh.position.x += (canvasPosition?.x ?? 0) * displacement;
              mesh.position.z += (canvasPosition?.z ?? 0) * displacement;

              const canvasRotation =
                pathPositions[index].displays?.[pair].rotation;

              mesh.rotateY(canvasRotation ?? 0);

              return wrapper as unknown as THREE.Object3D<Event>;
            }
          },
        },
      ]),
  } as unknown as Scene,
  lights: {
    object: () =>
      PointLightSet(
        pathPositions
          .filter(
            ({ laneType }, index) => laneType === "corner" || index % 10 === 0
          )
          .map(({ x, z }) => ({
            color: "#fff",
            position: new THREE.Vector3(
              x * pathSize,
              pathSize * 1.5,
              z * pathSize
            ),
            distance: pathSize * 2.5,
            intensity: 6,
            decay: 3,
          }))
      ),
  } as unknown as Scene,
  lightFollower: {
    object: () =>
      PointLightSet([
        {
          color: "#fff",
          position: new THREE.Vector3(0, 2, 0),
          distance: 25,
          intensity: 0.1,
        },
      ]),
    onAnimation: ({ object3D }: SceneExport, canvasState: CanvasState) => {
      object3D.position.set(
        canvasState.camera?.position.x as number,
        canvasState.camera?.position.y as number,
        canvasState.camera?.position.z as number
      );
    },
  } as unknown as Scene,
} as Scenes;
