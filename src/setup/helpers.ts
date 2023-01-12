import { InternalTx, InternalTXType } from '../shardeum/shardeumTypes'
import { AccessListEIP2930Transaction, Transaction } from '@ethereumjs/tx'
import { toBuffer } from 'ethereumjs-util'
import * as crypto from '@shardus/crypto-utils'
import { ShardeumFlags } from '../shardeum/shardeumFlags'

crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc')
export { crypto }

export function verify(obj: any, expectedPk?: any) {
  if (expectedPk) {
    if (obj.sign.owner !== expectedPk) return false
  }
  return crypto.verifyObj(obj)
}

export function isInternalTXGlobal(internalTx: InternalTx) {
  return (
    internalTx.internalTXType === InternalTXType.SetGlobalCodeBytes ||
    internalTx.internalTXType === InternalTXType.ApplyChangeConfig ||
    internalTx.internalTXType === InternalTXType.InitNetwork ||
    internalTx.internalTXType === InternalTXType.ApplyNetworkParam
  )
}

export function isInternalTx(tx: any): boolean {
  if (tx.isInternalTx) {
    return true
  }
  return false
}

export function isDebugTx(tx: any): boolean {
  return tx.isDebugTx != null
}

export function getTransactionObj(tx: any): Transaction | AccessListEIP2930Transaction {
  if (!tx.raw) throw Error('fail')
  let transactionObj
  const serializedInput = toBuffer(tx.raw)
  try {
    transactionObj = Transaction.fromRlpSerializedTx(serializedInput)
  } catch (e) {
    // if (ShardeumFlags.VerboseLogs) console.log('Unable to get legacy transaction obj', e)
  }
  if (!transactionObj) {
    try {
      transactionObj = AccessListEIP2930Transaction.fromRlpSerializedTx(serializedInput)
    } catch (e) {
      if (ShardeumFlags.VerboseLogs) console.log('Unable to get transaction obj', e)
    }
  }

  if (transactionObj) {
    return transactionObj
  } else {
    throw Error('tx obj fail')
  }
}
