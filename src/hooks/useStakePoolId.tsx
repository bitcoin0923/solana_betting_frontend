/* eslint-disable */
import { tryPublicKey } from '@cardinal/namespaces-components'
import { stakePoolMetadatas } from '../api/mapping'

export const useStakePoolId = () => {
  const stakePoolId = '8ofNk2sg1AfkqpFvaW768AqfE2JRAuTueBZahBEbbDwT';
  const nameMapping = stakePoolMetadatas.find((p) => p.name === stakePoolId)
  const addressMapping = stakePoolMetadatas.find(
    (p) => p.stakePoolAddress.toString() === stakePoolId
  )
  const publicKey =
    nameMapping?.stakePoolAddress ||
    addressMapping?.stakePoolAddress ||
    tryPublicKey(stakePoolId)

  return publicKey
}
