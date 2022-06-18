import React, { useContext, useState } from 'react'

import { ConnectContext } from '../../../store/connector'
import { MAX_TIMESTAMP } from '../../../utilities/constants/maxTimestamp'
import { useInView } from 'react-intersection-observer'
import Contribute from '../../atoms/contribute/contribute'
import { ItemPool } from '../fundingsHero/fundingsHero'
import { collection, doc, increment, updateDoc } from 'firebase/firestore'
import { database } from '../../../firebaseConfig'
import ButtonPool from '../../atoms/buttonPool/buttonPool'
import Reclaim from '../../atoms/reclaim/reclaim'
import Claim from '../../atoms/claim/claim'

interface PoolProps extends ItemPool {
  showPopUp: () => void
  getPools: () => void
}

enum status {
  past = -1,
  active = 0,
  ended = 1,
  closed = 2,
}

enum trigger {
  none = 0,
  contribute = 1,
  reclaim = 2,
  claim = 3,
}

const Pool = ({
  creator,
  claimed,
  title,
  description,
  dateStart,
  dateEnd,
  dateClose,
  goal,
  current,
  showPopUp,
  getPools,
  appId,
  appAddress,
  firestoreId,
}: PoolProps) => {
  const connector = useContext(ConnectContext)
  const [triggerStatus, setTriggerStatus] = useState<number>(trigger.none)
  const dbInstance = collection(database, 'active-pools')
  const poolRef = doc(dbInstance, firestoreId)

  const [ref, inView, _entry] = useInView({
    threshold: 0,
    fallbackInView: true,
    rootMargin: '-10% 0px -10% 0px',
  })

  const checkStatus = () => {
    const x = new Date()
    const start = new Date(dateStart)
    const end = new Date(dateEnd)
    const close = new Date(dateClose)

    if (x >= start && x < end) return status.active
    else if (x >= end && x < close) return status.ended
    else if (x >= close) return status.closed
    else return status.past
  }

  const dateConverter = (date: number) => {
    const x = new Date(date)
    const y =
      x >= new Date(MAX_TIMESTAMP)
        ? 'No end date'
        : x.toString().split('GMT')[0].slice(4)
    return y == 'lid Date' ? 'Invalid date' : y
  }

  const handleTriggerClick = (value: number) => {
    if (connector.connected) {
      setTriggerStatus(value)
    } else showPopUp()
  }

  const onTransactionSuccess = async (value: number) => {
    await updateDoc(poolRef, {
      current: increment(value),
    }).then(() => {
      getPools()
    })
  }

  const onReclaimSuccess = async (value: number) => {
    await updateDoc(poolRef, {
      current: increment(-value),
    }).then(() => {
      getPools()
    })
  }

  const onClaimSuccess = async () => {
    await updateDoc(poolRef, {
      claimed: true,
    }).then(() => {
      getPools()
    })
  }

  return (
    <>
      <div
        ref={ref}
        style={
          inView
            ? { opacity: 1 }
            : { opacity: 0, transform: 'scale(0.7) rotate(4deg)' }
        }
        className="relative m-4 flex h-fit flex-[1_1_280px] flex-col justify-center rounded-2xl bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink align-middle shadow-lg transition-[transform_opacity] duration-200 hover:scale-[1.01]"
      >
        <p className="relative top-2 left-2 mb-2 w-fit rounded-lg bg-transparentWhite px-2 py-1 text-sm opacity-70">
          Start: {dateConverter(dateStart)}
        </p>
        <h3 className="my-4 mx-4 text-xl font-bold tracking-wider">{title}</h3>
        <p className="mx-6 mt-4 mb-8 max-h-[10em] overflow-y-scroll whitespace-pre-wrap px-2 font-thin opacity-90">
          {description}
        </p>
        <div className="mx-auto mb-8 flex w-fit max-w-[90%] flex-row items-center justify-around rounded-lg border-2 border-transparentBrown">
          <p className="mx-6 ">
            <strong>Current:</strong> {current}
          </p>
          <p className="mx-6 ">
            <strong>Goal:</strong> {goal}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* <button className="transition-scale mx-4 w-fit rounded-2xl border-2 border-brown px-4 py-px text-center text-brown duration-100 hover:scale-105">
          Info
        </button> */}
          {(() => {
            switch (checkStatus()) {
              case status.active:
                return (
                  <ButtonPool
                    text="Contribute"
                    handleClick={() => handleTriggerClick(trigger.contribute)}
                  />
                )
              case status.ended:
                return current < goal ? (
                  <>
                    <b>
                      <p className="m-2 rounded-2xl border-2 border-red-500 p-2 text-red-500">
                        The funding has not reached the goal
                        <br /> <br />
                        If you want, you can reclaim the money you put before
                        the close date
                      </p>
                    </b>
                    <ButtonPool
                      text="Reclaim"
                      handleClick={() => handleTriggerClick(trigger.reclaim)}
                    />
                  </>
                ) : (
                  <p className="m-2 rounded-2xl border-2 border-green-500 p-2 text-green-500">
                    Congratulations!
                    <br />
                    The funding has reached the goal!
                  </p>
                )

              case status.closed:
                return (
                  <ButtonPool
                    text="Claim"
                    handleClick={() => handleTriggerClick(trigger.claim)}
                  />
                )
              default:
                return <ButtonPool text="Stay tuned" handleClick={() => {}} />
            }
          })()}
        </div>
        <div className="mt-8 mb-2 flex flex-row items-center justify-between">
          <p className="mx-2 flex w-fit flex-row flex-wrap gap-1 rounded-lg bg-transparentWhite px-2 py-1 text-sm opacity-70">
            <span>End:</span> <span>{dateConverter(dateEnd)}</span>
          </p>
          <p className="mx-2 flex w-fit flex-row flex-wrap gap-1 rounded-lg bg-transparentWhite px-2 py-1 text-sm opacity-70">
            <span>Close:</span> <span>{dateConverter(dateClose)}</span>
          </p>
        </div>
      </div>
      {(() => {
        switch (triggerStatus) {
          case trigger.contribute:
            return (
              <Contribute
                title={title}
                current={current}
                goal={goal}
                appId={appId}
                appAddress={appAddress}
                close={() => setTriggerStatus(trigger.none)}
                onTransactionSuccess={onTransactionSuccess}
              />
            )
          case trigger.reclaim:
            return (
              <Reclaim
                title={title}
                current={current}
                goal={goal}
                appId={appId}
                appAddress={appAddress}
                close={() => setTriggerStatus(trigger.none)}
                onReclaimSuccess={onReclaimSuccess}
              />
            )
          case trigger.claim:
            return (
              <Claim
                creator={creator}
                title={title}
                current={current}
                goal={goal}
                appId={appId}
                close={() => setTriggerStatus(trigger.none)}
                onClaimSuccess={onClaimSuccess}
              />
            )
          default:
            return null
        }
      })()}
    </>
  )
}

export default Pool
