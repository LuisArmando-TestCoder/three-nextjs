import * as THREE from "three";
import presetScene, { consulters, types } from "scene-preset";
import scene from "./scene";

let sceneEvents: {
  sceneGroup: THREE.Group;
  onSetup(canvasState: types.state.CanvasState): void;
  onAnimation(canvasState: types.state.CanvasState): void;
};

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState: types.state.CanvasState) {
        sceneEvents = await consulters.getSceneLifeCycle(scene);

        sceneEvents?.onSetup(canvasState);
      },
      animate(canvasState: types.state.CanvasState) {
        sceneEvents?.onAnimation(canvasState);
      },
    },
    `#${id}`
  );
