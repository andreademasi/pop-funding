import React from 'react'

interface HighlightProps {
  children: React.ReactNode
}

const Highlight = ({ children }: HighlightProps) => {
  //ATTENTION! The parent element must have 'relative' property
  return (
    <span
      className={
        'before:border-transparentBlue before:absolute before:left-[-0.1em] before:top-[0.12em] before:z-[-1] before:h-[1.5em] before:w-full before:rotate-2 before:rounded-[50%] before:border-2 before:border-solid before:border-r-transparent before:p-[0.1em_0.25em] before:opacity-70 ' +
        'after:border-transparentBlue after:absolute after:left-[-0.1em] after:top-[0.3em] after:z-[-1] after:h-[1.5em] after:w-full after:-rotate-1 after:rounded-[50%] after:border-2 after:border-solid after:border-t-transparent after:border-l-transparent after:p-[0.1em_0.25em] after:opacity-70'
      }
    >
      {children}
    </span>
  )
}

export default Highlight
