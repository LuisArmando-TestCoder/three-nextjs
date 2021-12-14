/**
 * @todo there should be three canvases on each extreme
 */

import Victor from "Victor";
import * as THREE from "three";
import { events, consulters } from "scene-preset";
import { CanvasState } from "scene-preset/lib/types/state";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../utils/getTextureMaterial";
import getQuixelMaterial from "../../utils/getQuixelMaterial";
import PointLightSet from "../../meshes/PointLightSet";
import getPathPositions, { RoomPosition, LaneType } from "./getPathPositions";

type LaneName =
  | "frontal0"
  | "frontal1"
  | "side-lane0"
  | "side-lane1"
  | "corner0"
  | "corner1";

const pathPositions = getPathPositions(798838645950457, 4); // 123456789 fails miserably, use it for debugging
const pathSize = 10;
const displacement = pathSize / 2;
let lastOpenedState = false;

function getCornerPosition(
  index: number,
  axis: "x" | "z",
  pair: 0 | 1
): number {
  const cornerPosition =
    (pathPositions[index][axis] -
      (pathPositions[index + Math.sign(pair - 0.5)]?.[axis] ??
        pathPositions[index][axis])) *
    displacement;

  return cornerPosition;
}

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

function getCanvasRealRotation(
  pathPositions: RoomPosition[],
  index: number,
  pair: 0 | 1
): number {
  return (
    Math.PI / (pair + 1) -
    (Math.PI / 2) * +(pathPositions[index - 1].laneType === "side-lane")
  );
}

function getLaneName(index: number, pair: 0 | 1): LaneName {
  const laneType: LaneType = pathPositions[index].laneType;
  const laneName = (laneType + pair) as LaneName;

  return laneName;
}

function getCanvasRotation(index: number, pair: 0 | 1): number {
  const cornerRotation = getCanvasRealRotation(
    pathPositions,
    index,
    pair as 0 | 1
  );
  const laneRotations = {
    frontal0: -Math.PI / 2,
    frontal1: Math.PI / 2,
    "side-lane0": 0,
    "side-lane1": Math.PI,
    corner0: cornerRotation,
    corner1: cornerRotation,
  };
  const laneName = getLaneName(index, pair);

  return laneRotations[laneName];
}

function getCanvasPosition(index: number, pair: 0 | 1) {
  const cornerPosition = {
    x: getCornerPosition(index, "x", pair as 0 | 1),
    z: getCornerPosition(index, "z", pair as 0 | 1),
  };
  const laneName = getLaneName(index, pair);
  const isFrontal = laneName[0] === "f";
  const lanePosition = {
    [isFrontal ? "x" : "z"]: displacement * -Math.sign(pair - 0.5),
  };
  const lanePositions = {
    frontal0: lanePosition,
    frontal1: lanePosition,
    "side-lane0": lanePosition,
    "side-lane1": lanePosition,
    corner0: cornerPosition,
    corner1: cornerPosition,
  };

  return lanePositions[laneName];
}

function getPexelsSrc(index: number, pair: number): string {
  const imageIndex = 1671323 + (index + pathPositions.length * pair);

  return "https://images.pexels.com/photos/" +
  imageIndex +
  "/pexels-photo-" +
  imageIndex +
  ".jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";
}

