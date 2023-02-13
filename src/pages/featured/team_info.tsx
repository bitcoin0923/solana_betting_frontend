/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

import { createStakeEntryAndStakeMint, stake, unstake } from '@cardinal/staking';
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool';
import * as metaplex from '@metaplex/js';
import { Wallet } from '@metaplex/js';
import { createConnectionConfig, getParsedNftAccountsByOwner, isValidSolanaAddress } from '@nfteyez/sol-rayz';
import { BN } from '@project-serum/anchor';
import { notify } from '../../components/common/Notification';
import { StakeEntryTokenData, useStakedTokenDatas } from '../../hooks/useStakedTokenDatas';
import { useStakePoolEntries } from '../../hooks/useStakePoolEntries';
import { useStakePoolData } from '../../hooks/useStakePoolData';
import { AllowedTokenData, useAllowedTokenDatas } from '../../hooks/useAllowedTokenDatas';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import styled from 'styled-components';

import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';
import { executeAllTransactions } from '../../api/utils';

import TeamImg1 from '../../assets/images/team1.png';
import TeamImg2 from '../../assets/images/team2.png';
import EthIcon from '../../assets/images/sol_icon.png';
import Button from '../../components/common/button';
import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import ProgressBar from '../../components/common/progress_bar';
import { Typography, TypographyType } from '../../components/common/typography';
import { useContract } from '../../contexts/contract_context';
import { useTheme } from '../../contexts/theme_context';
import {
  _claim,
  _getATA,
  _getGlobalData,
  _getPDA,
  _getStakingdata,
} from '../../contracts/contract/utils';
import { getTwitterFeeds, setUserStakeInfo } from '../../services/TutorialService';
import { TwitterFeed } from '../../types';
import TweetList from './tweet_list';
import BetModal from '../../components/modals/bet_modal';
import UnstakeModal from '../../components/modals/unstake_modal';
import StakeModal from '../../components/modals/stake_modal';
import { getUserBetInfo, getBetInfo, _bet, _claimBet, _stake, _unStake } from '../../contracts/alphabets/utils';
import Overview from './overview';
import Timepanel from './timepanel';
import CenterPanel from './centerpanel';

const NftButtonList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button,
  div,
  span,
  p {
    margin: 0 0.5rem;
  }
`;

const NftButton = styled(Button)`
  background: ${({ theme }) => theme.colors.blue1};
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const TimeText = styled(Typography)`
-webkit-text-stroke: 2px ${({ theme }) => theme.colors.white};
color: ${({ theme }) => theme.colors.black};
text-align: center;
white-space: nowrap;
padding: 0.8rem 0;
height: 7rem;
font-size:1.8rem;
margin-top: 2rem;
`;

const TeamCard = styled.div`
  padding: 0;
  width: 100%;
  margin-top: 1rem;
  display: inline-block;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    flex-direction: column;
  }`}
`;

const InfoContent = styled.div`
  display: flex;
  justify-content: space-around;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    flex-direction: column;
  }`}
`;

const TeamText = styled(Typography)`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
`;

const TeamContent = styled(Card)`
  flex: 2;
  overflow: hidden;
`;

const ContentCard = styled(InfoCard)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    align-items: center;
  }`}
`;

const GroupWrapper = styled.div`
  width: 40%;
  min-width: 13.5rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    min-width: 10rem;
  }`}
`;

const TeamImg = styled.img`
  width: 100%;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.colors.white};
`;

const StatsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const StatsItem = styled.div`
  display: flex;
  align-items: center;
`;

const BoostButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const TeamLogo = styled.img<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  filter: drop-shadow(0px 0px 0.6875rem ${({ color }) => color});
  margin: 1rem;
`;

const EthImg = styled.img`
  height: 2rem;
  margin-left: 0.25rem;
`;

const TotalNFTText = styled(Typography)`
  margin-top: 0.00rem;
  margin-bottom: 0.00rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    font-size: 6rem;
  }`}

  ${({ theme }) => `${theme.media_width.upToExtraSmall} {
    font-size: 4rem;
  }`}
`;

const NFTStakedText = styled(Typography)`
  line-height: 3rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    font-size: 4rem;
    line-height: 4rem;
  }`}

  ${({ theme }) => `${theme.media_width.upToExtraSmall} {
    font-size: 3rem;
  }`}
`;

const PointText = styled(Typography)`
  white-space: nowrap;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    font-size: 4rem;
    line-height: 4rem;
  }`}

  ${({ theme }) => `${theme.media_width.upToExtraSmall} {
    font-size: 3rem;
  }`}
