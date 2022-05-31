import React from 'react'

interface PoolProps {
  title: string
  description: string
  dateStart: number
  dateEnd: number
}

const dateConverter = (date: number) => {
  const x = new Date(date)
  const y = x.toString().split('GMT')[0].slice(4)
  return y == 'lid Date' ? x.toString() : y
}

const Pool = ({ title, description, dateStart, dateEnd }: PoolProps) => {
  return (
    <div className="m-4 flex h-fit flex-[1_1_280px] flex-col justify-center rounded-2xl bg-opacity-10 bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink align-middle shadow-lg transition-transform hover:scale-[1.01]">
      <p className="relative top-2 left-2 w-fit rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
        From: {dateConverter(dateStart)}
      </p>
      <p className="relative top-2 left-2 w-fit rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
        To: {dateConverter(dateEnd)}
      </p>
      <h3 className="my-4 mx-4 text-xl font-bold tracking-wider">{title}</h3>
      <p className="mx-6 mt-4 mb-8 max-h-[10em] overflow-y-scroll whitespace-pre-wrap px-2 font-thin opacity-90">
        {description}
      </p>
      <button className="transition-scale mx-auto mb-4 w-fit rounded-2xl border-2 border-brown px-4  py-px text-center text-brown duration-100 hover:scale-105">
        Info
      </button>
      <button className="transition-scale mx-auto mb-4 w-fit rounded-2xl border-2 border-brown px-4  py-px text-center text-brown duration-100 hover:scale-105">
        Contribute
      </button>
    </div>
  )
}

export default Pool
