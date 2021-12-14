import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Home for 3D experiments</title>
                <meta name="description" content="Gallery for 3D experiments" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Gallery'}
                scenes={[
                    'Default',
                    'Gallery',
                ]}
            />
        </div>
    )
}
