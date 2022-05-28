import React from 'react'
import { useInView } from 'react-intersection-observer'
import Highlight from '../../atoms/highlight/highlight'
import styles from './card.module.scss'

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
    alignSelf: shift ? 'flex-end' : 'flex-start',
  } as React.CSSProperties

  return (
    <div
      ref={ref}
      style={properties}
      className={
        ' mx-6 mb-[10%]  flex h-fit w-[90%] flex-col items-center justify-center rounded-2xl border-brown bg-gradient-to-t from-transparentBrown to-transparent shadow-lg shadow-[#0000002e] md:w-[50%] md:self-center '
      }
    >
      <h2 className="relative my-4 mx-8 text-smallH2 font-bold text-brown md:text-bigH2">
        <Highlight>{title}</Highlight>
      </h2>

      <p className=" mt-4 mb-10 w-[80%] px-8">{description}</p>
    </div>
  )
}

export default Card
/*
.sketch:after{
  content:"";
  z-index:-1;
  left:-0.5em;
  top:0.1em;
  padding:0.1em 0.25em;
  border-width:2px;
  border-style:solid;
  border-color:#ef8c22;
  border-left-color:transparent;
  border-top-color:transparent;
  position:absolute;
  width:100%;
  height:1em;
  transform:rotate(-1deg);
  opacity:0.7;
  border-radius:50%;
}
*/
