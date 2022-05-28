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
    <div className="m-4 flex h-fit flex-[1_1_200px] flex-col justify-center rounded-2xl border-brown bg-opacity-10 bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink align-middle shadow-lg transition-transform hover:scale-[1.01]">
      <p className="relative top-1 left-2 w-fit rounded-2xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
        {dateConverter(date)}
      </p>
      <h3 className="my-2 mx-4 text-xl font-bold tracking-wider">{title}</h3>
      <p className="mx-6 mt-4 mb-8 max-h-[10em] overflow-y-scroll whitespace-pre-wrap px-2 font-thin opacity-90">
        {description}
      </p>
      <button className="transition-scale mx-[20%] mb-4 rounded-2xl border-2 border-brown  py-px text-center text-brown duration-100 hover:scale-105">
        Info
      </button>
      <button className="transition-scale mx-[20%] mb-4 rounded-2xl border-2 border-brown  py-px text-center text-brown duration-100 hover:scale-105">
        Contribute
      </button>
    </div>
  )
}

export default Pool
