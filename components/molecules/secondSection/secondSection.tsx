import React from 'react'
import Card from '../card/card'

const cards = [
  {
    title: 'What is PoP! ?',
    description:
      'PoP! is a crowfunding platform based on Algorand blockchain that allows you to create and manage your own crowdfunding campaigns. Everyone with a wallet can create a campaign and start collecting funds from people. You can also reclaim your donations if the funding does not reach the goal.',
  },
  {
    title: 'Who are we?',
    description: `We are three students of the Polytechnic of Turin fascinated by the world of blockchains. 
      We are Andrea De Masi, Enrico Milazzo and Michele Pulvirenti.`,
  },
  {
    title: 'Why this project?',
    description: `This is the Project Work proposed by Algorand to the attendees of MasterZ 2nd Edition`,
  },
]

const SecondSection = () => {
  return (
    <div
      id="second"
      className="flex h-full w-full flex-col justify-center pt-8 align-middle "
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
