import React, { useContext, useEffect, useState } from 'react'
import { isOptedIn, reclaim } from '../../../helpers/api'
import { ConnectContext } from '../../../store/connector'
import PopUp from '../../molecules/popUp/popUp'
import Loader from '../loader/loader'

interface ReclaimProps {
  title: string
  current: number
  goal: number
  appId: number
  appAddress: string
  close: () => void
  onReclaimSuccess: (value: number) => void
}

const Reclaim = ({
  title,
  current,
  goal,
  appId,
  close,
  onReclaimSuccess,
}: ReclaimProps) => {
  const connector = useContext(ConnectContext)
  const [optedIn, setOptedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const reclaimer = connector.accounts[0]

  const checkOpt = async () => {
    setLoading(true)
    const opted = await isOptedIn(reclaimer, appId)
    setLoading(false)
    if (opted) setOptedIn(true)
    else setOptedIn(false)
  }

  useEffect(() => {
    checkOpt()
  }, [])

  const handleReclaimClick = () => {
    setLoading(true)
    reclaim(reclaimer, appId, connector).then(() => {
      onReclaimSuccess(0)
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
          Do you want to reclaim your donation to <br />
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
            <p className="m-2">
              Unluckily the funding you donated to has not reached the goal
              <br />
              If you want, you can reclaim your donations by clicking the button
              below
            </p>
            <button
              className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
              onClick={handleReclaimClick}
            >
              Reclaim
            </button>
          </>
        ) : (
          <p className="opacity-80">You have not contributed to this funding</p>
        )}
      </div>
    </PopUp>
  )
}

export default Reclaim
