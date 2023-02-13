/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import * as anchor from '@project-serum/anchor';
import { AnchorProvider, Program } from '@project-serum/anchor';
import * as BufferLayout from '@solana/buffer-layout';
import * as BufferLayoutUtils from '@solana/buffer-layout-utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';

import { getAssociatedTokenAddress } from '../../utils';
import { sendTransaction, sendTransactions } from '../../utils/connection';
import idl from './idl.json';

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const lootboxMetadataUrl = 'https://arweave.net/58slGQtz9eHnc9fYD_FvZ0-m1gXDwU0xAV57TJlq0og';
export const shadowPubkey = new PublicKey('ANoKeHDKGW4spAXhsosHcNo4vNGCPuyba3ihjhLmUUzj');

interface RawMint {
  mintAuthorityOption: 1 | 0;
  mintAuthority: PublicKey;
  supply: bigint;
  decimals: number;
  isInitialized: boolean;
  freezeAuthorityOption: 1 | 0;
  freezeAuthority: PublicKey;
}

const MintLayout = BufferLayout.struct<RawMint>([
  BufferLayout.u32('mintAuthorityOption'),
  BufferLayoutUtils.publicKey('mintAuthority'),
  BufferLayoutUtils.u64('supply'),
  BufferLayout.u8('decimals'),
  BufferLayoutUtils.bool('isInitialized'),
  BufferLayout.u32('freezeAuthorityOption'),
  BufferLayoutUtils.publicKey('freezeAuthority'),
]);

const MINT_SIZE = MintLayout.span;

enum TokenInstruction {
  InitializeMint = 0,
  InitializeAccount = 1,
  InitializeMultisig = 2,
  Transfer = 3,
  Approve = 4,
  Revoke = 5,
  SetAuthority = 6,
  MintTo = 7,
  Burn = 8,
  CloseAccount = 9,
  FreezeAccount = 10,
  ThawAccount = 11,
  TransferChecked = 12,
  ApproveChecked = 13,
  MintToChecked = 14,
  BurnChecked = 15,
  InitializeAccount2 = 16,
  SyncNative = 17,
  InitializeAccount3 = 18,
  InitializeMultisig2 = 19,
  InitializeMint2 = 20,
}

export interface InitializeMintInstructionData {
  instruction: TokenInstruction.InitializeMint;
  decimals: number;
  mintAuthority: PublicKey;
  freezeAuthorityOption: 1 | 0;
  freezeAuthority: PublicKey;
}

const initializeMintInstructionData: BufferLayout.Structure<InitializeMintInstructionData> = BufferLayout.struct([
  BufferLayout.u8('instruction'),
  BufferLayout.u8('decimals'),
  BufferLayoutUtils.publicKey('mintAuthority'),
  BufferLayout.u8('freezeAuthorityOption'),
  BufferLayoutUtils.publicKey('freezeAuthority'),
]);

export const createInitializeMintInstruction = (
  mint: PublicKey,
  decimals: number,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  programId: PublicKey = TOKEN_PROGRAM_ID
) => {
  const keys = [
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
  const data = Buffer.alloc(initializeMintInstructionData.span);
  initializeMintInstructionData.encode(
    {
      instruction: TokenInstruction.InitializeMint,
      decimals,
      mintAuthority,
      freezeAuthorityOption: freezeAuthority ? 1 : 0,
      freezeAuthority: freezeAuthority || new PublicKey(0),
    },
    data
  );
  return new TransactionInstruction({ keys, programId, data });
};

export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId: PublicKey = TOKEN_PROGRAM_ID,
  associatedTokenProgramId: PublicKey = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
}

export const getMetadata = async (mint: PublicKey) =>
  (
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];

export const getMasterEdition = async (mint: PublicKey) =>
  (
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];

export const mintNFT = async (provider: AnchorProvider, wallet: WalletContextState, metadataUrl: string) => {
  const programID = new PublicKey(idl.metadata.address);
  const program = new Program(idl as any, programID, provider);
  // const adminPubKey = new PublicKey("FZgJdN7dXz4BcyBBhw3WEXQiPLPLnBJhNi2WX6p41KnK")
  const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const mintKey = anchor.web3.Keypair.generate();
  // console.log(mintKey.publicKey + "");
  const NftTokenAccount = await getAssociatedTokenAddress(mintKey.publicKey, wallet.publicKey);
  const signers = [mintKey];
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey || new PublicKey(''),
      newAccountPubkey: mintKey.publicKey,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
      lamports,
    }),
    createInitializeMintInstruction(mintKey.publicKey, 0, wallet.publicKey || new PublicKey(''), wallet.publicKey),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey || new PublicKey(''),
      NftTokenAccount,
      wallet.publicKey || new PublicKey(''),
      mintKey.publicKey
    ),
  ];

  // console.log(
  // 	await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
  // );

  const metadataAddress = await getMetadata(mintKey.publicKey);
  const masterEdition = await getMasterEdition(mintKey.publicKey);
  // get data from url
  const response = await fetch(metadataUrl);
  const data: any = await response.json();
  instructions.push(
    program.instruction.mintNft(mintKey.publicKey, metadataUrl, data.name, data.symbol, {
      accounts: {
        mintAuthority: wallet.publicKey || new PublicKey(''),
        mint: mintKey.publicKey,
        tokenAccount: NftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: wallet.publicKey || new PublicKey(''),
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition,
      },
    })
  );
  try {
    await sendTransaction(provider.connection, provider.wallet, instructions, signers);
  } catch (e) {
    console.log(e);
  }
};

export const openLootBox = async (
  provider: AnchorProvider,
  wallet: WalletContextState,
  lootboxs: any[],
  kageTokenAmount: anchor.BN
) => {
  const programID = new PublicKey(idl.metadata.address);
  const program = new Program(idl as any, programID, provider);
  const instructions: any = [];
  const signers: any = [];
  const [kageVaultPubkey] = await anchor.web3.PublicKey.findProgramAddress(
    [shadowPubkey.toBuffer()],
    program.programId
  );
  const userKageTokenAccount = await getAssociatedTokenAddress(shadowPubkey, wallet.publicKey);

  await Promise.all(
    lootboxs.map(async (lootbox) => {
      const tmpInstructions: any = [];

      const lootboxKey = new PublicKey(lootbox.mint);
      const lootboxAccount = await getAssociatedTokenAddress(lootboxKey, wallet.publicKey);
      const [userLootboxPubkey, userLootboxBump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          (wallet.publicKey || new PublicKey('')).toBuffer(),
          Buffer.from(anchor.utils.bytes.utf8.encode('user_lootbox')),
        ],
        program.programId
      );

      await tmpInstructions.push(
        program.instruction.openLootbox(userLootboxBump, kageTokenAmount, {
          accounts: {
            payer: wallet.publicKey || new PublicKey(''),
            lootbox: lootboxKey,
            lootboxAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            userLootbox: userLootboxPubkey,
            systemProgram: SystemProgram.programId,
            kageMint: shadowPubkey,
            kageVault: kageVaultPubkey,
            kageFrom: userKageTokenAccount,
          },
        })
      );
      instructions.push(tmpInstructions);
      signers.push([]);
    })
  );

  try {
    await sendTransactions(provider.connection, provider.wallet, instructions, signers);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
