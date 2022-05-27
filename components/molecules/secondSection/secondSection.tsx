import React from 'react'
import Card from '../card/card'

const cards = [
  {
    title: 'What is PoP! ?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non imperdiet felis. Praesent eget sapien porta, congue lacus efficitur, blandit nisi. In cursus tincidunt auctor. Vivamus interdum lacus et odio dignissim blandit. Mauris nec quam sit amet magna feugiat ullamcorper ut non tortor. ',
  },
  {
    title: 'Who are we?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non imperdiet felis. Praesent eget sapien porta, congue lacus efficitur, blandit nisi. In cursus tincidunt auctor. Vivamus interdum lacus et odio dignissim blandit. Mauris nec quam sit amet magna feugiat ullamcorper ut non tortor. ',
  },
]

const SecondSection = () => {
  return (
    <div
      id="second"
      className="align-center flex h-full w-full flex-col justify-center pt-8 "
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          shift={index % 2 === 1}
        />
      ))}
    </div>
  )
}

export default SecondSection
