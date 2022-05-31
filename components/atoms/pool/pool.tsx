import React from 'react'
import { useInView } from 'react-intersection-observer'
import { MAX_TIMESTAMP } from '../../../utilities/constants/maxTimestamp'

interface PoolProps {
  title: string
  description: string
  dateStart: number
  dateEnd: number
}

const Pool = ({ title, description, dateStart, dateEnd }: PoolProps) => {
  const [ref, inView, _entry] = useInView({
    threshold: 0,
    fallbackInView: true,
    rootMargin: '-10% 0px -10% 0px',
  })

  const isAvaiable = () => {
    const x = new Date()
    const start = new Date(dateStart)
    const end = new Date(dateEnd)
    if (x > start && x < end) {
      return true
    }
    return false
  }

  const dateConverter = (date: number) => {
    const x = new Date(date)
    const y =
      x >= new Date(MAX_TIMESTAMP)
        ? 'No end date'
        : x.toString().split('GMT')[0].slice(4)
    return y == 'lid Date' ? 'Invalid date' : y
  }

  return (
    <div
      ref={ref}
      style={
        inView
          ? { opacity: 1 }
          : { opacity: 0, transform: 'scale(0.7) rotate(4deg)' }
      }
      className="relative m-4 flex h-fit flex-[1_1_280px] flex-col justify-center rounded-2xl bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink pb-16 align-middle shadow-lg transition-[transform_opacity] duration-200 hover:scale-[1.01]"
    >
      <p className="relative top-2 left-2 mb-2 w-fit rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
        From: {dateConverter(dateStart)}
      </p>
      <p className="absolute bottom-2 right-2  w-fit rounded-xl bg-transparentWhite px-2 py-1 text-sm opacity-70">
        To: {dateConverter(dateEnd)}
      </p>
      <h3 className="my-4 mx-4 text-xl font-bold tracking-wider">{title}</h3>
      <p className="mx-6 mt-4 mb-8 max-h-[10em] overflow-y-scroll whitespace-pre-wrap px-2 font-thin opacity-90">
        {description}
      </p>
      <button className="transition-scale mx-auto mb-4 w-fit rounded-2xl border-2 border-brown px-4  py-px text-center text-brown duration-100 hover:scale-105">
        Info
      </button>
      {isAvaiable() ? (
        <button
          disabled={!isAvaiable()}
          style={isAvaiable() ? { opacity: 1 } : { opacity: 0.5 }}
          className="transition-scale mx-auto w-fit rounded-2xl border-2 border-brown px-4  py-px text-center text-brown duration-100 hover:scale-105"
        >
          Contribute
        </button>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Pool
