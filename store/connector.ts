import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import WalletConnect from '@walletconnect/client'
import { createContext } from 'react'

const connectProps = {
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
  clientMeta: {
    description: 'Decentralized Crowdfunding made easy',
    url: 'https://pop-funding.vercel.app/',
    icons: ['https://nodejs.org/static/images/logo.svg'],
    name: 'PoP! Funding',
  },
}
export const connector = new WalletConnect(connectProps)
export const ConnectContext = createContext(connector)
