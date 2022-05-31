import { addDoc, CollectionReference, DocumentData } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { MAX_TIMESTAMP } from '../../../utilities/constants/maxTimestamp'
interface CreatePoolProps {
  dbInstance: CollectionReference<DocumentData>
  getPools: () => void
  setCreate: (create: boolean) => void
}

const CreatePool = ({ dbInstance, getPools, setCreate }: CreatePoolProps) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  const addPool = (title: string, description: string) => {
    if (title.length >= 1 && startDate.getTime() < endDate.getTime())
      addDoc(dbInstance, {
        title: title,
        description: description,
        dateStart: Date.parse(startDate.toString()),
        dateEnd: Date.parse(endDate.toString()),
      }).then((response) => {
        if (response) {
          setTitle('')
          setDescription('')
          getPools()
        }
      })
    else alert('Date end must be after date start')
  }

  const stringToDate = (date: string) => {
    return new Date(date)
  }

  const dateToString = (date: Date) => {
    return (
      date.toISOString().split(':')[0] + ':' + date.toISOString().split(':')[1]
    )
  }

  const never = () => {
    setEndDate(new Date(MAX_TIMESTAMP))
  }

  useEffect(() => {
    endDate.setHours(endDate.getHours() + 1)
  }, [])

  const inputClass =
    'rounded-2xl shadow-xl border-brown w-full p-2 m-2 bg-[#0000005e]'

  return (
    <div className="m-100% fixed top-1/2 left-1/2 z-50 flex w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-2xl bg-purple p-8 shadow-[0_0px_50px_50rem_#000000a0] md:w-1/2">
      <div
        onClick={() => setCreate(false)}
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
      <h2 className="my-4 text-center text-xl font-bold tracking-wider">
        Create a new pool
      </h2>
      <input
        type={'text'}
        className={inputClass}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title *"
        value={title}
      />
      <textarea
        className={inputClass}
        rows={5}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        value={description}
      />
      <input
        type="datetime-local"
        value={dateToString(startDate)}
        min={dateToString(startDate)}
        className={inputClass}
        onChange={(event) => setStartDate(stringToDate(event.target.value))}
        id="start-date"
        name="start-date"
      />
      <span className="flex w-full flex-col items-center justify-center md:flex-row">
        <input
          type="datetime-local"
          value={dateToString(endDate)}
          min={dateToString(endDate)}
          className={inputClass + ' md:ml-0'}
          onChange={(event) => setEndDate(stringToDate(event.target.value))}
          id="end-date"
          name="end-date"
        />

        <button
          style={
            endDate >= new Date(MAX_TIMESTAMP)
              ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
              : {}
          }
          className="mx-2 w-fit rounded-2xl px-2 py-px transition-[background_color] duration-200"
          onClick={() => never()}
        >
          NEVER
        </button>
      </span>

      <button
        style={title.length < 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
        disabled={title.length < 1}
        onClick={() => {
          addPool(title, description)
          setCreate(false)
        }}
      >
        Create
      </button>
      {title.length < 1 ? (
        <p className="text-red mt-2 text-center opacity-50">
          Title is required
        </p>
      ) : null}
    </div>
  )
}

export default CreatePool
