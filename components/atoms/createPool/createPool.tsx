import { addDoc, CollectionReference, DocumentData } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
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

  const check = new Date()

  const addPool = (title: string, description: string) => {
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
  }

  const stringToDate = (date: string) => {
    return new Date(date)
  }

  const dateToString = (date: Date) => {
    const separator = '-'
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hour = date.getHours()
    const minutes = date.getMinutes()

    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${day}T${hour < 10 ? `0${hour}` : `${hour}`}:${
      minutes < 10 ? `0${minutes}` : `${minutes}`
    }`
  }

  const never = () => {
    setEndDate(new Date(MAX_TIMESTAMP))
  }

  const resetEnd = () => {
    const x = new Date()
    x.setHours(x.getHours() + 1)
    setEndDate(x)
  }

  const handleNowClick = () => {
    setStartDate(new Date())
  }

  const handleNeverClick = () => {
    if (endDate >= new Date(MAX_TIMESTAMP)) {
      resetEnd()
    } else {
      never()
    }
  }

  const handleCreateClick = () => {
    if (title.length < 1) {
      alert('Please enter a title')
    } else if (isNaN(startDate.getDate())) alert('Start date is invalid')
    else if (isNaN(endDate.getDate())) alert('End date is invalid')
    else if (startDate.getTime() >= endDate.getTime())
      alert('Invalid date end, you cannot travel back in time')
    else if (
      startDate.toISOString().slice(0, -7) < check.toISOString().slice(0, -7)
    )
      alert('Invalid start date, you cannot create a funding in the past')
    else {
      addPool(title, description)
      setCreate(false)
    }
  }

  useEffect(() => {
    resetEnd()
  }, [])

  const inputClass =
    'rounded-2xl shadow-xl border-brown w-full p-2 m-2 bg-[#0000005e]'

  return (
    <div className="m-100% fixed top-1/2 left-1/2 z-50 flex max-h-full w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-x-hidden rounded-2xl bg-purple p-8 shadow-[0_0px_50px_50rem_#000000b0] md:w-1/2">
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
      <span className="flex w-full flex-col items-center justify-evenly md:flex-row">
        <p>From: </p>
        <span className="mx-2 flex flex-row items-center justify-center">
          <input
            type="datetime-local"
            value={dateToString(startDate)}
            min={dateToString(startDate)}
            className={inputClass + ' w-fit'}
            onChange={(event) => setStartDate(stringToDate(event.target.value))}
            name="start-date"
          />
          <button
            style={
              !isNaN(startDate.getDate()) &&
              startDate.toISOString().slice(0, -7) ==
                new Date().toISOString().slice(0, -7)
                ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                : {}
            }
            className="mx-2 w-fit rounded-2xl px-2 py-px transition-[background_color] duration-200"
            onClick={handleNowClick}
          >
            NOW
          </button>
        </span>
      </span>
      <span className="mt-4 flex w-full flex-col items-center justify-evenly md:flex-row">
        <p className="mr-6">To: </p>
        <span className="mx-2 flex flex-row items-center justify-center">
          <input
            type="datetime-local"
            value={dateToString(endDate)}
            min={dateToString(endDate)}
            className={
              inputClass +
              ' transition-width cubic-bezier-0.165-0.84-0.44-1 w-fit duration-200'
            }
            style={endDate >= new Date(MAX_TIMESTAMP) ? { opacity: 0.5 } : {}}
            disabled={endDate >= new Date(MAX_TIMESTAMP)}
            onChange={(event) => setEndDate(stringToDate(event.target.value))}
            name="end-date"
          />

          <button
            style={
              endDate >= new Date(MAX_TIMESTAMP)
                ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                : {}
            }
            className=" w-fit rounded-2xl px-2 py-px transition-[background_color] duration-200"
            onClick={handleNeverClick}
          >
            NEVER
          </button>
        </span>
      </span>

      <button
        style={title.length < 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
        disabled={title.length < 1}
        onClick={handleCreateClick}
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
