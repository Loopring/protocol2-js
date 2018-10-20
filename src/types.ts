import { BigNumber } from "bignumber.js";
import { Bitstream } from "./bitstream";

// Make sure to keep this in sync with the Multihash smart contract
export enum SignAlgorithm {
  Ethereum = 0,   // Sign with web3.eth_sign
                  // Should be compatible with Trezor now (with latest firmware):
                  // https://github.com/ethereum/go-ethereum/issues/14794#issuecomment-392028942
  EIP712 = 1,     // Sign with web3.eth.signTypedData
                  // EIP712: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
  None = 255,     // Do not sign
}

export enum TokenType {
  ERC20 = 0,
  ERC1400 = 1,
}

export interface Spendable {
  initialized?: boolean;
  amount?: BigNumber;
  reserved?: BigNumber;
  index?: number;

  // Testing
  initialAmount?: BigNumber;
}

export interface OrderInfo {
  version?: number;

  // required fields in contract
  owner?: string;
  tokenS: string;
  tokenB: string;
  amountS: number;
  amountB: number;
  validSince?: number;
  tokenSpendableS?: Spendable;
  tokenSpendableFee?: Spendable;

  // optional fields
  dualAuthAddr?: string;
  broker?: string;
  brokerSpendableS?: Spendable;
  brokerSpendableFee?: Spendable;
  orderInterceptor?: string;
  walletAddr?: string;
  validUntil?: number;
  allOrNone?: boolean;
  sig?: string;
  dualAuthSig?: string;
  feeToken?: string;
  feeAmount?: number;
  waiveFeePercentage?: number;
  tokenSFeePercentage?: number;
  tokenBFeePercentage?: number;
  tokenRecipient?: string;
  walletSplitPercentage?: number;

  tokenTypeS?: TokenType;
  tokenTypeB?: TokenType;
  tokenTypeFee?: TokenType;
  trancheS?: string;
  trancheB?: string;
  transferDataS?: string;

  // helper field
  P2P?: boolean;
  filledAmountS?: BigNumber;
  brokerInterceptor?: string;
  valid?: boolean;

  hash?: Buffer;
  signAlgorithm?: SignAlgorithm;
  dualAuthSignAlgorithm?: SignAlgorithm;

  index?: number;
  balanceS?: number;
  balanceFee?: number;
  balanceB?: number;
  onChain?: boolean;

  [key: string]: any;
}

export interface Participation {
  order: OrderInfo;

  // computed fields
  splitS: BigNumber;
  feeAmount: BigNumber;
  feeAmountS: BigNumber;
  feeAmountB: BigNumber;
  rebateFee: BigNumber;
  rebateS: BigNumber;
  rebateB: BigNumber;
  fillAmountS: BigNumber;
  fillAmountB: BigNumber;

  // test fields
  ringSpendableS: BigNumber;
  ringSpendableFee: BigNumber;
}

export interface RingsSubmitParam {
  ringSpecs: number[][];
  data: Bitstream;
  tables: Bitstream;
}

export interface OrderExpectation {
  filledFraction: number;
  P2P?: boolean;
  margin?: number;
}

export interface RingExpectation {
  fail?: boolean;
  orders?: OrderExpectation[];
}

export interface TransactionExpectation {
  revert?: boolean;
  rings?: RingExpectation[];
}

export interface RingsInfo {
  description?: string;
  feeRecipient?: string; // spec value: 1
  miner?: string;        // spec value: 1 << 1
  sig?: string;          // spec value: 1 << 2
  rings: number[][];
  orders: OrderInfo[];

  signAlgorithm?: SignAlgorithm;
  hash?: Buffer;
  transactionOrigin?: string;

  expected?: TransactionExpectation;

  [key: string]: any;
}

export interface DetailedTokenTransfer {
  description: string;
  token: string;
  from: string;
  to: string;
  amount: number;
  subPayments: DetailedTokenTransfer[];
}

export interface OrderPayments {
  payments: DetailedTokenTransfer[];
}

export interface RingPayments {
  orders: OrderPayments[];
}

export interface TransactionPayments {
  rings: RingPayments[];
}

export interface SimulatorReport {
  reverted: boolean;
  ringMinedEvents: RingMinedEvent[];
  transferItems: TransferItem[];
  feeBalancesBefore: { [id: string]: any; };
  feeBalancesAfter: { [id: string]: any; };
  filledAmounts: { [hash: string]: BigNumber; };
  balancesBefore: { [id: string]: any; };
  balancesAfter: { [id: string]: any; };
  payments: TransactionPayments;
}

export interface TransferItem {
  token: string;
  from: string;
  to: string;
  amount: BigNumber;

  // ERC1400
  fromTranche?: string;
  toTranche?: string;
  data?: string;
}

export interface RingMinedEvent {
  ringIndex: BigNumber;
}
