import * as THREE from "three";
import getTextureMaterial, { Maps } from "../getTextureMaterial";

const mapsTranspilation = {
  Albedo: "baseColor",
  Displacement: "bump",
  Metalness: "metal",
  Normal: "normal",
  Roughness: "roughness",
  AO: "ao",
} as const;

type PossibleMap =
  | "Displacement"
  | "Metalness"
  | "AO"
  | "Albedo"
  | "Roughness"
  | "Normal";

function getQuixelPathMaps({
  name,
  code,
  mapNames,
}: {
  name: string;
  code: string;
  mapNames: PossibleMap[];
}): Maps {
  const maps: Maps = {
    baseColor: `./textures/${name}_${code}_2K_surface_ms/${code}_2K_`,
  };
  const basePath = maps.baseColor;

  mapNames
    .concat("Albedo", "Roughness", "Normal")
    .forEach((mapName: PossibleMap) => {
      maps[mapsTranspilation[mapName]] = `${basePath}${mapName}.jpg`;
    });

  return maps;
}

export default ({
  multiplyScalar = 1,
  repeatSet = new THREE.Vector2(1, 1),
  mapNames = [],
  name,
  code,
}: {
  multiplyScalar?: number;
  repeatSet?: THREE.Vector2;
  mapNames?: PossibleMap[];
  name: string;
  code: string;
}): THREE.MeshStandardMaterial => {
  return getTextureMaterial({
    multiplyScalar,
    repeatSet,
    maps: getQuixelPathMaps({
      name,
      code,
      mapNames,
    }),
  });
};
