import React from 'react'

import Pool from '../../atoms/pool/pool'
import { ItemPool } from '../fundingsHero/fundingsHero'

interface PoolsProps {
  poolsArray: Array<ItemPool>
}

const Pools = ({ poolsArray }: PoolsProps) => {
  return (
    <div className="mx-4 flex flex-col justify-center align-middle">
      <div className="flex w-full flex-row flex-wrap justify-center align-middle">
        {poolsArray
          .sort((a, b) => {
            return a.dateStart - b.dateStart
          })
          .map((item, index) => {
            return (
              <Pool
                title={item.title}
                description={item.description}
                dateStart={item.dateStart}
                dateEnd={item.dateEnd}
                dateClose={item.dateClose}
                goal={item.goal}
                current={item.current}
                key={index}
              />
            )
          })}
      </div>
    </div>
  )
}

export default Pools
