/* eslint-disable */
import { AnchorProvider, BN, Program, utils } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';

import idl from './idl.json';

const opts = {
  preflightCommitment: 'processed',
};
const programID = new PublicKey(idl.metadata.address);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const mintPubkey = new PublicKey('ANoKeHDKGW4spAXhsosHcNo4vNGCPuyba3ihjhLmUUzj');
async function getProvider() {
  const network = 'https://metaplex.devnet.rpcpool.com';
  const connection = new Connection(network, opts.preflightCommitment as any);
  const wallet = (window as any).solana;

  const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment as any);
  return provider;
}

export async function getRewardInfo() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('staking'))],
    program.programId
  );
  const [walletTokenAccount] = await PublicKey.findProgramAddress(
    [(provider.wallet.publicKey || new PublicKey('')).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  try {
    const accountInfo = await provider.connection.getTokenAccountBalance(walletTokenAccount);
    const stakingInfo = await program.account.stakingAccount.fetch(stakingPubkey);
    return {
      accInfo:accountInfo, 
      stakingInfo:stakingInfo
    }
  } catch {
    console.log('none user staking.');
    return {}
  }
}

export async function stakeGlory(amountRef: number, teamID: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const amount = amountRef * 1000;
  const amount_bn = new BN(1e6).mul(new BN(amount));
  const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress([mintPubkey.toBuffer()], program.programId);
  const [stakingPubkey, stakingBump] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('staking'))],
    program.programId
  );
  const [walletTokenAccount] = await PublicKey.findProgramAddress(
    [(provider.wallet.publicKey || new PublicKey('')).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  const [userStakingPubkey, userStakingBump] = await PublicKey.findProgramAddress(
    [(provider.wallet.publicKey || new PublicKey('')).toBuffer()],
    program.programId
  );
  await program.methods
    .stake(vaultBump, stakingBump, userStakingBump, amount_bn, teamID)
    .accounts({
      tokenMint: mintPubkey,
      tokenFrom: walletTokenAccount,
      tokenFromAuthority: provider.wallet.publicKey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  console.log(amountRef, ':stake');
}

export async function burn(amountRef: number, teamID: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const amount = amountRef * 1000;
  const amount_bn = new BN(1e6).mul(new BN(amount));
  const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress([mintPubkey.toBuffer()], program.programId);
  const [stakingPubkey, stakingBump] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('staking'))],
    program.programId
  );
  const [walletTokenAccount] = await PublicKey.findProgramAddress(
    [(provider.wallet.publicKey || new PublicKey('')).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  const [userStakingPubkey, userStakingBump] = await PublicKey.findProgramAddress(
    [(provider.wallet.publicKey || new PublicKey('')).toBuffer()],
    program.programId
  );
  await program.methods
    .burn(vaultBump, stakingBump, userStakingBump, amount_bn, teamID)
    .accounts({
      tokenMint: mintPubkey,
      tokenFrom: walletTokenAccount,
      tokenFromAuthority: provider.wallet.publicKey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  console.log(amountRef, ':burn');
}


export async function stake(wallet: any, amount: string | number | BN | Buffer | Uint8Array | number[]) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const amount_bn = new BN(1e6).mul(new BN(amount));
  const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress([mintPubkey.toBuffer()], program.programId);
  const [stakingPubkey, stakingBump] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('staking'))],
    program.programId
  );
  const [walletTokenAccount] = await PublicKey.findProgramAddress(
    [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  const [userStakingPubkey, userStakingBump] = await PublicKey.findProgramAddress(
    [wallet.publicKey.toBuffer()],
    program.programId
  );
  await program.methods
    .stake(vaultBump, stakingBump, userStakingBump, amount_bn)
    .accounts({
      tokenMint: mintPubkey,
      tokenFrom: walletTokenAccount,
      tokenFromAuthority: wallet.publicKey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();
}
export async function unstake(wallet: any, amount: string | number | BN | Buffer | Uint8Array | number[]) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);

  const amount_bn = new BN(1e3).mul(new BN(amount));
  const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress([mintPubkey.toBuffer()], program.programId);
  const [stakingPubkey, stakingBump] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('staking'))],
    program.programId
  );
  const [walletTokenAccount] = await PublicKey.findProgramAddress(
    [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  const [userStakingPubkey, userStakingBump] = await PublicKey.findProgramAddress(
    [wallet.publicKey.toBuffer()],
    program.programId
  );
  await program.methods
    .unstake(vaultBump, stakingBump, userStakingBump, amount_bn)
    .accounts({
      tokenMint: mintPubkey,
      xTokenFromAuthority: wallet.publicKey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      tokenTo: walletTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();
}
