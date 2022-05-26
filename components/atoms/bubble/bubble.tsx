import Image from 'next/image'
import React, { useState } from 'react'
import chain from '../../../public/chain.svg'

interface BubbleProps {
  dimensions?: number
  right?: number
}

const Bubble = ({ dimensions = 200, right = 10 }: BubbleProps) => {
  const [clicked, setClicked] = useState(false)

  const dimPx = dimensions + 'px'
  const rightPc = right + '%'
  const durationS = dimensions * 0.2 + 's'
  const ratio = dimensions / 200

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!clicked) {
      setClicked(true)
      const bubble = e.currentTarget
      //bubble.style.animationPlayState = 'paused'

      setTimeout(() => {
        setClicked(false)
        //bubble.style.animationPlayState = 'running'
      }, 2000)
    }
  }

  return (
    <div
      style={{ opacity: clicked ? 0 : 1 }}
      className="transition-opacity duration-100"
    >
      <div
        onClick={(e) => handleClick(e)}
        style={{
          right: rightPc,
          width: dimPx,
          height: dimPx,
          animationDuration: durationS,
          boxShadow: `inset 0 0 ${ratio * 20}px #fff, inset ${ratio * 10}px 0 ${
            ratio * 46
          }px #e78dd2e5,inset ${ratio * 88}px 0px ${
            ratio * 60
          }px #e78dd2e5, inset -${ratio * 20}px -${ratio * 60}px ${
            ratio * 100
          }px #e78dd2e5,inset 0 ${ratio * 50}px ${
            ratio * 140
          }px #e78dd2e5, 0 0 ${ratio * 90}px #e78dd2e5`,
          transform: clicked ? 'scale(2)' : 'scale(1)',
          opacity: clicked ? 0 : 1,
          zIndex: clicked ? -1 : 0,
        }}
        className={` align-center absolute flex animate-[float_ease-in-out_infinite] justify-center rounded-full bg-radial shadow-radial transition-transform duration-100`}
      >
        <Image
          src={chain}
          width={dimensions * 0.8}
          height={dimensions * 0.8}
          className={'-z-10 opacity-10'}
        />
      </div>
    </div>
  )
}

export default Bubble
