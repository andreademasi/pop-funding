import React, { useContext } from 'react'

import { ConnectContext } from '../../../store/connector'
import { MAX_TIMESTAMP } from '../../../utilities/constants/maxTimestamp'
import PopUp from '../../molecules/popUp/popUp'
import { donate } from '../../../helpers/api'
import { useInView } from 'react-intersection-observer'

interface PoolProps {
  title: string
  description: string
  dateStart: number
  dateEnd: number
  dateClose: number
  goal: number
  current: number
  showPopUp: () => void
  appId: number
  appAddress: string
}

const Pool = ({
  title,
  description,
  dateStart,
  dateEnd,
  dateClose,
  goal,
  current,
  showPopUp,
  appId,
  appAddress,
}: PoolProps) => {
  const connector = useContext(ConnectContext)

  const [ref, inView, _entry] = useInView({
    threshold: 0,
    fallbackInView: true,
    rootMargin: '-10% 0px -10% 0px',
  })

  const isAvaiable = () => {
    const x = new Date()
    const start = new Date(dateStart)
    const end = new Date(dateEnd)
    if (x > start && x < end) {
      return true
    }
    return false
  }

  const dateConverter = (date: number) => {
    const x = new Date(date)
    const y =
      x >= new Date(MAX_TIMESTAMP)
        ? 'No end date'
        : x.toString().split('GMT')[0].slice(4)
    return y == 'lid Date' ? 'Invalid date' : y
  }

  const handleContributeClick = () => {
    if (connector.connected) {
      donate(appId, appAddress, connector, 1)
    } else showPopUp()

    return (
      <div
        ref={ref}
        style={
          inView
            ? { opacity: 1 }
            : { opacity: 0, transform: 'scale(0.7) rotate(4deg)' }
        }
        className="relative m-4 flex h-fit flex-[1_1_280px] flex-col justify-center rounded-2xl bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink align-middle shadow-lg transition-[transform_opacity] duration-200 hover:scale-[1.01]"
      >
        <p className="relative top-2 left-2 mb-2 w-fit rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
          Start: {dateConverter(dateStart)}
        </p>
        <h3 className="my-4 mx-4 text-xl font-bold tracking-wider">{title}</h3>
        <p className="mx-6 mt-4 mb-8 max-h-[10em] overflow-y-scroll whitespace-pre-wrap px-2 font-thin opacity-90">
          {description}
        </p>
        <div className="mx-auto mb-8 flex w-fit flex-row items-center justify-around rounded-xl border-2 border-transparentBrown">
          <p className="mx-6 ">
            <strong>Current:</strong> {current}
          </p>
          <p className="mx-6 ">
            <strong>Goal:</strong> {goal}
          </p>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          {/* <button className="transition-scale mx-4 w-fit rounded-2xl border-2 border-brown px-4 py-px text-center text-brown duration-100 hover:scale-105">
          Info
        </button> */}
          {isAvaiable() ? (
            <button
              disabled={!isAvaiable()}
              style={isAvaiable() ? { opacity: 1 } : { opacity: 0.5 }}
              className="transition-scale mx-4 w-fit rounded-2xl bg-brown px-4 py-px text-center text-purple duration-100 hover:scale-105"
              onClick={handleContributeClick}
            >
              Contribute
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-8 mb-2 flex flex-row items-center justify-between">
          <p className="mx-2 flex w-fit flex-row flex-wrap rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
            <span>End:</span> <span>{dateConverter(dateEnd)}</span>
          </p>
          <p className="mx-2 flex w-fit flex-row flex-wrap rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
            <span>Close:</span> <span>{dateConverter(dateClose)}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default Pool
