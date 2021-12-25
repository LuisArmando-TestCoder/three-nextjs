import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Stage</title>
                <meta name="description" content="Stage" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Stage'}
                scenes={[
                    'Default',
                    'Stage',
                ]}
            />
        </div>
    )
}
