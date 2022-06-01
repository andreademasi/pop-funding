import React from 'react'

interface PopUpProps {
  children: React.ReactNode
}

const PopUp = ({ children }: PopUpProps) => {
  return (
    <div className="m-100% fixed top-1/2 left-1/2 z-50 flex max-h-full w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-x-hidden overflow-y-scroll rounded-2xl bg-purple p-8 shadow-[0_0px_50px_50rem_#000000b0] md:w-fit">
      {children}
    </div>
  )
}

export default PopUp
