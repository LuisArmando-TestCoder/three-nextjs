  
import React, { Ref } from 'react'

import './style.module.scss'

interface Properties {
    id: string
    className?: string
    reference?: null | Ref<HTMLCanvasElement> 
}

export default ({
    id,
    className = '',
    reference = null
}: Properties) => {
    return (
        <div className={`canvas-container ${className}`}>
            <canvas
                className='canvas-container__canvas'
                ref={reference}
                id={id}
                tabIndex={0}
            />
        </div>
    )
}