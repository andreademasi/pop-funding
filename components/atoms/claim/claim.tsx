import React, { useContext, useEffect, useState } from 'react'
import { claim, isOptedIn, reclaim } from '../../../helpers/api'
import { ConnectContext } from '../../../store/connector'
import PopUp from '../../molecules/popUp/popUp'
import Loader from '../loader/loader'

interface ClaimProps {
  creator: string
  title: string
  current: number
  goal: number
  appId: number
  close: () => void
  onClaimSuccess: () => void
}

const Claim = ({
  creator,
  title,
  current,
  goal,
  appId,
  close,
  onClaimSuccess,
}: ClaimProps) => {
  const connector = useContext(ConnectContext)
  const [creatorCheck, setCreatorCheck] = useState<boolean>(false)
  const [goalCheck, setGoalCheck] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const claimer = connector.accounts[0]

  const check = () => {
    if (creator == claimer) setCreatorCheck(true)
    else setCreatorCheck(false)
    if (current >= goal) setGoalCheck(true)
    else setGoalCheck(false)
  }

  useEffect(() => {
    check()
  }, [])

  const handleClaimClick = () => {
    setLoading(true)
    claim(claimer, appId, connector).then(() => {
      onClaimSuccess()
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
          <strong>{title}</strong>
        </h3>
        <div className="mx-auto my-8 flex w-fit max-w-[90%] flex-row items-center justify-around rounded-xl border-2 border-transparentBrown">
          <p className="mx-6 ">
            <strong>Max:</strong> {current}
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
            {/* <p className="mt-4">Confirm on your wallet</p> */}
          </>
        ) : creatorCheck ? (
          <>
            {goalCheck ? (
              <p className="m-2 rounded-2xl border-2 border-green-500 p-2 text-green-500">
                Congratulations!
                <br />
                The funding has reached the goal!
                <br />
                Click the button below to claim the donations
              </p>
            ) : (
              <p className="m-2">
                Unluckily the funding has not reached the goal
                <br />
                Click the button below to claim the donations (if there are any)
              </p>
            )}

            <button
              className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
              onClick={handleClaimClick}
            >
              Claim
            </button>
          </>
        ) : (
          <p className="opacity-80">You are not the creator of this funding</p>
        )}
      </div>
    </PopUp>
  )
}

export default Claim
