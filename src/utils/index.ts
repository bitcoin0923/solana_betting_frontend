/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */
import { AnchorProvider } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';

import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from '../constants';

export const getShortWalletAddress = (account?: string) => {
  if (account) {
    return `${account.slice(0, 5)}...${account.slice(-5)}`;
  }
  return '';
};

export const getProvider = async () => {
  const opts = {
    preflightCommitment: 'processed',
  };
  const network = 'https://metaplex.devnet.rpcpool.com';
  const _connection = new Connection(network, opts.preflightCommitment as any);
  const _wallet = (window as any).solana;

  const provider = new AnchorProvider(_connection, _wallet, opts.preflightCommitment as any);
  return provider;
};

export const getAssociatedTokenAddress = async (mint: PublicKey, wallet: PublicKey | null) => {
  const [tokenAccount] = await PublicKey.findProgramAddress(
    [(wallet || new PublicKey('')).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  return tokenAccount;
};

export function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  const mins = Math.round(diff / 60);
  const hours = Math.round(mins / 60);
  const days = Math.round(hours / 24);
  if (days > 0) {
    return `${days}d`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${diff}s`;
}
