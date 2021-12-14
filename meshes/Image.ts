import * as THREE from "three";

export default function (
  url: string,
  scale: number
): Promise<{
  mesh: THREE.Mesh<THREE.BoxBufferGeometry, THREE.MeshStandardMaterial>;
  aspectRatio: number;
}> {
  const textureLoader = new THREE.TextureLoader();
  const imageLoader = new THREE.ImageLoader();

  textureLoader.crossOrigin = "anonymous";
  imageLoader.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    imageLoader.load(
      url,
      (image: HTMLImageElement) => {
        const aspectRatio = image.width / image.height;
        const geometry = new THREE.BoxBufferGeometry(aspectRatio * scale, scale, .1);
        const material = new THREE.MeshStandardMaterial({
          map: textureLoader.load(url),
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);

        resolve({ mesh, aspectRatio });
      },
      undefined,
      reject
    );
  });
}
