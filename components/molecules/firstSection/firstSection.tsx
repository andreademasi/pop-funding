import React from 'react'
import ArrowDown from '../../atoms/arrowDown/arrowDown'

const FirstSection = () => {
  return (
    <div className="flex h-full w-full flex-col justify-evenly align-middle">
      <div className="flex w-full flex-col items-center justify-center md:flex-row md:justify-around">
        <h1 className="z-10 mt-16 text-left text-smallH1 tracking-wider  md:text-bigH1">
          <span className="flex flex-row font-mont">
            <span className="animate-pop1">P</span>
            <span className="animate-pop2">o</span>
            <span className="animate-pop3">P</span> !
          </span>
          <span className="font-mont">Funding</span>
        </h1>
        <p></p>
      </div>
      <div className="z-20 flex w-full animate-[boing_3s_ease-in-out_infinite] flex-row justify-center align-middle">
        <ArrowDown href="#second" />
      </div>
    </div>
  )
}

export default FirstSection
