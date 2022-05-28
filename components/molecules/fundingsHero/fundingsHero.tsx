import React from 'react'
import Pools from '../pools/pools'

const FundingsHero = () => {
  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="z-10 my-40 flex flex-row justify-center text-left align-middle">
        <h1 className=" text-center font-mont text-smallH1 tracking-wider text-brown md:flex-row md:text-bigH1">
          Explore or{' '}
          <span
            className="transition-decoration cursor-pointer leading-3 underline decoration-solid decoration-2 underline-offset-8"
            onClick={() => {}}
          >
            create
          </span>{' '}
          fundings
        </h1>
      </div>
      <Pools />
    </div>
  )
}

export default FundingsHero
