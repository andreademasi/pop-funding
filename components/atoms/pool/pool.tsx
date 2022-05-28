import React from 'react'

interface PoolProps {
  title: string
  description: string
  date: number
}

const dateConverter = (date: number) => {
  const x = new Date(date)
  const y = x.toLocaleDateString()
  return y
}

const Pool = ({ title, description, date }: PoolProps) => {
  return (
    <div className="m-4 h-fit flex-[1_1_200px] rounded-2xl border-2 border-brown transition-transform hover:scale-105">
      <p className="relative top-1 left-2 w-fit text-sm opacity-70">
        {dateConverter(date)}
      </p>
      <h3 className="my-2 mx-4 text-lg font-bold tracking-wider">{title}</h3>
      <p className="mx-6 mb-4 font-thin opacity-90">{description}</p>
      <button className="transition-scale mx-3 my-4 rounded-2xl border-2 border-brown px-6 py-px text-brown duration-100 hover:scale-105">
        More info
      </button>
      <button className="transition-scale mx-3 my-4 rounded-2xl border-2 border-brown px-6 py-px text-brown duration-100 hover:scale-105">
        Contribute
      </button>
    </div>
  )
}

export default Pool
