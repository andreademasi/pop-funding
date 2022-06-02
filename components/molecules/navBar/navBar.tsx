import React, { useContext, useEffect } from 'react'
import {
  ellipseAddress,
  formatBigNumWithDecimals,
} from '../../../helpers/utilities'
import {
  getAccountAssets,
  onSessionUpdate,
  reset,
  selectAssets,
} from '../../../features/walletConnectSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'

import { ConnectContext } from '../../../store/connector'
import { IAssetData } from '../../../helpers/types'
import Link from 'next/link'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import { setIsModalOpen } from '../../../features/applicationSlice'
import { useSelector } from 'react-redux'

const items = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Fundings',
    link: '/fundings',
  },
]

const NavBar = () => {
  const connector = useContext(ConnectContext)
  const {
    fetching: loading,
    address,
    chain,
    assets,
  } = useAppSelector((state) => state.walletConnect)
  //const assets = useAppSelector((state) => state.walletConnect.assets)
  const dispatch = useAppDispatch()

  const connect = async () => {
    if (connector.connected) return
    if (connector.pending) return QRCodeModal.open(connector.uri, null)
    await connector.createSession()
  }

  const disconnect = () => {
    connector.killSession()
  }

  useEffect(() => {
    // Check if connection is already established
    if (connector.connected) {
      const { accounts } = connector
      dispatch(onSessionUpdate(accounts))
    }

    // Subscribe to connection events
    console.log('%cin subscribeToEvents', 'background: yellow')
    connector.on('connect', (error, payload) => {
      QRCodeModal.close()
      console.log('%cOn connect', 'background: yellow')
      if (error) {
        throw error
      }
      const { accounts } = payload.params[0]
      dispatch(onSessionUpdate(accounts))
      dispatch(setIsModalOpen(false))
    })

    connector.on('session_update', (error, payload) => {
      console.log('%cOn session_update', 'background: yellow')
      if (error) {
        throw error
      }
      const { accounts } = payload.params[0]
      dispatch(onSessionUpdate(accounts))
    })

    connector.on('disconnect', (error, payload) => {
      console.log('%cOn disconnect', 'background: yellow')
      if (error) {
        throw error
      }
      dispatch(reset())
    })

    return () => {
      console.log('%cin unsubscribeFromEvents', 'background: yellow')
      connector.off('connect')
      connector.off('session_update')
      connector.off('disconnect')
    }
  }, [dispatch, connector])

  useEffect(() => {
    // Retrieve assets info
    if (address?.length > 0) {
      console.log('chain: ', chain)
      dispatch(getAccountAssets({ chain, address }))
    }
  }, [dispatch, address, chain])

  const nativeCurrency = assets.find((asset: IAssetData) => asset.id === 0)!

  return (
    <nav className="absolute top-0 my-5 mx-4 flex w-full flex-row flex-wrap justify-evenly gap-4 align-middle ">
      {items.map((item, index) => (
        <span
          key={index}
          className="after:content-[' '] z-10 flex flex-col text-smallA after:h-px after:w-0 after:self-center after:bg-brown after:transition-all after:duration-300 after:hover:w-full md:text-bigA"
        >
          <Link href={item.link}>{item.name}</Link>
        </span>
      ))}
      {connector.connected ? (
        loading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={25}
            height={25}
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#dfb59c"
              strokeWidth="10"
              r="35"
              strokeDasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              ></animateTransform>
            </circle>
          </svg>
        ) : (
          <>
            <span>
              {formatBigNumWithDecimals(
                nativeCurrency.amount,
                nativeCurrency.decimals
              )}{' '}
              {nativeCurrency.unitName || 'units'}
            </span>
            <span className="header-account">{ellipseAddress(address)}</span>
            <button
              className=" z-10 flex flex-col rounded-2xl border-2 border-brown px-6 py-px text-smallA hover:scale-105 md:text-bigA"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </>
        )
      ) : (
        <button
          className=" z-10 flex flex-col rounded-2xl bg-brown px-6 py-px text-smallA text-purple hover:scale-105 md:text-bigA"
          onClick={connect}
        >
          Connect
        </button>
      )}
    </nav>
  )
}

export default NavBar
