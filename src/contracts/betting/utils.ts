/* eslint-disable */
import { AnchorProvider, BN, Program, utils, web3 } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import * as borsh from "@project-serum/borsh";
import idl from './idl.json';
export const BET_ACCOUNT_DATA_LAYOUT = borsh.struct([
  borsh.publicKey("adminKey"),
  borsh.u64("totalBetAmount"),
  borsh.u64("totalLAmount"),
  borsh.u64("totalRAmount"),
  borsh.u32("startTime"),
  borsh.u32("endTime"),
  borsh.bool("isClose"),
  borsh.u16("betFee"),
  borsh.u8("winnerResult"),
]);

const opts = {
  preflightCommitment: 'processed',
};
const programID = new PublicKey(idl.metadata.address);

async function getProvider() {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
  const connection = new Connection(network, opts.preflightCommitment as any);
  const wallet = (window as any).solana;
  const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment as any);
  return provider;
}

export async function getUserBetInfo() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  if(!provider.wallet.publicKey) return [];
  const [userBettingPubkey] =
  await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('user-betting-info1')),
        provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  try{
    let userBetInfo = await program.account.userBetAccount.fetch(userBettingPubkey);
    return userBetInfo;
  } catch (err) {
    return [];
  }
}

export async function getBetInfo() {
  const provider = await getProvider();
  const network = 'https://metaplex.devnet.rpcpool.com'; // https://api.devnet.solana.com
  const connection = new Connection(network, opts.preflightCommitment as any);
  const program = new Program(idl as any, programID, provider);
  const [bettingPubkey] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('honorous_betting-account1'))],
    program.programId
  );
  // const betAccount = await connection.getAccountInfo(bettingPubkey);
  // const pubBetInfo = BET_ACCOUNT_DATA_LAYOUT.decode(betAccount?.data);
  try{
    let userBetInfo = await program.account.bettingAccount.fetch(bettingPubkey);
    let bal = await connection.getBalance(provider.wallet.publicKey);

    return {
      info:userBetInfo,
      balance: bal
    };
  } catch (err) {
    return {
      info:[],
      balance: 0
    };
  }
}

export async function _bet( bet_side: any, bet_amount: any) {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [vaultPubkey, vaultBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('betting-escrow-vault1'))],
    program.programId
  );
  const [bettingPubkey, bettingBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('honorous_betting-account1'))],
    program.programId
  );
  const [userBettingPubkey, userBettingBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('user-betting-info1')),
        provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const amount = new BN(bet_amount).mul(new BN(1e6));
  await program.rpc.userBet(
    bettingBump,
    vaultBump,
    userBettingBump,
    bet_side,
    amount,
    { 
      accounts: {
        userAccount: provider.wallet.publicKey,
        bettingAccount: bettingPubkey,
        escrowAccount: vaultPubkey,
        userBettingAccount: userBettingPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }
    });
}

export async function _claimBet() {
  const provider = await getProvider();
  const program = new Program(idl as any, programID, provider);
  const [vaultPubkey, vaultBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('betting-escrow-vault1'))],
    program.programId
  );
  const [bettingPubkey, bettingBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('honorous_betting-account1'))],
    program.programId
  );
  const [userBettingPubkey, userBettingBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode('user-betting-info1')),
        provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  await program.rpc.claimReward(
    bettingBump,
    vaultBump,
    userBettingBump,
    {
      accounts: {
        userAccount: provider.wallet.publicKey,
        bettingAccount: bettingPubkey,
        escrowAccount: vaultPubkey,
        userBettingAccount: userBettingPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }
    }
  );   
}
