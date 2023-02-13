/* eslint-disable */
import { AnchorProvider, BN, Program, utils, web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as borsh from "@project-serum/borsh";
import idl from './idl.json';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const opts = {
  preflightCommitment: 'processed',
};
const programID = new PublicKey(idl.metadata.address);
export const shadowMintPubkey = new PublicKey('ANoKeHDKGW4spAXhsosHcNo4vNGCPuyba3ihjhLmUUzj');

async function getProvider(wallet: any) {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
  const connection = new Connection(network, opts.preflightCommitment as any);

  const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment as any);
  return provider;
}
export const STAKING_ACCOUNT_DATA_LAYOUT = borsh.struct([
  borsh.publicKey("adminKey"),
  borsh.bool("freezeProgram"),
  borsh.publicKey("authorizedCreator"),
  borsh.u64("minimumStakingPeriod"),
  borsh.u64("maximumStakingPeriod"),
  borsh.u64("teamANfts"),
  borsh.u64("teamBNfts"),
  borsh.u64("shadowPerNft"),
]);

export async function _stake(
  wallet: any,
  stakingIndex: string | number | Uint8Array | Buffer | BN | number[],
  nftVaultBumps: any,
  remainingAccounts: any,
  teamId: any
) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey, stakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    program.programId
  );
  const [userStakingCounterPubkey, userStakingCounterBump] = await web3.PublicKey.findProgramAddress(
    [provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const [userStakingPubkey, userStakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const transaction = new Transaction();
  transaction.add( program.instruction.stake(nftVaultBumps, stakingBump, userStakingCounterBump, userStakingBump, teamId, {
    accounts: {
      nftFromAuthority: provider.wallet.publicKey,
      stakingAccount: stakingPubkey,
      userStakingCounterAccount: userStakingCounterPubkey,
      userStakingAccount: userStakingPubkey,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    remainingAccounts,
  }));
  return transaction;
}

export async function _lockStake(
  wallet: any,
  stakingIndex: string | number | Buffer | Uint8Array | number[] | BN,
  kageAmount: string | number | Buffer | Uint8Array | number[] | BN,
  period: string | number | Buffer | Uint8Array | number[] | BN,
  userATA: web3.PublicKeyInitData
) {
  let shadowDepositAmount = new BN(1e9);
  shadowDepositAmount = shadowDepositAmount.mul(new BN(kageAmount));
  const userStakingPeriod = new BN(period);
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey, stakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    program.programId
  );
  const [shadowVaultPubkey, shadowVaultBump] = await web3.PublicKey.findProgramAddress(
    [shadowMintPubkey.toBuffer()],
    program.programId
  );
  const userShadowTokenAccount = new PublicKey(userATA);
  // const [userShadowTokenAccount] = await web3.PublicKey.findProgramAddress(
  //   [
  //     provider.wallet.publicKey.toBuffer(),
  //     TOKEN_PROGRAM_ID.toBuffer(),
  //     shadowMintPubkey.toBuffer(),
  //   ],
  //   SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  // );
  console.log(userShadowTokenAccount.toString(), ':uarutc');
  const [userStakingCounterPubkey, userStakingCounterBump] = await web3.PublicKey.findProgramAddress(
    [provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const [userStakingPubkey, userStakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  await program.rpc.lockStake(
    stakingBump,
    userStakingCounterBump,
    userStakingBump,
    shadowVaultBump,
    userStakingPeriod,
    shadowDepositAmount,
    {
      accounts: {
        nftFromAuthority: provider.wallet.publicKey,
        stakingAccount: stakingPubkey,
        userStakingCounterAccount: userStakingCounterPubkey,
        userStakingAccount: userStakingPubkey,
        shadowMint: shadowMintPubkey,
        shadowVault: shadowVaultPubkey,
        shadowFrom: userShadowTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

export async function _claim(
  wallet: any,
  stakingIndex: string | number | Buffer | Uint8Array | number[] | BN,
  userATA: web3.PublicKeyInitData
) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [shadowVaultPubkey, shadowVaultBump] = await web3.PublicKey.findProgramAddress(
    [shadowMintPubkey.toBuffer()],
    program.programId
  );
  const userShadowTokenAccount = new PublicKey(userATA);
  // const [userShadowTokenAccount] = await web3.PublicKey.findProgramAddress(
  //   [
  //     provider.wallet.publicKey.toBuffer(),
  //     TOKEN_PROGRAM_ID.toBuffer(),
  //     shadowMintPubkey.toBuffer(),
  //   ],
  //   SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  // );
  const [stakingPubkey, stakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    program.programId
  );
  const [userStakingPubkey, userStakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  await program.rpc.claimShadowReward(stakingBump, shadowVaultBump, stakingIndex, userStakingBump, {
    accounts: {
      shadowMint: shadowMintPubkey,
      shadowVault: shadowVaultPubkey,
      shadowTo: userShadowTokenAccount,
      shadowToAuthority: provider.wallet.publicKey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

export async function _kageMint(wallet: any, userATA: web3.PublicKeyInitData) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const kageAmount = new BN(50e9);
  const [shadowVaultPubkey, shadowVaultBump] = await web3.PublicKey.findProgramAddress(
    [shadowMintPubkey.toBuffer()],
    program.programId
  );
  const userShadowTokenAccount = new PublicKey(userATA);
  // const [userShadowTokenAccount] = await web3.PublicKey.findProgramAddress(
  //   [
  //     provider.wallet.publicKey.toBuffer(),
  //     TOKEN_PROGRAM_ID.toBuffer(),
  //     shadowMintPubkey.toBuffer(),
  //   ],
  //   SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  // );

  await program.rpc.kageMint(shadowVaultBump, kageAmount, {
    accounts: {
      shadowMint: shadowMintPubkey,
      shadowVault: shadowVaultPubkey,
      shadowTo: userShadowTokenAccount,
      shadowToAuthority: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

export async function _lootBox(
  wallet: any,
  stakingIndex: string | number | Buffer | Uint8Array | number[] | BN,
  remainingAccounts: any
) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey, stakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    program.programId
  );
  const [userStakingPubkey, userStakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  await program.rpc.claim(stakingBump, stakingIndex, userStakingBump, {
    accounts: {
      nftToAuthority: provider.wallet.publicKey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts,
  });
}

export async function _unStake(
  wallet: any,
  stakingIndex: string | number | Buffer | Uint8Array | number[] | BN,
  remainingAccounts: any,
  teamId: any
) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey, stakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    program.programId
  );
  const [userStakingPubkey, userStakingBump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const tx = new Transaction();
  tx.add( program.instruction.unstake(stakingBump, stakingIndex, userStakingBump, teamId, {
    accounts: {
      nftToAuthority: provider.wallet.publicKey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts,
  }));
  return tx;
}

export async function _getPDA(wallet: any, mintKey: PublicKey) {
  const provider = await getProvider(wallet);
  const [pdaAddress] = await web3.PublicKey.findProgramAddress(
    [provider.wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintKey.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  return pdaAddress;
}

export async function _getATA(wallet: any, mintKey: PublicKey) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [pubkey, bump] = await web3.PublicKey.findProgramAddress(
    [provider.wallet.publicKey.toBuffer(), mintKey.toBuffer()],
    program.programId
  );
  return [pubkey, bump];
}

export async function _getUserStakingIndex(wallet: any) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [userStakingCounterPubkey] = await web3.PublicKey.findProgramAddress(
    [provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  try {
    const curStakeIdx = await program.account.userStakingCounterAccount.fetch(userStakingCounterPubkey);
    console.log('usca', curStakeIdx);
    return curStakeIdx.counter;
  } catch {
    console.log('usca000');
    return 0;
  }
}

export async function _getGlobalData(wallet: any) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [stakingPubkey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('nft_staking'))],
    programID
  );
  try {
    const stakingData = await program.account.stakingAccount.fetch(stakingPubkey);
    return {
      teamANames: stakingData.teamANames,
      teamBNames: stakingData.teamBNames,
      teamANfts: stakingData.teamANfts,
      teamBNfts: stakingData.teamBNfts,
      endTime: stakingData.maximumStakingPeriod,
    };
  } catch {
    console.log('sData NONE');
    return null;
  }
}

export async function _getStakingdata(
  wallet: any,
  stakingIndex: string | number | Uint8Array | Buffer | BN | number[]
) {
  const provider = await getProvider(wallet);
  const program = new Program(idl as any, programID, provider);
  const [userStakingPubkey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode(new BN(stakingIndex).toString())), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  try {
    const stakingData = await program.account.userStakingAccount.fetch(userStakingPubkey);
    return stakingData;
  } catch (err) {
    return [];
  }
}
