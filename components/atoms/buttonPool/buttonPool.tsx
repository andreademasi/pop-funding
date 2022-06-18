import React from 'react'

interface ButtonPoolProps {
  text: string
  handleClick: () => void
}

const ButtonPool = ({ text, handleClick }: ButtonPoolProps) => {
  return (
    <button
      // style={
      //   checkStatus() == status.active
      //     ? { opacity: 1 }
      //     : { opacity: 0.5 }
      // }
      className="transition-scale mx-4 w-fit rounded-2xl bg-brown px-4 py-px text-center text-purple duration-100 hover:scale-105"
      onClick={handleClick}
    >
      {text}
    </button>
  )
}

export default ButtonPool
