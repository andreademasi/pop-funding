import React from 'react'
import ArrowDown from '../../atoms/arrowDown/arrowDown'

const FirstSection = () => {
  return (
    <div className="flex h-full w-full flex-col justify-evenly align-middle">
      <div className="flex w-full flex-col items-center justify-center md:flex-row md:justify-around">
        <div className="z-10 mt-8 text-left text-smallH1 tracking-wider  md:text-bigH1">
          <span className="flex flex-row font-mont">
            <h1 className="animate-pop1">P</h1>
            <h1 className="animate-pop2">o</h1>
            <h1 className="animate-pop3">P</h1> <h1>!</h1>
          </span>
          <h1 className="font-mont">Crowdfunding</h1>
          <div className="mt-8 flex w-full flex-row justify-center align-middle text-smallButton font-bold md:text-bigButton">
            <button className="transition-scale mx-3 rounded-2xl border-2 border-brown px-6 py-px text-brown duration-100 hover:scale-105">
              Sign In
            </button>
            <button className="transition-scale mx-3 rounded-2xl bg-brown px-6 py-px text-purple duration-100 hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>
        <p></p>
      </div>
      <div className="mb-4 flex w-full animate-[boing_3s_ease-in-out_infinite] flex-row justify-center align-middle">
        <ArrowDown href="#second" />
      </div>
    </div>
  )
}

export default FirstSection
