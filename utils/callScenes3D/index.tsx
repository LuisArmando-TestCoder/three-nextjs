import * as scenes3D from '../../scenes'

export default (sceneNames: string[], id: string) => {
    for (const sceneName of sceneNames) {
        (
            scenes3D as { [index: string]: (id: string) => void }
        )[sceneName](id)
    }
}
