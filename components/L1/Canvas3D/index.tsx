import React, { useEffect } from 'react'
import * as Components from '../..'
import { callScenes3D } from '../../../utils'
import styles from './styles.module.scss'

export default ({ scenes, className = '', id }: {
    scenes: string[]
    id: string
    className?: string
}) => {
    useEffect(() => callScenes3D(scenes, id), [])

    return (
        <Components.L0.CanvasContainer
            className={
                `canvas-3d ${className} ${styles["canvas-container"]}`
            }
            id={id}
        />
    )
}