import React, { useEffect, useState } from 'react'
import { database } from '../../../firebaseConfig'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import Pool from '../../atoms/pool/pool'

interface ItemPool {
  title: string
  description: string
  date: number
  id: string
}

const Pools = () => {
  const dbInstance = collection(database, 'active-pools')
  const [poolsArray, setPoolsArray] = useState<Array<ItemPool>>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [result, setResult] = useState<boolean>(false)

  const addPool = (title: string, description: string) => {
    addDoc(dbInstance, {
      title: title,
      description: description,
      date: Date.now(),
    }).then((response) => {
      if (response) {
        setResult(true)
        setTitle('')
        setDescription('')
        getPools()
      } else {
        setResult(false)
      }
    })
  }

  const getPools = () => {
    getDocs(dbInstance).then((data) => {
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
    })
  }

  useEffect(() => {
    getPools()
  }, [])

  const inputClass =
    'rounded-2xl shadow-xl border-brown p-2 m-2 w-20% bg-[#0000005e]'

  return (
    <div className="mx-4 flex flex-col justify-center align-middle">
      <div className="flex w-full flex-row flex-wrap justify-center align-middle">
        {poolsArray
          .sort((a, b) => {
            return a.date - b.date
          })
          .map((item, index) => {
            return (
              <Pool
                title={item.title}
                description={item.description}
                date={item.date}
                key={index}
              />
            )
          })}
      </div>
      <div className="mx-auto flex w-[80%] flex-col overflow-hidden md:w-1/2">
        <input
          type={'text'}
          className={inputClass}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        <textarea
          className={inputClass}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          value={description}
        />
        <button
          className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
          onClick={() => addPool(title, description)}
        >
          Add New Pool
        </button>
      </div>
    </div>
  )
}

export default Pools
