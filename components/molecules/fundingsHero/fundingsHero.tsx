import React, { useCallback, useEffect, useState } from 'react'
import CreatePool from '../../atoms/createPool/createPool'
import Pools from '../pools/pools'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { database } from '../../../firebaseConfig'

export interface ItemPool {
  title: string
  description: string
  dateStart: number
  dateEnd: number
  id: string
}

const FundingsHero = () => {
  const [create, setCreate] = useState<boolean>(false)
  const dbInstance = collection(database, 'active-pools')
  const [poolsArray, setPoolsArray] = useState<Array<ItemPool>>([])
  const [result, setResult] = useState<boolean>(true)

  const getPools = useCallback(() => {
    console.log('Data fetched')
    getDocs(dbInstance)
      .then((data) => {
        setPoolsArray(
          data.docs.map((item) => {
            const itemData = item.data()
            return {
              title: itemData.title,
              description: itemData.description,
              dateStart: itemData.dateStart,
              dateEnd: itemData.dateEnd,
              id: item.id,
            }
          })
        )
        setResult(true)
      })
      .catch((error) => {
        console.log(error)
        setResult(false)
      })
  }, [dbInstance])

  useEffect(() => {
    getPools()
  }, [])

  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="z-10 my-40 flex flex-row justify-center text-left align-middle">
        <h1 className=" mx-8 text-center font-mont text-smallH1 tracking-wider text-brown md:flex-row md:text-bigH1">
          Explore or{' '}
          <span
            className=" cursor-pointer leading-3 underline decoration-solid decoration-2 underline-offset-8 transition-[text-decoration-thickness] hover:decoration-4"
            onClick={() => setCreate(true)}
          >
            create
          </span>{' '}
          fundings
        </h1>
      </div>
      {result ? (
        poolsArray.length > 0 ? (
          <Pools poolsArray={poolsArray} />
        ) : (
          <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center text-lg shadow-2xl">
            There are no fundings opened
          </p>
        )
      ) : (
        <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center shadow-2xl">
          Error fetching from database
        </p>
      )}
      <button
        className=" z-10 mx-auto mt-20 flex w-fit flex-col rounded-2xl bg-brown px-8 py-px text-smallA text-purple transition-transform hover:scale-105 md:text-bigA"
        onClick={() => setCreate(true)}
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
    </div>
  )
}

export default FundingsHero