export default {
  // tags: {
  //   object: () =>
  //     pathPositions.map(async ({ x, z, laneType }, index) => {
  //       const text = await Text({
  //         text: "x" + x + ",z" + z + "\n" + laneType + index,
  //         path: "./fonts/Montserrat_Regular.json",
  //         color: "#f00",
  //         thickness: 0.1,
  //         size: 0.5,
  //       });

  //       text.position.set(x * pathSize, 3, z * pathSize);

  //       return text;
  //     }),
  //   onAnimation: ({ object3D }: SceneExport, canvasState: CanvasState) => {
  //     for (const child of object3D.children)
  //       child.lookAt(
  //         canvasState.camera?.position.x as number,
  //         canvasState.camera?.position.y as number,
  //         canvasState.camera?.position.z as number
  //       );
  //   },
  // } as unknown as Scene,
  path: {
    object: () =>
      consulters.getProceduralGroup([
        {
          // floor through the path
          dimensions: [pathPositions.length],
          material: getQuixelMaterial({
            multiplyScalar: pathSize,
            name: "Wood_Parquet",
            code: "uenndanl",
            mapNames: ["AO", "Displacement"],
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
                  // `./images/pictures/img (${index * 2 + pair}).jpg`,
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

              const canvasPosition = getCanvasPosition(index, pair as 0 | 1);

              mesh.position.x += canvasPosition.x ?? 0;
              mesh.position.z += canvasPosition.z ?? 0;

              const canvasRotation = getCanvasRotation(index, pair as 0 | 1);

              mesh.rotateY(canvasRotation);

              return wrapper as unknown as THREE.Object3D<Event>;
            }
          },
        },
      ]),
  } as unknown as Scene,
  // hatches: {
  //   properties: {
  //     position: new THREE.Vector3(0, 2, 35),
  //   },
  //   object: () => {
  //     const spacing = {
  //       x: 25,
  //       z: 4,
  //     };
  //     const dimensions = [3, 2, 1];
  //     const setPosition = (
  //       { x, z }: { x: number; z: number },
  //       position: THREE.Vector3
  //     ) => {
  //       position.x = (x / dimensions[0] - Math.sign(x) / 2) * spacing.x;
  //       position.z = (z - dimensions[2] / 2) * spacing.z;
  //     };
  //     const hatchName = "wavyEgg";

  //     return {
  //       object3D: consulters.getProceduralGroup([
  //         {
  //           geometry: new THREE.SphereBufferGeometry(1, 100, 100),
  //           material: wavyMaterial,
  //           dimensions: [dimensions[0], dimensions[2]],
  //           getIntersectionMesh([x, z], meshTemplate) {
  //             const group = new THREE.Group();

  //             [0, 1].forEach((y) => {
  //               const mesh = meshTemplate.clone();
  //               setPosition({ x, z }, mesh.position);

  //               mesh.rotateX(Math.PI * y);
  //               mesh.rotateY(Math.PI * y);

  //               group.add(mesh);
  //             });

  //             group.name = hatchName;

  //             return group as unknown as THREE.Mesh;
  //           },
  //         },
  //         {
  //           geometry: new THREE.SphereBufferGeometry(0.5, 100, 100),
  //           material: rainbowMaterial,
  //           dimensions,
  //           getIntersectionMesh([x, y, z], mesh) {
  //             setPosition({ x, z }, mesh.position);

  //             return mesh;
  //           },
  //         },
  //       ]),
  //       hatchName,
  //     };
  //   },
  //   onSetup({ object3D, hatchName }: SceneExport) {
  //     object3D.children
  //       .filter(({ name }) => name === hatchName)
  //       .forEach((child) => {
  //         let toggleClose = false;

  //         events.onClickIntersectsObject([child], () => {
  //           toggleClose = !toggleClose;

  //           child.children.forEach((mesh, index) => {
  //             const y = index - 0.5;

  //             gsap.timeline().to(mesh.position, {
  //               y: -y * +toggleClose,
  //               duration: 1,
  //             });
  //           });
  //         });
  //       });
  //   },
  // } as unknown as SceneExport,
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
  // door: {
  //   properties: {
  //     position: new THREE.Vector3(0, 0, 10),
  //   },
  //   object: () => {
  //     const width = 5;

  //     return {
  //       object3D: consulters.getProceduralGroup([
  //         {
  //           dimensions: [2],
  //           material: getQuixelMaterial({
  //             name: "Wood_Plank",
  //             code: "uk3kffzn",
  //             mapNames: ["AO", "Displacement"],
  //           }),
  //           geometry: new THREE.BoxBufferGeometry(width, width * 2, 1),
  //           getIntersectionMesh([x], mesh) {
  //             mesh.position.x = (x - 0.5) * width;

  //             return mesh;
  //           },
  //         },
  //       ]),
  //       width,
  //     };
  //   },
  //   onAnimation({ object3D, width }: SceneExport, canvasState: CanvasState) {
  //     const cameraPosition = new Victor(
  //       canvasState.camera?.position.x,
  //       canvasState.camera?.position.z
  //     );
  //     const objectPosition = new Victor(
  //       object3D.position.x,
  //       object3D.position.z
  //     );
  //     const distanceToOpen = 10;
  //     const distance = cameraPosition.distance(objectPosition);
  //     const isOpened = distance <= distanceToOpen;

  //     if (lastOpenedState !== isOpened) {
  //       lastOpenedState = isOpened;

  //       object3D.children.forEach((child, index) => {
  //         const x = (index - 0.5) * width * (isOpened ? 3 : 1);

  //         // console.log('x', x)

  //         gsap.timeline().to(child.position, {
  //           x,
  //           duration: 5,
  //         });
  //       });
  //     }
  //   },
  // } as unknown as SceneExport,
} as Scenes;
