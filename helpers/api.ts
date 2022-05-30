import { ErrorResponse } from 'algosdk/dist/types/src/client/v2/algod/models/types'
import { IAssetData } from './types'
import WalletConnect from '@walletconnect/client'
import algosdk from 'algosdk'
import closePoolContract from '../contract/close.teal'
import createPoolContract from '../contract/main.teal'
import { formatJsonRpcRequest } from '@json-rpc-tools/utils'
export enum ChainType {
  MainNet = 'mainnet',
  TestNet = 'testnet',
}

const mainNetClient = new algosdk.Algodv2(
  '',
  'https://mainnet-api.algonode.cloud',
  ''
)
const testNetClient = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  ''
)

function clientForChain(chain: ChainType): algosdk.Algodv2 {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetClient
    case ChainType.TestNet:
      return testNetClient
    default:
      throw new Error(`Unknown chain type: ${chain}`)
  }
}

export const createPool = async (connector: WalletConnect) => {
  const client = clientForChain(ChainType.TestNet)
  const sender = connector.accounts[0]
  let params = await client.getTransactionParams().do()
  const onComplete = algosdk.OnApplicationComplete.NoOpOC
  const contract = await compileProgram(client, createPoolContract)
  const clear = await compileProgram(client, closePoolContract)
  let bd = new Date()
  let ed = new Date(bd.getTime() + 60000) // 1 min
  let cd = new Date(ed.getTime() + 60000) // 1 min
  let appArgs = []
  appArgs.push(algosdk.encodeUint64(bd.getTime()))
  appArgs.push(algosdk.encodeUint64(ed.getTime()))
  appArgs.push(algosdk.encodeUint64(1000000))
  appArgs.push(new Uint8Array(Buffer.from(sender)))
  appArgs.push(algosdk.encodeUint64(cd.getTime()))
  let txn = algosdk.makeApplicationCreateTxn(
    sender,
    params,
    onComplete,
    contract,
    clear,
    1,
    0,
    5,
    3,
    appArgs
  )

  const txns = [txn]
  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64')

    return {
      txn: encodedTxn,
      message: 'Creating contract',
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    }
  })
  const requestParams = [txnsToSign]

  const request = formatJsonRpcRequest('algo_signTxn', requestParams)
  const result: Array<string | null> = await connector.sendCustomRequest(
    request
  )

  const decodedResult = result.map((element) => {
    return element ? new Uint8Array(Buffer.from(element, 'base64')) : null
  })
  // send and await
  await client.sendRawTransaction(decodedResult).do()
  await algosdk.waitForConfirmation(client, txn.txID(), 2)
  let transactionResponse = await client
    .pendingTransactionInformation(txn.txID())
    .do()
  console.log('Called app-id:', transactionResponse['txn']['txn']['apid'])
  if (transactionResponse['global-state-delta'] !== undefined) {
    console.log(
      'Global State updated:',
      transactionResponse['global-state-delta']
    )
  }

  console.log(txn.txID())
}

// helper function to compile program source
async function compileProgram(client: algosdk.Algodv2, programSource: string) {
  let encoder = new TextEncoder()
  let programBytes = encoder.encode(programSource)
  let compileResponse = await client.compile(programBytes).do()
  let compiledBytes = new Uint8Array(
    Buffer.from(compileResponse.result, 'base64')
  )
  return compiledBytes
}

export async function apiGetAccountAssets(
  chain: ChainType,
  address: string
): Promise<IAssetData[]> {
  const client = testNetClient // Test net hardcoded

  const accountInfo = await client
    .accountInformation(address)
    .setIntDecoding(algosdk.IntDecoding.BIGINT)
    .do()

  const algoBalance = accountInfo.amount.toString()
  const assetsFromRes: Array<{
    'asset-id': bigint
    amount: bigint
    'is-frozen': boolean
  }> = accountInfo.assets

  const assets: IAssetData[] = assetsFromRes.map(
    ({ 'asset-id': id, amount, 'is-frozen': frozen }) => ({
      id: Number(id),
      amount: amount.toString(),
      frozen,
      decimals: 0,
      creator: '',
    })
  )

  assets.sort((a, b) => a.id - b.id)

  await Promise.all(
    assets.map((asset, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            const { params } = await client.getAssetByID(asset.id).do()
            asset.name = params.name
            asset.unitName = params['unit-name']
            asset.url = params.url
            asset.decimals = params.decimals
            asset.creator = params.creator
          } catch (error: any) {
            console.error('asset:', asset.id, error.message)
          }
          resolve()
        }, 25 * i)
      })
    })
  )

  assets.unshift({
    id: 0,
    amount: algoBalance,
    creator: '',
    frozen: false,
    decimals: 6,
    name: 'Algo',
    unitName: 'Algo',
  })

  return assets
}

export async function apiGetTxnParams(
  chain: ChainType
): Promise<algosdk.SuggestedParams> {
  const params = await clientForChain(chain).getTransactionParams().do()
  return params
}

export async function apiSubmitTransactions(
  chain: ChainType,
  stxns: Uint8Array[]
): Promise<number> {
  const { txId } = await clientForChain(chain).sendRawTransaction(stxns).do()
  return await waitForTransaction(chain, txId)
}

async function waitForTransaction(
  chain: ChainType,
  txId: string
): Promise<number> {
  const client = clientForChain(chain)

  let lastStatus = await client.status().do()
  let lastRound = lastStatus['last-round']
  while (true) {
    const status = await client.pendingTransactionInformation(txId).do()
    if (status['pool-error']) {
      throw new Error(`Transaction Pool Error: ${status['pool-error']}`)
    }
    if (status['confirmed-round']) {
      return status['confirmed-round']
    }
    lastStatus = await client.statusAfterBlock(lastRound + 1).do()
    lastRound = lastStatus['last-round']
  }
}
