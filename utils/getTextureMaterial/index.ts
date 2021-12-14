import * as THREE from "three";

const loader = new THREE.TextureLoader();

export function getMap(src: string, originalMap: THREE.Texture) {
  const map = loader.load(src);

  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.copy(originalMap.repeat);

  return map;
}

export interface Maps {
  roughness?: string;
  ao?: string;
  normal?: string;
  bump?: string;
  metal?: string;
  baseColor: string;
}

/**
 *
 * Note: The texture image will be kept under a path like
 * [path]/[mapName].png
 *
 * @abstract
 * - Valid mapName: baseColor | normal | ao | roughness | bump
 */
export default ({
  maps,
  repeatSet = new THREE.Vector2(1, 1),
  multiplyScalar = 1,
}: {
  maps: Maps;
  repeatSet?: THREE.Vector2;
  multiplyScalar?: number;
}): THREE.MeshStandardMaterial => {
  const baseColorSrc = maps.baseColor;
  const normalSrc = maps.normal;
  const aoSrc = maps.ao;
  const roughnessSrc = maps.roughness;
  const bumpSrc = maps.bump;
  const metalSrc = maps.metal;
  const map = loader.load(baseColorSrc);

  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatSet.x, repeatSet.y).multiplyScalar(multiplyScalar);

  const normalMap = normalSrc && getMap(normalSrc, map);
  const aoMap = aoSrc && getMap(aoSrc, map);
  const roughnessMap = roughnessSrc && getMap(roughnessSrc, map);
  const bumpMap = bumpSrc && getMap(bumpSrc, map);
  const metalnessMap = metalSrc && getMap(metalSrc, map);
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughnessMap: roughnessMap as THREE.Texture,
    aoMap: aoMap as THREE.Texture,
    normalMap: normalMap as THREE.Texture,
    bumpMap: bumpMap as THREE.Texture,
    metalnessMap: metalnessMap as THREE.Texture,
    map,
  });

  return material;
};
