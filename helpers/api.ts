import { IAssetData, IndexerResponse } from './types'
import algosdk, { createDryrun } from 'algosdk'

import WalletConnect from '@walletconnect/client'
import closePoolContract from '../contract/close.teal'
import createPoolContract from '../contract/main.teal'
import { formatJsonRpcRequest } from '@json-rpc-tools/utils'

export enum ChainType {
  MainNet = 'mainnet',
  TestNet = 'testnet',
  DevNet = 'devnet',
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

const devNetClient = new algosdk.Algodv2(
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'http://localhost',
  '4001'
)

function clientForChain(chain: ChainType): algosdk.Algodv2 {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetClient
    case ChainType.TestNet:
      return testNetClient
    case ChainType.DevNet:
      return devNetClient
    default:
      throw new Error(`Unknown chain type: ${chain}`)
  }
}
const client = clientForChain(ChainType.TestNet)
const indexer =
  client === devNetClient
    ? new algosdk.Indexer('', 'http://localhost', 8980)
    : new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '')

export const createPool = async (
  connector: WalletConnect,
  bd: Date = new Date(),
  ed: Date = new Date(bd.getTime() + 30000),
  cd: Date = new Date(ed.getTime() + 30000),
  goal: number = 1
) => {
  const sender =
    client === devNetClient
      ? 'BQGP3DFDUD2I7K2BP2J4RHELTC3ZMAIPX7W3S742GT4USEQPVRKSP7NQOE'
      : connector.accounts[0]

  const params = await client.getTransactionParams().do()
  const onComplete = algosdk.OnApplicationComplete.NoOpOC
  const contract = await compileProgram(client, createPoolContract)
  const clear = await compileProgram(client, closePoolContract)
  let appArgs = []
  appArgs.push(algosdk.encodeUint64(Math.floor(bd.getTime() / 1000)))
  appArgs.push(algosdk.encodeUint64(Math.floor(ed.getTime() / 1000)))
  appArgs.push(algosdk.encodeUint64(goal * 1000000))
  appArgs.push(algosdk.decodeAddress(sender).publicKey)
  appArgs.push(algosdk.encodeUint64(Math.floor(cd.getTime() / 1000)))
  const txn = algosdk.makeApplicationCreateTxn(
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
  console.log('Creating')
  const transactionResponse = await sendCustomSignedTxns(txns, connector)

  const id = transactionResponse['application-index'] as number

  console.log(id)
  const app_address = algosdk.getApplicationAddress(id)
  console.log('app address', app_address)
  if (transactionResponse['global-state-delta'] !== undefined) {
    console.log(
      'Global State updated:',
      transactionResponse['global-state-delta']
    )
  }

  console.log(txn.txID())
  return { appId: id, appAddress: app_address }
}

export const test = async (connector: WalletConnect) => {
  const sender =
    client === devNetClient
      ? 'BQGP3DFDUD2I7K2BP2J4RHELTC3ZMAIPX7W3S742GT4USEQPVRKSP7NQOE'
      : connector.accounts[0]

  const { appId, appAddress } = await createPool(connector)
  await optIn(sender, appId, connector)
  console.log('Donating')
  await donate(appId, appAddress, connector)
  setTimeout(async () => {
    console.log('Claiming')
    await claim(sender, appId, connector)
  }, 30000)
}

export const donate = async (
  app_id: number,
  app_address: string,
  connector: WalletConnect,
  amount: number = 1
) => {
  console.log('Donating')
  const params = await client.getTransactionParams().do()
  const onComplete = algosdk.OnApplicationComplete.NoOpOC
  const sender =
    client === devNetClient
      ? 'BQGP3DFDUD2I7K2BP2J4RHELTC3ZMAIPX7W3S742GT4USEQPVRKSP7NQOE'
      : connector.accounts[0]
  let appArgs = []
  appArgs.push(new Uint8Array(Buffer.from('donate')))
  const txn_call = algosdk.makeApplicationCallTxnFromObject({
    from: sender,
    appIndex: app_id,
    appArgs: appArgs,
    suggestedParams: params,
    onComplete: onComplete,
  })
  const txn_donate = algosdk.makePaymentTxnWithSuggestedParams(
    sender,
    app_address,
    amount * 1000000,
    undefined,
    undefined,
    params
  )
  const txns = [txn_call, txn_donate]
  const txgroup = algosdk.assignGroupID(txns)
  console.log(await sendCustomSignedTxns(txgroup, connector))
}

const sendDevSignedTxns = async (txns: algosdk.Transaction[]) => {
  const mn =
    'short choose mystery replace luggage crouch myth matrix unique real funny strike board guard tiger eager flip recipe tag submit student enter document about skin'

  const signedTxns = txns.map((txn) => {
    return txn.signTxn(algosdk.mnemonicToSecretKey(mn).sk)
  })

  const decodedsignedtxn = signedTxns.map((txn) =>
    algosdk.decodeSignedTransaction(txn)
  )

  await dumpTxnToConsole(decodedsignedtxn)

  const tx = await client.sendRawTransaction(signedTxns).do()
  await algosdk.waitForConfirmation(client, tx.txId, 4)
  return await client.pendingTransactionInformation(tx.txId).do()
}

const sendCustomSignedTxns = async (
  txns: algosdk.Transaction[],
  connector: WalletConnect
) => {
  if (client === devNetClient) return await sendDevSignedTxns(txns)
  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64')

    return {
      txn: encodedTxn,
      message: 'Creating contract',
    }
  })
  const requestParams = [txnsToSign]

  const request = formatJsonRpcRequest('algo_signTxn', requestParams)
  const result = await connector.sendCustomRequest(request)

  const decodedResult = result.map(
    (
      element:
        | WithImplicitCoercion<string>
        | { [Symbol.toPrimitive](hint: 'string'): string }
    ) => {
      return element ? new Uint8Array(Buffer.from(element, 'base64')) : null
    }
  )

  await dumpTxnToConsole(decodedResult)

  const tx = await client.sendRawTransaction(decodedResult).do()
  await algosdk.waitForConfirmation(client, tx.txId, 2)
  return await client.pendingTransactionInformation(tx.txId).do()
}

