import React from 'react'

interface NavBarProps {
  items: Array<{
    name: string
    link: string
  }>
}

const NavBar = ({ items }: NavBarProps) => {
  return (
    <nav className="align-center my-5 flex w-full flex-row justify-evenly  ">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="after:content-[' '] z-10 flex flex-col text-smallA after:h-px after:w-0 after:self-center after:bg-brown after:transition-all after:duration-300 after:hover:w-full md:text-bigA"
        >
          {item.name}
        </a>
      ))}
    </nav>
  )
}

export default NavBar