`;

const VSWrapper = styled.div`
  text-align: center;
  padding: 0 1rem;
  flex: 1;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    margin-bottom: 2rem;
  }`}
`;

const VSText = styled(Typography)`
  margin-top: -1.2rem;
  margin-bottom: 1rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    margin-top: 3rem;
  }`}
`;

const TeamProgressWrapper = styled(Card)`
  width: 100%;
  margin-top: 2rem;
  padding: 2rem 0;
`;

const TeamProgressBar = styled(ProgressBar)`
  border-radius: 0;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  margin-top: 4rem;
  overflow: hidden;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    flex-direction: column;
    align-items: center;
  }`}
`;

const ListContent = styled.div`
  width: 45%;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    width: 100%;
  }`}
`;

const ListWrapper = styled.div`
  padding: 3rem;
`;

const ButtonList = styled.div<{ secondary?: boolean }>`
  display: flex;
  justify-content: ${({ secondary }) => (secondary ? 'flex-end' : 'flex-start')};
`;

const ListButton = styled(Button)<{ secondary?: boolean }>`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background: ${({ theme }) => theme.colors.red1};
  ${({ secondary }) => (secondary ? `margin-left: 1rem;` : 'margin-right: 1rem;')}
`;

const StatusText = styled(Typography)<{ winning?: boolean }>`
  margin-top: 0.5rem;
  text-align: center;
  color: ${({ theme, winning }) => (winning ? theme.colors.green : theme.colors.grey2)};
