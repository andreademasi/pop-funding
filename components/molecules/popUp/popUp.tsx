import React from 'react'

interface PopUpProps {
  children: React.ReactNode
}

const PopUp = ({ children }: PopUpProps) => {
  return (
    <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[#000000de]">
      <div className="relative z-50 flex h-fit max-h-[95%] w-fit flex-col items-center justify-center overflow-x-hidden overflow-y-scroll rounded-2xl bg-purple p-8 ">
        {children}
      </div>
    </div>
  )
}

export default PopUp