const isSignedTxns = (
  txns: Array<Uint8Array | algosdk.SignedTransaction>
): txns is algosdk.SignedTransaction[] => {
  return (txns[0] as algosdk.SignedTransaction).txn !== undefined
}

async function dumpTxnToConsole(
  txns: Array<Uint8Array | algosdk.SignedTransaction>
) {
  let decodedTxn
  if (isSignedTxns(txns)) decodedTxn = txns
  else
    decodedTxn = txns.map((t) => {
      return algosdk.decodeSignedTransaction(t as Uint8Array)
    })

  const dump = await createDryrun({
    client,
    txns: decodedTxn,
    latestTimestamp: Math.floor(new Date().getTime() / 1000),
    round: 12,
  })
  console.log(JSON.stringify(dump.get_obj_for_encoding()))
}

export async function optIn(
  sender: string,
  appId: number,
  connector: WalletConnect
) {
  const params = await client.getTransactionParams().do()
  const app_optin = algosdk.makeApplicationOptInTxn(sender, params, appId)
  console.log('Opting in')
  await sendCustomSignedTxns([app_optin], connector)
}

async function claim(sender: string, id: number, connector: WalletConnect) {
  console.log('claiming')
  const params = await client.getTransactionParams().do()
  const onComplete = algosdk.OnApplicationComplete.NoOpOC

  let appArgs = []
  appArgs.push(new Uint8Array(Buffer.from('claim')))
  const txn = algosdk.makeApplicationCallTxnFromObject({
    from: sender,
    appIndex: id,
    appArgs: appArgs,
    suggestedParams: params,
    onComplete: onComplete,
  })
  console.log(await sendCustomSignedTxns([txn], connector))
}

export const isOptedIn = async (
  address: string = 'BQGP3DFDUD2I7K2BP2J4RHELTC3ZMAIPX7W3S742GT4USEQPVRKSP7NQOE',
  id: number
) => {
  const accountInfo = (await indexer.lookupAccountByID(address).do())
    .account as IndexerResponse
  return accountInfo['apps-local-state'].find((app) => app.id === id) ?? false
}

// helper function to compile program source
async function compileProgram(client: algosdk.Algodv2, programSource: string) {
  const encoder = new TextEncoder()
  const programBytes = encoder.encode(programSource)
  const compileResponse = await client.compile(programBytes).do()
  const compiledBytes = new Uint8Array(
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
