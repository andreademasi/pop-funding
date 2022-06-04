import React, { useContext, useEffect, useState } from 'react'
import PopUp from '../../molecules/popUp/popUp'
import { donate, isOptedIn, optIn } from '../../../helpers/api'
import { ConnectContext } from '../../../store/connector'
import Loader from '../loader/loader'

interface ContributeProps {
  title: string
  current: number
  goal: number
  appId: number
  appAddress: string
  close: () => void
  onTransactionSuccess: (value: number) => void
}

const Contribute = ({
  title,
  current,
  goal,
  appId,
  appAddress,
  close,
  onTransactionSuccess,
}: ContributeProps) => {
  const connector = useContext(ConnectContext)
  const [optedIn, setOptedIn] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const sender = connector.accounts[0]

  const checkOpt = async () => {
    setLoading(true)
    const opted = await isOptedIn(sender, appId)
    setLoading(false)
    if (opted) setOptedIn(true)
    else setOptedIn(false)
  }

  useEffect(() => {
    checkOpt()
  }, [])

  const handleOptInClick = () => {
    setLoading(true)
    optIn(sender, appId, connector).then(() => {
      setOptedIn(true)
      setLoading(false)
    })
  }

  const handleDonateClick = () => {
    setLoading(true)
    donate(appId, appAddress, connector, amount).then(() => {
      onTransactionSuccess(amount)
      close()
      setLoading(false)
    })
  }

  return (
    <PopUp>
      <div
        onClick={() => close()}
        className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer"
      >
        <svg
          className="h-6 w-6 fill-current text-brown"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
        </svg>
      </div>
      <div className="mt-4 flex flex-col items-center justify-center">
        <h3 className="text-base md:text-xl">
          Do you want to contribute to <br />
          <strong>{title}</strong> ?
        </h3>
        <div className="mx-auto my-8 flex w-fit max-w-[90%] flex-row items-center justify-around rounded-xl border-2 border-transparentBrown">
          <p className="mx-6 ">
            <strong>Current:</strong> {current}
          </p>
          <p className="mx-6 ">
            <strong>Goal:</strong> {goal}
          </p>
        </div>
        {loading ? (
          <>
            <button className="mx-auto mt-4 flex items-center justify-center rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2">
              <Loader stroke="purple" />
            </button>
            <p className="mt-4">Confirm on your wallet</p>
          </>
        ) : optedIn ? (
          <>
            <p>Choose the amount </p>
            <span className="relative flex items-center justify-center">
              <input
                type="number"
                step={10}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="m-2 w-full rounded-2xl border-brown bg-[#0000005e] p-2 shadow-xl"
              />
              <p className="absolute right-8 top-4 opacity-50 ">Algo</p>
            </span>
            <button
              className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
              onClick={handleDonateClick}
            >
              Donate
            </button>
          </>
        ) : (
          <>
            <p className="opacity-80">Before donation you have to Opt In</p>
            <button
              className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
              onClick={handleOptInClick}
            >
              Opt In
            </button>
          </>
        )}
      </div>
    </PopUp>
  )
}

export default Contribute
