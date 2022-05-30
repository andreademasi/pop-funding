import React from 'react'
import { useInView } from 'react-intersection-observer'
import Highlight from '../../atoms/highlight/highlight'
import styles from './card.module.css'

interface CardProps {
  title: string
  description: string
  shift?: boolean
}

const Card = ({ title, description, shift = false }: CardProps) => {
  const [ref, inView, _entry] = useInView({
    threshold: 0,
    fallbackInView: true,
    rootMargin: '-10px 0px -10px 0px',
  })

  const properties = {
    opacity: inView ? 1 : 0,
    transform: inView
      ? 'translateX(0)'
      : shift
      ? 'translateX(-70%)'
      : 'translateX(70%)',
    transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
  } as React.CSSProperties

  return (
    <span className={shift ? styles.cardLeft : styles.cardRight}>
      <div
        ref={ref}
        style={properties}
        className={
          ' mx-6 mb-[10%]  flex h-fit flex-col items-center justify-center rounded-2xl bg-opacity-10 bg-gradient-to-tl from-transparentPurple via-transparentDarkBlue to-transparentPink align-middle shadow-lg md:self-center '
        }
      >
        <h2 className="relative mx-8 mb-4 mt-8 text-smallH2 font-bold text-brown md:text-bigH2">
          <Highlight>{title}</Highlight>
        </h2>

        <p className=" mt-4 mb-10 w-[80%] px-8">{description}</p>
      </div>
    </span>
  )
}

export default Card
