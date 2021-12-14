import type { NextPage } from 'next'
import Head from 'next/head'
import * as Components from '../components'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home for 3D experiments</title>
        <meta name="description" content="Home for 3D experiments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {'Usa el server getter de next js para agarrar los nombres de todas las escenas (except default) y generar links'}
    </div>
  )
}

export default Home
