import { CollectionReference, DocumentData, addDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { ConnectContext } from '../../../store/connector'
import PopUp from '../../molecules/popUp/popUp'
import { createPool } from '../../../helpers/api'

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
  const [closeDate, setCloseDate] = useState<Date>(new Date())
  const [goal, setGoal] = useState<number>(0)

  const check = new Date()
  const connector = useContext(ConnectContext)

  const addPool = (
    title: string,
    description: string,
    appId: number,
    appAddress: string
  ) => {
    addDoc(dbInstance, {
      title: title,
      description: description,
      dateStart: Date.parse(startDate.toString()),
      dateEnd: Date.parse(endDate.toString()),
      dateClose: Date.parse(closeDate.toString()),
      goal: goal,
      current: 0,
      appId: appId,
      appAddress: appAddress,
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
    }${separator}${day < 10 ? `0${day}` : `${day}`}T${
      hour < 10 ? `0${hour}` : `${hour}`
    }:${minutes < 10 ? `0${minutes}` : `${minutes}`}`
  }

  const resetEnd = () => {
    const x = new Date()
    const y = new Date()
    x.setHours(x.getHours() + 1)
    setEndDate(x)
    y.setHours(y.getHours() + 2)
    setCloseDate(y)
  }

  const handleNowClick = () => {
    setStartDate(new Date())
  }

  const handleCreateClick = () => {
    if (title.length < 1) {
      alert('Please enter a title')
    } else if (description.length < 1) {
      alert('Please enter a description')
    } else if (isNaN(startDate.getDate())) alert('Start date is invalid')
    else if (isNaN(endDate.getDate())) alert('End date is invalid')
    else if (isNaN(closeDate.getDate())) alert('Close date is invalid')
    else if (startDate.getTime() >= endDate.getTime())
      alert('Invalid date end, you cannot travel back in time')
    else if (
      startDate.toISOString().slice(0, -7) < check.toISOString().slice(0, -7)
    )
      alert('Invalid start date, you cannot create a funding in the past')
    else if (
      endDate.toISOString().slice(0, -7) > closeDate.toISOString().slice(0, -7)
    )
      alert('Invalid close date, you cannot close a funding before its end')
    else if (goal == 0 || isNaN(goal)) alert('Please enter a goal')
    else {
      createPool(connector, startDate, endDate, closeDate, goal).then(
        ({ appId, appAddress }) => {
          addPool(title, description, appId, appAddress)
          setCreate(false)
        }
      )
    }
  }

  const notGoodFields = () => {
    if (
      title.length < 1 ||
      description.length < 1 ||
      isNaN(startDate.getDate()) ||
      isNaN(endDate.getDate()) ||
      startDate.getTime() >= endDate.getTime() ||
      startDate.toISOString().slice(0, -7) < check.toISOString().slice(0, -7) ||
      endDate.toISOString().slice(0, -7) >
        closeDate.toISOString().slice(0, -7) ||
      goal == 0 ||
      isNaN(goal)
    ) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    resetEnd()
  }, [])

  const inputClass =
    'rounded-2xl shadow-xl border-brown w-full p-2 m-2 bg-[#0000005e]'

  return (
    <PopUp>
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
      <h2 className="mb-4 mt-16 text-center text-xl font-bold tracking-wider md:mt-4">
        Create a new pool
      </h2>
      <input
        type={'text'}
        className={inputClass}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        value={title}
      />
      <textarea
        className={inputClass + ' min-h-[100px]  '}
        rows={5}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        value={description}
      />
      <div className="flex flex-col items-center justify-center md:flex-row">
        <span className="relative flex w-full flex-col items-center justify-evenly ">
          <p className="relative top-0 left-[20px] mr-auto">Start date: </p>
          <button
            style={
              !isNaN(startDate.getDate()) &&
              startDate.toISOString().slice(0, -7) ==
                new Date().toISOString().slice(0, -7)
                ? { backgroundColor: '#dfb59c', color: '#3b2d60' }
                : {}
            }
            className="absolute top-[2px] right-[20px] mx-2 ml-0 w-fit rounded-2xl border-2 border-brown px-2 py-px text-xs transition-[background_color] duration-200 md:top-0 md:text-[0.95rem]"
            onClick={handleNowClick}
          >
            NOW
          </button>
          <span className="mx-2 flex flex-row items-center justify-center">
            <input
              type="datetime-local"
              value={dateToString(startDate)}
              min={dateToString(startDate)}
              className={inputClass + ' w-fit'}
              onChange={(event) =>
                setStartDate(stringToDate(event.target.value))
              }
              name="start-date"
            />
          </span>
        </span>
        <span className="mt-4 flex w-full flex-col items-center justify-evenly md:mt-0">
          <p className="relative left-[20px] mr-auto">End date: </p>
          <span className="mx-2 mr-auto flex flex-row items-center justify-center">
            <input
              type="datetime-local"
              value={dateToString(endDate)}
              min={dateToString(endDate)}
              className={inputClass + ' w-fit '}
              onChange={(event) => setEndDate(stringToDate(event.target.value))}
              name="end-date"
            />
          </span>
        </span>
        <span className="mt-4 flex w-full flex-col items-center justify-evenly md:mt-0">
          <p className="relative left-[20px] mr-auto">Close date: </p>
          <span className="mx-2 mr-auto flex flex-row items-center justify-center">
            <input
              type="datetime-local"
              value={dateToString(closeDate)}
              min={dateToString(closeDate)}
              className={inputClass + ' w-fit '}
              onChange={(event) =>
                setCloseDate(stringToDate(event.target.value))
              }
              name="close-date"
            />
          </span>
        </span>
      </div>
      <span className="mt-4 flex flex-col items-center justify-center md:flex-row ">
        <p className="relative top-0 left-[5px] mr-auto md:mr-2">Goal: </p>
        <span className="relative flex items-center justify-center">
          <input
            type="number"
            step={10}
            className={inputClass + ' w-full '}
            onChange={(e) => setGoal(parseFloat(e.target.value))}
            value={goal}
          />
          <p className="absolute right-8 top-4 opacity-50 ">Algo</p>
        </span>
      </span>
      <button
        style={notGoodFields() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        className="mx-auto mt-4 rounded-2xl bg-brown px-4 py-2 text-purple transition-transform hover:scale-105 md:w-1/2"
        onClick={handleCreateClick}
      >
        Create
      </button>
      <p className="text-red mt-2 text-center opacity-50">
        All fields are required
      </p>
    </PopUp>
  )
}

export default CreatePool
