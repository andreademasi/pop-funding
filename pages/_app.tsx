import '../styles/globals.css'

import { ConnectContext, connector } from '../store/connector'

import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConnectContext.Provider value={connector}>
        <Component {...pageProps} />
      </ConnectContext.Provider>
    </Provider>
  )
}

export default MyApp
