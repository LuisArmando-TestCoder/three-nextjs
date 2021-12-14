import * as THREE from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const loader = new FontLoader();

interface Properties {
  text: string;
  path: string;
  size?: number;
  thickness?: number;
  color?: string;
  material?: THREE.Material;
}

export default ({
  text,
  path,
  size = 1,
  thickness = 1,
  color = "#000",
  material = new THREE.MeshStandardMaterial({ color }),
}: Properties): Promise<THREE.Mesh> => {
  return new Promise<THREE.Mesh>((resolve, reject) => {
    loader.load(
      path,
      (font: Font) => {
        const geometry = new TextGeometry(text, {
          font,
          size,
          height: thickness,
        });
        const textMesh = new THREE.Mesh(geometry, [material, material]);

        textMesh.castShadow = true;

        resolve(textMesh);
      },
      undefined,
      reject
    );
  });
};
