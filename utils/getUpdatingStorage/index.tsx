import { getWindow } from 'ssr-window'

export default (
    valueName: string,
    storageType: 'local' | 'session' = 'local'
) => ({
    effects_UNSTABLE: [
        ({ onSet }: {
            onSet(value: any): void
        }) => {

            onSet((value: any) => {
                getWindow()[`${storageType}Storage`]?.setItem(
                    valueName,
                    JSON.stringify(value)
                )
            })
        }
    ]
})