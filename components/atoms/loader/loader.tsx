import React from 'react'

interface LoaderProps {
  stroke?: string
  width?: number
  height?: number
}

const Loader = ({ stroke = 'brown', width = 25, height = 25 }: LoaderProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke={stroke == 'purple' ? '#3b2d60' : '#dfb59c'}
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  )
}

export default Loader
