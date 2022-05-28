import React from 'react'
import Link from 'next/link'

const items = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Fundings',
    link: '/fundings',
  },
  {
    name: 'Connect',
    link: '/connect',
  },
]

const NavBar = () => {
  return (
    <nav className="absolute top-0 my-5 flex w-full flex-row justify-evenly align-middle  ">
      {items.map((item, index) => (
        <span
          key={index}
          className="after:content-[' '] z-10 flex flex-col text-smallA after:h-px after:w-0 after:self-center after:bg-brown after:transition-all after:duration-300 after:hover:w-full md:text-bigA"
        >
          <Link href={item.link}>{item.name}</Link>
        </span>
      ))}
    </nav>
  )
}

export default NavBar
