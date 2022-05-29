import React, { useCallback, useEffect, useState } from 'react'
import CreatePool from '../../atoms/createPool/createPool'
import Pools from '../pools/pools'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { database } from '../../../firebaseConfig'

export interface ItemPool {
  title: string
  description: string
  date: number
  id: string
}

const FundingsHero = () => {
  const [create, setCreate] = useState<boolean>(false)
  const dbInstance = collection(database, 'active-pools')
  const [poolsArray, setPoolsArray] = useState<Array<ItemPool>>([])
  const [result, setResult] = useState<boolean>(true)

  const getPools = useCallback(() => {
    getDocs(dbInstance)
      .then((data) => {
        setPoolsArray(
          data.docs.map((item) => {
            const itemData = item.data()
            return {
              title: itemData.title,
              description: itemData.description,
              date: itemData.date,
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
  }, [getPools])
  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="z-10 my-40 flex flex-row justify-center text-left align-middle">
        <h1 className=" text-center font-mont text-smallH1 tracking-wider text-brown md:flex-row md:text-bigH1">
          Explore or{' '}
          <span
            className="transition-decoration cursor-pointer leading-3 underline decoration-solid decoration-2 underline-offset-8"
            onClick={() => setCreate(true)}
          >
            create
          </span>{' '}
          fundings
        </h1>
      </div>
      {result ? (
        <Pools poolsArray={poolsArray} />
      ) : (
        <p className="w-70% mb-16 rounded-2xl border-2 border-brown px-8 py-4 text-center shadow-2xl">
          Error fetching from database
        </p>
      )}
      {create ? (
        <CreatePool
          dbInstance={dbInstance}
          getPools={getPools}
          setCreate={setCreate}
        />
      ) : null}
    </div>
  )
}

export default FundingsHero
