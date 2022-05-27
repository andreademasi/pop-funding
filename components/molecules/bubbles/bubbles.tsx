import React from 'react'
import Bubble from '../../atoms/bubble/bubble'

const Bubbles = () => {
  return (
    <>
      <div className=" hidden w-full overflow-hidden opacity-80 md:block">
        <Bubble right={20} dimensions={150} />
        <Bubble right={5} dimensions={100} />
        <Bubble right={12} dimensions={50} />
        <Bubble right={14} dimensions={120} />
      </div>
      <div className=" w-full overflow-hidden opacity-80 md:hidden">
        <Bubble right={20} dimensions={120} />
        <Bubble right={80} dimensions={70} />
        <Bubble right={24} dimensions={50} />
        <Bubble right={60} dimensions={90} />
      </div>
    </>
  )
}

export default Bubbles