`;

const timeDif = 200;
const TeamInfo: React.FC = () => {
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { balance, setMyBattleInfo } = useContract();
  const { theme } = useTheme();

  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData();
  const stakedTokenDatas = useStakedTokenDatas();
  const allowedTokenDatas = useAllowedTokenDatas(false);
  const [receiptType, setReceiptType] = useState<ReceiptType>(ReceiptType.Original);
  const stakePoolEntries = useStakePoolEntries();
  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>([]);
  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>([]);

  const [, setNfts] = useState<any[]>([]);
  // alert props
  const [, setShow] = useState(false);

  // loading props
  const [loading, setLoading] = useState(false);

  const [applyBetModalA, setApplyBetModalA] = useState(false);
  const [applyBetModalB, setApplyBetModalB] = useState(false);
  const [applyStakeModalA, setApplyStakeModalA] = useState(false);
  const [applyStakeModalB, setApplyStakeModalB] = useState(false);
  const [applyUnstakeModal, setApplyUnstakeModal] = useState(false);

  const [totalBetLAmount, setTotalBetLAmount] = useState(0);
  const [totalBetRAmount, setTotalBetRAmount] = useState(0);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [betLAmout, setBetLAmount] = useState(0);
  const [betRAmout, setBetRAmount] = useState(0);
  const [rewardLPotential, setRewardLPotential] = useState(0);
  const [rewardRPotential, setRewardRPotentail] = useState(0);
  const [chanceL, setChanceL] = useState(0);
  const [chanceR, setChanceR] = useState(0);
  const [userDeposit, setUserDeposit] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [betIsClose, setBetIsClose] = useState(false);
  const [betIsClaim, setBetIsClaim] = useState(false);
  const [betResult, setBetResult] = useState(0);

  const [totalLStakedNfts, setTotalLStakedNfts] = useState(0);
  const [totalRStakedNfts, setTotalRStakedNfts] = useState(0);
  const [totalStakedNfts, setTotalStakedNfts] = useState(0);
  const [stakedLNfts, setStakedLNfts] = useState(0);
  const [stakedRNfts, setStakedRNfts] = useState(0);

  const [aNFTs, setANFTs] = useState<any[]>([]);
  const [bNFTs, setBNFTs] = useState<any[]>([]);

  const [tweets, setTweets] = useState<TwitterFeed[]>([]);

  async function initialize() {
    getNfts();
  }

  const selectUnstakedToken = (tk: AllowedTokenData) => {
    if (loading) return
    if (isUnstakedTokenSelected(tk)) {
      setUnstakedSelected(
        unstakedSelected.filter(
          (data) =>
            data.tokenAccount?.account.data.parsed.info.mint.toString() !==
            tk.tokenAccount?.account.data.parsed.info.mint.toString()
        )
      );
    } else {
      setUnstakedSelected([...unstakedSelected, tk]);
    }
  };

  const selectAllUnstakedToken = (tks: AllowedTokenData[]) => {
    if (loading) return
    setUnstakedSelected(tks);
  }

  const selectStakedToken = (tk: StakeEntryTokenData) => {
    if (loading) return
    if (tk.stakeEntry?.parsed.lastStaker.toString() !== wallet.publicKey?.toString()) {
      return;
    }
    if (isStakedTokenSelected(tk)) {
      setStakedSelected(
        stakedSelected.filter((data) => data.stakeEntry?.pubkey.toString() !== tk.stakeEntry?.pubkey.toString())
      );
    } else {
      setStakedSelected([...stakedSelected, tk]);
    }
  };

  const isUnstakedTokenSelected = (tk: AllowedTokenData) =>
    unstakedSelected.some(
      (utk) =>
        utk.tokenAccount?.account.data.parsed.info.mint.toString() ===
        tk.tokenAccount?.account.data.parsed.info.mint.toString()
  );

  const isStakedTokenSelected = (tk: StakeEntryTokenData) =>
    stakedSelected.some(
      (stk) => stk.stakeEntry?.parsed.originalMint.toString() === tk.stakeEntry?.parsed.originalMint.toString()
  );

  async function handleUnstake(all?: boolean) {
    const tokensToUnstake = all ? stakedTokenDatas.data || [] : stakedSelected;
    if (!wallet.connected) {
      notify({ message: `Wallet not connected`, type: 'error' });
      return;
    }
    if (!stakePool) {
      notify({ message: `No stake pool detected`, type: 'error' });
      return;
    }
    if (tokensToUnstake.length <= 0) {
      notify({ message: `Not tokens selected`, type: 'error' });
      return;
    }
    setLoading(true);
    let coolDown = false;
    const txs: (Transaction | null)[] = await Promise.all(
      tokensToUnstake.map(async (token) => {
        try {
          if (!token || !token.stakeEntry) {
            throw new Error('No stake entry for token');
          }
          if (
            stakePool.parsed.cooldownSeconds &&
            !token.stakeEntry?.parsed.cooldownStartSeconds &&
            !stakePool.parsed.minStakeSeconds
          ) {
            notify({
              message: `Cooldown period will be initiated for ${token.metaplexData?.data.data.name} unless minimum stake period unsatisfied`,
              type: 'info',
            });
            coolDown = true;
          }
          return unstake(connection, wallet as Wallet, {
            stakePoolId: stakePool?.pubkey,
            originalMintId: token.stakeEntry.parsed.originalMint,
          });
        } catch (e) {
          notify({
            message: `${e}`,
            description: `Failed to unstake token ${token?.stakeEntry?.pubkey.toString()}`,
            type: 'error',
          });
          return null;
        }
      })
    );
    try {
      await executeAllTransactions(
        connection,
        wallet as Wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: `Successfully ${coolDown ? 'initiated cooldown' : 'unstaked'}`,
            description: 'These tokens are now available in your wallet',
          },
        }
      );
    } catch (e) {
      setLoading(false);
    }
    await Promise.all([stakedTokenDatas.remove(), allowedTokenDatas.remove(), stakePoolEntries.remove()]).then(() =>
      setTimeout(() => {
        stakedTokenDatas.refetch();
        allowedTokenDatas.refetch();
        stakePoolEntries.refetch();
      }, 1000)
    );
    setStakedSelected([]);
    setUnstakedSelected([]);
    setLoading(false);
  }

  async function handleStake(atx: Transaction, all?: boolean) {
    const tokensToStake = all ? allowedTokenDatas.data || [] : unstakedSelected;
    if (!wallet.connected) {
      notify({ message: `Wallet not connected`, type: 'error' });
      return;
    }
    if (!stakePool) {
      notify({ message: `Wallet not connected`, type: 'error' });
      return;
    }
    if (tokensToStake.length <= 0) {
      notify({ message: `Not tokens selected`, type: 'error' });
      return;
    }

    setLoading(true);
    const initTxs: { tx: Transaction; signers: Signer[] }[] = [];
    for (let step = 0; step < tokensToStake.length; step++) {
      try {
        let token = tokensToStake[step];
        if (!token || !token.tokenAccount) {
          throw new Error('Token account not set');
        }

        if (token.tokenAccount?.account.data.parsed.info.tokenAmount.amount > 1 && !token.amountToStake) {
          throw new Error('Invalid amount chosen for token');
        }

        const [initTx, , stakeMintKeypair] = await createStakeEntryAndStakeMint(connection, wallet as Wallet, {
          stakePoolId: stakePool?.pubkey,
          originalMintId: new PublicKey(token.tokenAccount.account.data.parsed.info.mint),
        });
        if (initTx.instructions.length > 0) {
          initTxs.push({
            tx: initTx,
            signers: stakeMintKeypair ? [stakeMintKeypair] : [],
          });
        }
      } catch (e) {
        notify({
          message: `Failed to stake token ${tokensToStake[step]?.stakeEntry?.pubkey.toString()}`,
          description: `${e}`,
          type: 'error',
        });
        setLoading(false);
      }
    }

    if (initTxs.length > 0) {
      try {
        await executeAllTransactions(
          connection,
          wallet as Wallet,
          initTxs.map(({ tx }) => tx),
          {
            signers: initTxs.map(({ signers }) => signers),
            notificationConfig: {
              message: `Successfully staked`,
              description: 'Stake progress will now dynamically update',
            },
          }
        );
      } catch (e) {
        notify({
          message: `Failed to token staking`,
          description: `${e}`,
          type: 'error',
        });
        setLoading(false);
      }
    }
    const txs: (Transaction | null)[] = await Promise.all(
      tokensToStake.map(async (token) => {
        try {
          if (!token || !token.tokenAccount) {
            throw new Error('Token account not set');
          }

          if (token.tokenAccount?.account.data.parsed.info.tokenAmount.amount > 1 && !token.amountToStake) {
            throw new Error('Invalid amount chosen for token');
          }

          if (token.stakeEntry && token.stakeEntry.parsed.amount.toNumber() > 0) {
            throw new Error(
              'Fungible tokens already staked in the pool. Staked tokens need to be unstaked and then restaked together with the new tokens.'
            );
          }

          const amount = token?.amountToStake ? new BN(1) : undefined;
          // stake
          return stake(connection, wallet as Wallet, {
            stakePoolId: stakePool?.pubkey,
            receiptType: !amount || (amount && amount.eq(new BN(1))) ? receiptType : undefined,
            originalMintId: new PublicKey(token.tokenAccount.account.data.parsed.info.mint),
            userOriginalMintTokenAccountId: token.tokenAccount?.pubkey,
            amount: amount,
          });
        } catch (e) {
          notify({
            message: `Failed to unstake token ${token?.stakeEntry?.pubkey.toString()}`,
            description: `${e}`,
            type: 'error',
          });
          return null;
        }
      })
    );
    txs.push(atx);
    try {
      await executeAllTransactions(
        connection,
        wallet as Wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: `Successfully staked`,
            description: 'Stake progress will now dynamically update',
          },
        }
      );
    } catch (e) {}

    await Promise.all([stakedTokenDatas.remove(), allowedTokenDatas.remove(), stakePoolEntries.remove()]).then(() =>
      setTimeout(() => {
        stakedTokenDatas.refetch();
        allowedTokenDatas.refetch();
        stakePoolEntries.refetch();
      }, 1000)
    );
    setStakedSelected([]);
    setUnstakedSelected([]);
    setLoading(false);
    setApplyStakeModalA(false);
    setApplyStakeModalB(false);
  }

  // state change
  useEffect(() => {
    setNfts([]);
    setShow(false);
    if (publicKey) {
      initialize();
    }
  }, [publicKey, connection]);

  const getMetaData = async (tokenAddress: PublicKey) => {
    const con = new Connection('https://metaplex.devnet.rpcpool.com', 'confirmed');
    const metadataPDA = await metaplex.programs.metadata.Metadata.getPDA(tokenAddress);
    const mintAccInfo = await con.getAccountInfo(metadataPDA); // fetch account info
    const metadata = metaplex.programs.metadata.Metadata.from(new metaplex.Account(tokenAddress, mintAccInfo as any));

    return {
      metadata,
      metaPDA: metadataPDA,
    };
  };

  const getNfts = async () => {
    setShow(false);
    const address = publicKey;
    if (!isValidSolanaAddress(address?.toBase58() || '')) {
      setLoading(false);
      setShow(true);
      return;
    }
    let con = connection.rpcEndpoint;
    if (con === 'https://api.devnet.solana.com') {
      con = 'https://metaplex.devnet.rpcpool.com';
    }
    const connect = createConnectionConfig(con);
    setLoading(true);
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress: address?.toBase58() || '',
      connection: connect,
    });
    if (nftArray.length === 0) {
      setLoading(false);
      setShow(true);
      return;
    }

    const metadatas = await fetchMetadata(nftArray);
    const group: {
      TeamA: any[];
      TeamB: any[];
    } = {
      TeamA: [],
      TeamB: [],
    };

    for (const nft of metadatas) {
      // for(const teamAName of aNames) {
      if (nft.data.name.includes('WarriorA')) {
        group.TeamA.push(nft);
        // break;
      }
      // }
      // for(const teamBName of bNames) {
      if (nft.data.name.includes('WarriorB')) {
        group.TeamB.push(nft);
        // break;
      }
      // }
    }
    setANFTs(group.TeamA);
    setBNFTs(group.TeamB);
    setLoading(false);
    setNfts(metadatas);
  };

  const fetchMetadata = async (nftArray: any[]) => {
    const metadatas: any[] = [];
    for (const nft of nftArray) {
      try {
        await fetch(nft.data.uri)
          .then((response) => response.json())
          .then((meta) => {
            metadatas.push({ ...meta, ...nft });
          });
      } catch (error) {
      }
    }
    return metadatas;
  };

  async function stakeA() {
    if (unstakedSelected.length === 0) {
      notify({
        message: 'No tokens selected',
        type: 'error',
      });
    } else {
      const remainingAccounts = [];
      for (const tmp of unstakedSelected) {
        const mintAddr = tmp.metaplexData?.data.mint;
        if(!mintAddr) continue;
        const ra = {
          pubkey: new PublicKey(mintAddr),
          isWritable: false,
          isSigner: false,
        };
        remainingAccounts.push(ra);
      }
      let tx = await _stake(remainingAccounts, 1);
      await handleStake(tx);
      const data = {
        wallet: publicKey?.toString() || '',
      };
      setUserStakeInfo(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function stakeB() {
    if (unstakedSelected.length === 0) {
      notify({
        message: 'No tokens selected',
        type: 'error',
      });
    } else {
      const remainingAccounts = [];
      for (const tmp of unstakedSelected) {
        const mintAddr = tmp.metaplexData?.data.mint;
        if(!mintAddr) continue;
        const ra = {
          pubkey: new PublicKey(mintAddr),
          isWritable: false,
          isSigner: false,
        };
        remainingAccounts.push(ra);
      }

      const tx = await _stake(remainingAccounts, 2);
      await handleStake(tx);
      const data = {
        wallet: publicKey?.toString() || '',
      };
      setUserStakeInfo(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function unstakeA() {
    if (stakedSelected.length === 0) {
      notify({
        message: `No tokens selected`,
        type: 'error',
      });
    } else {
      const remainingAccounts = [];
      for (const obj of stakedSelected) {
        const mintAddr = obj.metaplexData?.data.mint;
        if(!mintAddr) continue;
        const ra = {
          pubkey: new PublicKey(mintAddr),
          isWritable: true,
          isSigner: false,
        };
        remainingAccounts.push(ra);
      }
      //const tx = await _unStake(remainingAccounts, 1);
      await handleUnstake();
      const data = {
        wallet: publicKey?.toString() || '',
      };
      setUserStakeInfo(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function unstakeB() {
    if (stakedSelected.length === 0) {
      notify({
        message: `No tokens selected`,
        type: 'error',
      });
    } else {
      const remainingAccounts = [];
      for (const obj of stakedSelected) {
        const mintAddr = obj.metaplexData?.data.mint;
        if(!mintAddr) continue;
        const ra = {
          pubkey: new PublicKey(mintAddr),
          isWritable: true,
          isSigner: false,
        };
        remainingAccounts.push(ra);
      }
      //const tx = await _unStake(remainingAccounts, 2);
      await handleUnstake();
      const data = {
        wallet: publicKey?.toString() || '',
      };
      setUserStakeInfo(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function updateState() {
    const betInfo = await getBetInfo();
    let bet_tla = 0;
    let bet_tra = 0;
    let nft_tla = 0;
    let nft_tra = 0;
    let fee = 0;
    let sTime = 0;
    let eTime = 0;
    let betWinner = 0;
    let isClose = true;

    let user_bla = 0;
    let user_bra = 0;
    let user_nla = 0;
    let user_nra = 0;
    let user_dep = 0;
    let user_sTime = 0;
    let is_claim = true;
    if(betInfo.betFee) {
      bet_tla = betInfo.totalLAmount / 1000000000;
      bet_tra = betInfo.totalRAmount / 1000000000;
      nft_tla = betInfo?.teamLNfts;
      nft_tra = betInfo?.teamRNfts;
      fee = betInfo.betFee;
      sTime = betInfo.startTime - timeDif;
      eTime = betInfo.endTime - timeDif;
      isClose = betInfo.isClose;
      betWinner = betInfo.winnerResult;
      let scoreL = bet_tla * 250 + nft_tla * 100;
      let scoreR = bet_tra * 250 + nft_tra * 100;
      let totalScore = scoreL + scoreR;
      const chance_l = totalScore > 0 ? scoreL * 100 / totalScore : 0;
      const chance_r = totalScore > 0 ? scoreR * 100 / totalScore : 0;
      setChanceL(chance_l);
      setChanceR(chance_r);
      setTotalLStakedNfts(nft_tla);
      setTotalRStakedNfts(nft_tra);
      setTotalStakedNfts(nft_tla + nft_tra);
      setTotalBetLAmount(bet_tla);
      setTotalBetRAmount(bet_tra);
      setTotalBetAmount(bet_tla+bet_tra);
      setBetResult(betWinner);
      setStartTime(sTime);
      setEndTime(eTime);
      setBetIsClose(isClose);
    }
    const userBetInfo = await getUserBetInfo();
    if(userBetInfo.startTime) {
      user_bla = userBetInfo.betLAmount / 1000000000;
      user_bra = userBetInfo.betRAmount / 1000000000;
      user_dep = userBetInfo.betDeposite / 1000000000;
      user_nla = userBetInfo.userLNfts;
      user_nra = userBetInfo.userRNfts;
      is_claim = userBetInfo.isClaim;
      user_sTime = userBetInfo.startTime - timeDif;
      setBetIsClaim(is_claim);
      setStakedLNfts(user_nla);
      setStakedRNfts(user_nra);
      setMyBattleInfo({
        userBetAmountA: user_bla,
        userBetAmountB: user_bra,
        userNftStakedA: user_nla,
        userNftStakedB: user_nra
      });
      if( sTime === user_sTime) {      
        setBetLAmount(user_bla);
        setBetRAmount(user_bra);
      } else {
        setBetLAmount(0);
        setBetRAmount(0);
        if(isStakedNft() && (user_nla + user_nra) == 0) {
          setApplyUnstakeModal(true);
        }
      }
    }
    if(bet_tla*1) {
      let rewardL = (bet_tla * (1000 - fee) + bet_tra * (1000 - fee) * 9 / 10) / bet_tla / 1000;
      setRewardLPotential(rewardL);
      if(betWinner == 1) {
        let nft_staker_reward = nft_tla > 0 ? bet_tra * (1000 - fee) / nft_tla / 10000 : 0;
        user_dep += rewardL * user_bla + nft_staker_reward * user_nla;
        setUserDeposit(user_dep);
      }
    }
    if(bet_tra*1) {
      let rewardR = (bet_tra * (1000 - fee) + bet_tla * (1000 - fee) * 9 / 10) / bet_tra / 1000;
      setRewardRPotentail(rewardR);
      if(betWinner == 2) {
        let nft_staker_reward = nft_tla > 0 ? bet_tla * (1000 - fee) / nft_tra / 10000 : 0;
        user_dep += rewardR * user_bra + nft_staker_reward * user_nra;
        setUserDeposit(user_dep);
      }
    }
  }

  function isStakedNft() {
    const tokensToUnstake = stakedTokenDatas.data || [] ;
    return tokensToUnstake.length > 0;
  }

  async function withdraw() {
    try {
      await _claimBet();
    } catch (err) {
      console.log(err);
    }
  }

  async function betA(amount: number) {
    try {
      await _bet(false, amount*1000);
      setApplyBetModalA(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function betB(amount: number) {
    try {
      await _bet(true, amount*1000);
      setApplyBetModalB(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function unstakeAll() {
    await handleUnstake(true);
    setApplyUnstakeModal(false);
    window.location.reload();
  }

  const updateTwitterFeeds = async () => {
    try {
      const res = await getTwitterFeeds();
      if (res && res.data && res.data.data) {
        const { data, includes } = res.data.data;
        setTweets(
          data.map((item: any, index: number) => ({
            id: item.id,
            text: item.text,
            createdAt: new Date(item.created_at),
            name: includes.users[index].name,
            username: includes.users[index].username,
            profileImg: includes.users[index].profile_image_url,
          }))
        );
      } else {
        setTweets([]);
      }
    } catch (e) {
      setTweets([]);
    }
  };

  const [nowTime, setNow] = useState(0);
  useEffect(() => {
//    updateTwitterFeeds();
    const timer = setTimeout(() => {setNow(Date.now())}, 5000);
    updateState();
    return () => clearTimeout(timer);
  }, [nowTime]);

  return (
    <>

      <Container>
          <Overview/>
          <Timepanel/>
          <CenterPanel/>
        <TeamCard>
          <Content>
            <TeamContent style={{ textAlign: 'right' }}>
              <TeamText style={{ color: theme.colors.purple1 }} type={TypographyType.BOLD_MEDIUM_LARGE}>
                primates
              </TeamText>
              <ContentCard>
                <GroupWrapper>
                  <TeamImg alt="" src={TeamImg1} />
                </GroupWrapper>

                <div>
                  <TotalNFTText type={TypographyType.BOLD_TITLE}>{rewardLPotential.toFixed(2)}X</TotalNFTText>
                  <TotalNFTText type={TypographyType.BOLD_TITLE}>{chanceL.toFixed(2)}%</TotalNFTText>
                    <StatsWrapper>
                        <StatsItem>
                          <Typography type={TypographyType.REGULAR}>{totalLStakedNfts}</Typography>
                          <TeamLogo alt="" color={theme.colors.purple1} src={TeamImg1} />
                        </StatsItem>
                        <StatsItem>
                          <Typography type={TypographyType.REGULAR}>{totalBetLAmount.toFixed(2)}</Typography>
                          <EthImg alt="" src={EthIcon} />
                        </StatsItem>
                    </StatsWrapper>
                </div>
              </ContentCard>
            </TeamContent>

            <VSWrapper>
            <TimeText type={TypographyType.REGULAR}>
              {endTime > 0 && (
                <Countdown date={endTime * 1000}>
                  <span>{(betResult == 1) ? 'Primates WIN' : (betResult == 2) ? "Trippin’ Ape Tribe WIN" : "EXPIRED"}</span>
                </Countdown>
              )}
            </TimeText>
              <VSText type={TypographyType.BOLD_TITLE}>Reward</VSText>
              <PointText type={TypographyType.BOLD_TITLE}>Chances</PointText>
            </VSWrapper>

            <TeamContent style={{ textAlign: 'left' }}>
              <TeamText style={{ color: theme.colors.blue1 }} type={TypographyType.BOLD_MEDIUM_LARGE}>
                trippin’ ape tribe
              </TeamText>
              <ContentCard style={{ flexDirection: 'row-reverse' }}>
                <GroupWrapper>
                  <TeamImg alt="" src={TeamImg2} />
                </GroupWrapper>

                <div>
                  <TotalNFTText type={TypographyType.BOLD_TITLE}>{rewardRPotential.toFixed(2)}X</TotalNFTText>
                  <TotalNFTText type={TypographyType.BOLD_TITLE}>{chanceR.toFixed(2)}%</TotalNFTText>
                    <StatsWrapper>
                        <StatsItem>
                          <Typography type={TypographyType.REGULAR}>{totalRStakedNfts}</Typography>
                          <TeamLogo alt="" color={theme.colors.blue1} src={TeamImg2} />
                        </StatsItem>
                        <StatsItem>
                          <Typography type={TypographyType.REGULAR}>{totalBetRAmount.toFixed(2)}</Typography>
                          <EthImg alt="" src={EthIcon} />
                        </StatsItem>
                    </StatsWrapper>

                </div>
              </ContentCard>
            </TeamContent>
          </Content>

          <TeamProgressWrapper>
            <TeamProgressBar
              bgColor={theme.colors.blue1}
              fillColor={theme.colors.purple1}
              value={Math.floor(chanceL)}
            />
          </TeamProgressWrapper>
        </TeamCard>
      </Container>

      {/* <ListContainer>
        <ListContent>
          <ListWrapper>
            <ButtonList>
              <ListButton onClick={selectAllA}>Select all</ListButton>
              {aUnstakedNFTs.length <= 0 && Date.now() > betStime*1000 && Date.now() < betEtime*1000 && (
                <ListButton onClick={stakeA} style={{ background: theme.colors.red2 }}>
                  Join
                </ListButton>
              )}
              {aUnstakedNFTs.length > 0 && Date.now() < betEtime*1000 && (
                <ListButton onClick={unstakeA} style={{ background: theme.colors.red2 }}>
                  Unstake
                </ListButton>
              )}
            </ButtonList>
            <NftList
              addRemainings={addRemainingsA}
              loading={loading}
              nfts={aNFTs}
              selectedNfts={aSelectedNFTs}
              stakedNfts={aStakedNFTs}
              unStakedNfts={aUnstakedNFTs}
            />
            {aCounter * 1 > bCounter * 1 && (
              <StatusText type={TypographyType.REGULAR} winning>
                Currently winning
              </StatusText>
            )}
            {aCounter * 1 < bCounter * 1 && (
              <StatusText type={TypographyType.REGULAR}>
                Needs {bCounter * 1 - aCounter * 1} NFT staked to take the lead
              </StatusText>
            )}
          </ListWrapper>
          <TweetList tweets={tweets.filter((item) => item.text.includes('❍'))} />
        </ListContent>

        <ListContent>
          <ListWrapper>
            <ButtonList secondary>
              <ListButton onClick={selectAllB} secondary>
                Select all
              </ListButton>
              {bUnstakedNFTs.length <= 0 && Date.now() > betStime*1000 && Date.now() < betEtime*1000 && (
                <ListButton onClick={stakeB} secondary style={{ background: theme.colors.red2 }}>
                  Join
                </ListButton>
              )}
              {bUnstakedNFTs.length > 0 && Date.now() > betEtime*1000 && (
                <ListButton onClick={unstakeB} secondary style={{ background: theme.colors.red2 }}>
                  Unstake
                </ListButton>
              )}
            </ButtonList>
            <NftList
              addRemainings={addRemainingsB}
              loading={loading}
              nfts={bNFTs}
              secondary
              selectedNfts={bSelectedNFTs}
              stakedNfts={bStakedNFTs}
              unStakedNfts={bUnstakedNFTs}
            />
            {aCounter * 1 < bCounter * 1 && (
              <StatusText type={TypographyType.REGULAR} winning>
                Currently winning
              </StatusText>
            )}
            {aCounter * 1 > bCounter * 1 && (
              <StatusText type={TypographyType.REGULAR}>
                Needs {aCounter * 1 - bCounter * 1} NFT staked to take the lead
              </StatusText>
            )}
          </ListWrapper>
          <TweetList tweets={tweets.filter((item) => item.text.includes('◉'))} />
        </ListContent>
      </ListContainer> */}

      <BetModal
        balance={balance}
        reward={rewardLPotential}
        onBet={betA}
        isBet={!betIsClose && Date.now() > startTime*1000 && Date.now() < endTime*1000}
        onClose={() => setApplyBetModalA(false)}
        teamImg={TeamImg1}
        visible={applyBetModalA}      
        color={theme.colors.white}
      />

      <BetModal
        balance={balance}
        reward={rewardRPotential}
        onBet={betB}
        isBet={!betIsClose && Date.now() > startTime*1000 && Date.now() < endTime*1000}
        onClose={() => setApplyBetModalB(false)}
        teamImg={TeamImg2}
        visible={applyBetModalB}  
        color={theme.colors.white}    
      />

      <StakeModal
        onStake={stakeA}
        loading={loading || !allowedTokenDatas.isFetched}
        onClose={() => setApplyStakeModalA(false)}
        handleSelect={selectUnstakedToken}
        handleSelectAll={selectAllUnstakedToken}
        isStake={!betIsClose && Date.now() > startTime*1000 && Date.now() < endTime*1000}
        unstakedNfts={allowedTokenDatas.data || []}
        stakedNfts={stakedTokenDatas.data || []}
        selectedNfts={unstakedSelected}
        allowedNfts={aNFTs}
        visible={applyStakeModalA}  
        color={theme.colors.white}    
      />

      <StakeModal
        onStake={stakeB}
        loading={loading || !allowedTokenDatas.isFetched}
        onClose={() => setApplyStakeModalB(false)}
        handleSelect={selectUnstakedToken}
        handleSelectAll={selectAllUnstakedToken}
        isStake={!betIsClose && Date.now() > startTime*1000 && Date.now() < endTime*1000}
        unstakedNfts={allowedTokenDatas.data || []}
        stakedNfts={stakedTokenDatas.data || []}
        selectedNfts={unstakedSelected}
        allowedNfts={bNFTs}
        visible={applyStakeModalB}  
        color={theme.colors.white}
      />

      <UnstakeModal
        balance={balance}
        onOk={unstakeAll}
        onClose={() => setApplyUnstakeModal(false)}
        teamImgL={TeamImg1}
        teamImgR={TeamImg2}
        visible={applyUnstakeModal}  
        color={theme.colors.white}    
      />
    </>
  );
};

export default TeamInfo;
