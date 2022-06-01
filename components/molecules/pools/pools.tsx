import { ItemPool } from '../fundingsHero/fundingsHero'
import Pool from '../../atoms/pool/pool'
import React from 'react'
import { iteratorSymbol } from 'immer/dist/internal'

interface PoolsProps {
  poolsArray: Array<ItemPool>
  type: string
  showPopUp: () => void
}

const Pools = ({ poolsArray, type, showPopUp }: PoolsProps) => {
  return (
    <div className="mx-4 flex flex-col justify-center align-middle">
      <div className="flex w-full flex-row flex-wrap justify-center align-middle">
        {poolsArray.length > 0 ? (
          poolsArray
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
                  appAddress={item.appAddress}
                  appId={item.appId}
                  key={index}
                  showPopUp={showPopUp}
                />
              )
            })
        ) : (
          <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center text-lg shadow-2xl">
            There are no {type} pools
          </p>
        )}
      </div>
    </div>
  )
}

export default Pools
