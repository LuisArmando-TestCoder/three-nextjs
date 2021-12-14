import * as THREE from "three";
import presetScene, { consulters, types, actions } from "scene-preset";
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
        if (canvasState.camera) {
          canvasState.camera.position.y = 4.5;
        }

        sceneEvents = await consulters.getSceneLifeCycle(scene);
        
        sceneEvents?.onSetup(canvasState);
      },
      async animate(canvasState: types.state.CanvasState) {
        actions.blacklistControls(["setFirstPersonFlying"]);

        sceneEvents?.onAnimation(canvasState);
      },
    },
    `#${id}`
  );

