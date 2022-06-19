import { ItemPool } from '../fundingsHero/fundingsHero'
import Pool from '../pool/pool'
import React from 'react'
interface PoolsProps {
  poolsArray: Array<ItemPool>
  type: string
  status: number
  getPools: () => void
  showPopUp: (children?: React.ReactNode) => void
}

const Pools = ({
  poolsArray,
  type,
  showPopUp,
  getPools,
  status,
}: PoolsProps) => {
  return (
    <div className="mx-4 flex w-[90%] flex-col justify-center align-middle">
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
                  firestoreId={item.firestoreId}
                  showPopUp={showPopUp}
                  getPools={getPools}
                  creator={item.creator}
                  claimed={item.claimed}
                  stat={status}
                />
              )
            })
        ) : (
          <p className="mx-auto mb-16 w-fit rounded-2xl border-2 border-brown px-8 py-4 text-center text-lg shadow-2xl">
            There are no {type} fundings
          </p>
        )}
      </div>
    </div>
  )
}

export default Pools
