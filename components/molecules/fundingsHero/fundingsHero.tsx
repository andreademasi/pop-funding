import React, { useCallback, useContext, useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'

import { ConnectContext } from '../../../store/connector'
import CreatePool from '../../atoms/createPool/createPool'
import Pools from '../pools/pools'
import PopUp from '../popUp/popUp'
import { database } from '../../../firebaseConfig'
import Loader from '../../atoms/loader/loader'

export interface ItemPool {
  creator: string
  claimed: boolean
  appAddress: string
  appId: number
  title: string
  description: string
  dateStart: number
  dateEnd: number
  dateClose: number
  goal: number
  current: number
  firestoreId: string
}

const enum filter {
  all = 0,
  active = 1,
  ended = 2,
  closed = 3,
  future = 4,
}

export enum status {
  future = -1,
  active = 0,
  ended = 1,
  closed = 2,
}

const FundingsHero = () => {
  const [create, setCreate] = useState<boolean>(false)
  const dbInstance = collection(database, 'active-pools')
  const [poolsArray, setPoolsArray] = useState<Array<ItemPool>>([])
  const [endedArray, setEndedArray] = useState<Array<ItemPool>>([])
  const [closedArray, setClosedArray] = useState<Array<ItemPool>>([])
  const [futureArray, setFutureArray] = useState<Array<ItemPool>>([])
  const [activeArray, setActiveArray] = useState<Array<ItemPool>>([])
  const [result, setResult] = useState<boolean>(true)
  const [popUp, setPopUp] = useState<boolean>(false)
  const [filterStatus, setFilterStatus] = useState<number>(filter.all)
  const [loading, setLoading] = useState<boolean>(false)

  const connector = useContext(ConnectContext)

  const [state, setState] = useState<string>('Fetching from database')

  const getPools = () => {
    console.log('Data fetched')
    setLoading(true)
    getDocs(dbInstance)
      .then((data) => {
        setPoolsArray(
          data.docs.map((item) => {
            const itemData = item.data()
            return {
              claimed: itemData.claimed,
              creator: itemData.creator,
              title: itemData.title,
              description: itemData.description,
              dateStart: itemData.dateStart,
              dateEnd: itemData.dateEnd,
              dateClose: itemData.dateClose,
              goal: itemData.goal,
              current: itemData.current,
              firestoreId: item.id,
              appAddress: itemData.appAddress,
              appId: itemData.appId,
            }
          })
        )
        setResult(true)
      })
      .catch((error) => {
        console.log(error)
        setResult(false)
      })
      .finally(() => {
        setState('There are no fundings')
        setLoading(false)
      })
  }

  useEffect(() => {
    getPools()
  }, [])

  useEffect(() => {
    setActiveArray(poolsArray.filter((item) => check(item) == status.active))
    setEndedArray(poolsArray.filter((item) => check(item) == status.ended))
    setClosedArray(poolsArray.filter((item) => check(item) == status.closed))
    setFutureArray(poolsArray.filter((item) => check(item) == status.future))
  }, [poolsArray])

  const check = (pool: ItemPool) => {
    const x = new Date()
    const start = new Date(pool.dateStart)
    const end = new Date(pool.dateEnd)
    const close = new Date(pool.dateClose)

    if (x >= start && x < end) return status.active
    else if (x >= end && x < close) return status.ended
    else if (x >= close) return status.closed
    else return status.future
  }

  const handleCreateClick = () => {
    if (connector.connected) setCreate(true)
    else setPopUp(true)
  }

  const handleFilterClick = (status: number) => {
    setFilterStatus(status)
  }

  const checkFilter = (status: number) => {
    if (filterStatus == filter.all || filterStatus == status) return true
    return false
  }

  const classH2 = 'text-smallH2 md:text-bigH2 mt-8 md:ml-16 md:mr-auto '
  const classFilter =
    'text-[0.85rem] md:text-base rounded-lg transition-background transition-color duration-300 py-px md:py-2 px-2 md:px-4 cursor-pointer'

  return (
    <div className="flex w-full flex-col justify-center align-middle">
      <div className="z-10 my-40 flex flex-row justify-center text-left align-middle">
        <h1 className=" mx-8 text-center font-mont text-smallH1 tracking-wider text-brown md:flex-row md:text-bigH1">
          Explore or{' '}
          <span
            className=" cursor-pointer leading-3 underline decoration-solid decoration-2 underline-offset-8 transition-[text-decoration-thickness] hover:decoration-4"
            onClick={handleCreateClick}
          >
            create
          </span>{' '}
          fundings
        </h1>
      </div>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <Loader width={70} height={70} />
        </div>
      ) : result ? (
        poolsArray.length > 0 ? (
          <div className=" mx-auto flex w-full flex-col items-center justify-center">
            <div className="my-4 mr-4 ml-4 flex flex-row gap-2 rounded-xl border-2 border-brown p-px md:ml-auto">
              <p
                style={
                  filterStatus == filter.all
                    ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                    : {}
                }
                className={classFilter}
                onClick={() => handleFilterClick(filter.all)}
              >
                All
              </p>
              <p
                style={
                  filterStatus == filter.active
                    ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                    : {}
                }
                className={classFilter}
                onClick={() => handleFilterClick(filter.active)}
              >
                Active
              </p>
              <p
                style={
                  filterStatus == filter.ended
                    ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                    : {}
                }
                className={classFilter}
                onClick={() => handleFilterClick(filter.ended)}
              >
                Ended
              </p>
              <p
                style={
                  filterStatus == filter.closed
                    ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                    : {}
                }
                className={classFilter}
                onClick={() => handleFilterClick(filter.closed)}
              >
                Closed
              </p>
              <p
                style={
                  filterStatus == filter.future
                    ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                    : {}
                }
                className={classFilter}
                onClick={() => handleFilterClick(filter.future)}
              >
                Future
              </p>
            </div>
            {checkFilter(filter.active) ? (
              <>
                <h2 className={classH2}>Active fundings</h2>
                <Pools
                  poolsArray={activeArray}
                  type={'active'}
                  showPopUp={() => {
                    setPopUp(true)
                  }}
                  getPools={getPools}
                  status={status.active}
                />
              </>
            ) : null}
            {checkFilter(filter.ended) ? (
              <>
                <h2 className={classH2}>Ended fundings</h2>
                <Pools
                  poolsArray={endedArray}
                  type={'ended'}
                  showPopUp={() => {
                    setPopUp(true)
                  }}
                  getPools={getPools}
                  status={status.ended}
                />
              </>
            ) : null}
            {checkFilter(filter.closed) ? (
              <>
                <h2 className={classH2}>Closed fundings</h2>
                <Pools
                  poolsArray={closedArray}
                  type={'closed'}
                  showPopUp={() => {
                    setPopUp(true)
                  }}
                  getPools={getPools}
                  status={status.closed}
                />
              </>
            ) : null}
            {checkFilter(filter.future) ? (
              <>
                <h2 className={classH2}>Future fundings</h2>
                <Pools
                  poolsArray={futureArray}
                  type={'future'}
                  showPopUp={() => {
                    setPopUp(true)
                  }}
                  getPools={getPools}
                  status={status.future}
                />
              </>
            ) : null}
          </div>
        ) : (
          <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center text-lg shadow-2xl">
            {state}
          </p>
        )
      ) : (
        <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center shadow-2xl">
          Error fetching from database
        </p>
      )}
      <button
        className=" z-10 mx-auto mt-20 flex w-fit flex-col rounded-2xl bg-brown px-8 py-px text-smallA text-purple transition-transform hover:scale-105 md:text-bigA"
        onClick={handleCreateClick}
      >
        <h2 className="text-smallH2 md:text-bigH2">Create funding</h2>
      </button>
      <div
        style={
          create
            ? {
                opacity: 1,
                zIndex: 100,
              }
            : { opacity: 0, zIndex: -100 }
        }
        className="transition-[z-index_opacity] duration-300"
      >
        <CreatePool
          dbInstance={dbInstance}
          getPools={getPools}
          setCreate={setCreate}
        />
      </div>
      {popUp ? (
        <PopUp>
          <p>You have to connect a wallet first</p>
          <button
            className="transition-scale mx-4 mt-8 w-fit rounded-2xl bg-brown px-4 py-px text-center text-purple duration-100 hover:scale-105"
            onClick={() => setPopUp(false)}
          >
            Ok
          </button>
        </PopUp>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FundingsHero
