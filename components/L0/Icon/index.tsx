import React from 'react'
import { RecoilState, RecoilValue } from 'recoil'
import {
    Icons as IconsState
} from '../../../state'
import {
    usePromisedRecoilValue
} from '../../../utils'

type Name = 'magnifying-glass' | 'back' | 'settings'

interface Properties {
    name: string
    className?: string
}

const Icon = ({
    name,
    className = ''
}: Properties) => {
    const icon = usePromisedRecoilValue(IconsState as RecoilState<{[index: string]: string }>, {
        transform: (icons: {[index: string]: string }) => icons[name]
    })

    return (
        <span
            className={`icon ${className}`}
            dangerouslySetInnerHTML={{ __html: icon as any }}
        />
    )
}

export default (properties: Properties) => {
    return (
        <Icon {...properties} />
    )
}