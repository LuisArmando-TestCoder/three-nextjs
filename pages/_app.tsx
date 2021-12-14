import type { AppProps } from 'next/app'
import {
    RecoilRoot,
} from 'recoil'
import RecoilOutside from 'recoil-outside'

import '../styles/main.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilOutside />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
