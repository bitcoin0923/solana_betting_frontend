/* eslint-disable */
import { tryPublicKey } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { firstParam } from '../components/common/utils'

export const useWalletIds = () => {
  const wallet = useWallet()
  const walletIds = [
    wallet.publicKey,
  ]
  return walletIds.filter((id): id is PublicKey => id !== null)
}
