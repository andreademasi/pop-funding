export interface IAssetData {
  id: number
  amount: bigint | string
  creator: string
  frozen: boolean
  decimals: number
  name?: string
  unitName?: string
  url?: string
}

export interface IChainData {
  name: string
  short_name: string
  chain: string
  network: string
  chain_id: number
  network_id: number
  rpc_url: string
  native_currency: IAssetData
}
export interface ITxData {
  from: string
  to: string
  nonce: string
  gasPrice: string
  gasLimit: string
  value: string
  data: string
}

export interface IBlockScoutTx {
  value: string
  txreceipt_status: string
  transactionIndex: string
  to: string
  timeStamp: string
  nonce: string
  isError: string
  input: string
  hash: string
  gasUsed: string
  gasPrice: string
  gas: string
  from: string
  cumulativeGasUsed: string
  contractAddress: string
  confirmations: string
  blockNumber: string
  blockHash: string
}

export interface IBlockScoutTokenTx {
  value: string
  transactionIndex: string
  tokenSymbol: string
  tokenName: string
  tokenDecimal: string
  to: string
  timeStamp: string
  nonce: string
  input: string
  hash: string
  gasUsed: string
  gasPrice: string
  gas: string
  from: string
  cumulativeGasUsed: string
  contractAddress: string
  confirmations: string
  blockNumber: string
  blockHash: string
}

export interface IParsedTx {
  timestamp: string
  hash: string
  from: string
  to: string
  nonce: string
  gasPrice: string
  gasUsed: string
  fee: string
  value: string
  input: string
  error: boolean
  asset: IAssetData
  operations: ITxOperation[]
}

export interface ITxOperation {
  asset: IAssetData
  value: string
  from: string
  to: string
  functionName: string
}

export interface IGasPricesResponse {
  fastWait: number
  avgWait: number
  blockNum: number
  fast: number
  fastest: number
  fastestWait: number
  safeLow: number
  safeLowWait: number
  speed: number
  block_time: number
  average: number
}

export interface IGasPrice {
  time: number
  price: number
}

export interface IGasPrices {
  timestamp: number
  slow: IGasPrice
  average: IGasPrice
  fast: IGasPrice
}

export interface IMethodArgument {
  type: string
}

export interface IMethod {
  signature: string
  name: string
  args: IMethodArgument[]
}

/* eslint-disable */

/**
 * Options for creating and using a multisignature account.
 */
export interface IMultisigMetadata {
  /**
   * Multisig version.
   */
  version: number

  /**
   * Multisig threshold value. Authorization requires a subset of
   * signatures, equal to or greater than the threshold value.
   */
  threshold: number

  /**
   * List of Algorand addresses of possible signers for this
   * multisig. Order is important.
   */
  addrs: string[]
}

export interface IWalletTransaction {
  /**
   * Base64 encoding of the canonical msgpack encoding of a
   * Transaction.
   */
  txn: string

  /**
   * Optional authorized address used to sign the transaction when
   * the account is rekeyed. Also called the signor/sgnr.
   */
  authAddr?: string

  /**
   * Optional multisig metadata used to sign the transaction
   */
  msig?: IMultisigMetadata

  /**
   * Optional list of addresses that must sign the transactions
   */
  signers?: string[]

  /**
   * Optional message explaining the reason of the transaction
   */
  message?: string
}

export interface ISignTxnOpts {
  /**
   * Optional message explaining the reason of the group of
   * transactions.
   */
  message?: string

  // other options may be present, but are not standard
}

export type SignTxnParams = [IWalletTransaction[], ISignTxnOpts?]

/* eslint-enable */

export interface IndexerResponse {
  address: string
  amount: number
  'amount-without-pending-rewards': number
  'apps-local-state': AppsLocalState[]
  'apps-total-schema': Schema
  'created-apps': CreatedApp[]
  'created-at-round': number
  deleted: boolean
  'pending-rewards': number
  'reward-base': number
  rewards: number
  round: number
  'sig-type': string
  status: string
  'total-apps-opted-in': number
  'total-assets-opted-in': number
  'total-created-apps': number
  'total-created-assets': number
}

export interface AppsLocalState {
  deleted: boolean
  id: number
  'opted-in-at-round': number
  schema: Schema
  'key-value'?: KeyValue[]
}

export interface KeyValue {
  key: string
  value: Value
}

export interface Value {
  bytes: string
  type: number
  uint: number
}

export interface Schema {
  'num-byte-slice': number
  'num-uint': number
}

export interface CreatedApp {
  'created-at-round': number
  deleted: boolean
  id: number
  params: Params
}

export interface Params {
  'approval-program': string
  'clear-state-program': string
  creator: string
  'global-state': KeyValue[]
  'global-state-schema': Schema
  'local-state-schema': Schema
}
