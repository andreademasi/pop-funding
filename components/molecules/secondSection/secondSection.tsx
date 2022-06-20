import React from 'react'
import Card from '../card/card'

const algorand = `<a href="https://www.algorand.com/" rel="noopener noreferrer" target="_blank">Algorand</a>`

const masterZ = `<a href="https://www.masterzblockchain.com/" rel="noopener noreferrer" target="_blank">MasterZ</a>`

const cards = [
  {
    title: 'What is PoP! ?',
    description: `PoP! is a crowdfunding platform based on ${algorand} blockchain that allows you to create and manage your own crowdfunding campaigns.<br/><br/>
       Everyone with a wallet can create a campaign and start collecting funds from people.<br/><br/>
        You can also reclaim your donations if the funding does not reach the goal.`,
  },
  {
    title: 'Who are we?',
    description: `We are three students of the Polytechnic of Turin fascinated by the world of blockchains. <br/><br/>
      We are Andrea De Masi, Enrico Milazzo and Michele Pulvirenti.`,
  },
  {
    title: 'Why this project?',
    description: `This is the Project Work proposed by ${algorand} to the attendees of ${masterZ} 2nd Edition.<br/><br/>
    Doing this Project Work we had the opportunity to test and improve our knowledge of the ${algorand} blockchain and to learn how to use it in the development of a crowdfunding platform.`,
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
