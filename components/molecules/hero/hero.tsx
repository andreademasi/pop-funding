import React from 'react'
import Bubbles from '../bubbles/bubbles'
import FirstSection from '../firstSection/firstSection'
import NavBar from '../navBar/navBar'
import SecondSection from '../secondSection/secondSection'

const Hero = () => {
  return (
    <>
      <main className="flex w-full flex-1 flex-col items-center justify-center overflow-x-hidden px-2 text-center text-brown">
        <div className=" h-[100vh] w-full">
          <NavBar />
          <FirstSection />
        </div>
        <SecondSection />
        <Bubbles />
      </main>
    </>
  )
}

export default Hero
