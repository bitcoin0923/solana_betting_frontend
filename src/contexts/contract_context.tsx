/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';

import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from '../constants';
import { shadowPubkey } from '../contracts/lootbox/utils';
import { MyBattleInfo, NftStakedInfo } from '../types';
import { getProvider } from '../utils';

export interface IContractContext {
  balance: any;
  updateBalance: () => void;
  nftStakedInfo: Maybe<NftStakedInfo>;
  setNftStakedInfo: (value: Maybe<NftStakedInfo>) => void;
  myBattleInfo: Maybe<MyBattleInfo>;
  setMyBattleInfo: (value: Maybe<MyBattleInfo>) => void;
}

const ContractContext = React.createContext<Maybe<IContractContext>>(null);

export const ContractProvider = ({ children = null as any }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState(0);
  const [nftStakedInfo, setNftStakedInfo] = useState<Maybe<NftStakedInfo>>(null);
  const [myBattleInfo, setMyBattleInfo] = useState<Maybe<MyBattleInfo>>(null);

  useEffect(() => {
    setInterval(() => {
      updateBalance();
    }, 3000);
  }, [publicKey, connection]);

  const updateBalance = async () => {
    if (publicKey && connection) {
      const provider = await getProvider();
      const [walletTokenAccount] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), shadowPubkey.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      );
      // const accountInfo = await provider.connection.getTokenAccountBalance(walletTokenAccount);
      const bal = await provider.connection.getBalance(provider.wallet.publicKey);
      const balStr = bal / 1000000000;
      setBalance(balStr || 0);
    } 
  };

  return (
    <ContractContext.Provider value={{ balance, updateBalance, nftStakedInfo, setNftStakedInfo, myBattleInfo, setMyBattleInfo }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
