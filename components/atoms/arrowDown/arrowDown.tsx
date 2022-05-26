import React from 'react'

interface ArrowDownProps {
  href?: string
}

const ArrowDown = ({ href = '' }) => {
  return (
    <a
      href={href}
      className="transition-border my-4 h-[10vw] w-[10vw] rotate-45 rounded-tl-full border-b-2 border-r-2 border-brown duration-100 hover:border-b-4 hover:border-r-4 md:h-[5vw] md:w-[5vw]"
    ></a>
  )
}

export default ArrowDown
