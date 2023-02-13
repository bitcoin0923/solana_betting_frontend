/* eslint-disable */
import { tryPublicKey } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'

export const useWalletId = () => {
  const wallet = useWallet()
  return wallet.publicKey
}
