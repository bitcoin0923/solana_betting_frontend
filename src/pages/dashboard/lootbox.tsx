/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-empty */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';
import { toast } from 'react-toastify';

import { createConnectionConfig, getParsedNftAccountsByOwner, isValidSolanaAddress } from '@nfteyez/sol-rayz';
import { AnchorProvider,BN } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import axios from 'axios';
import styled from 'styled-components';

import MedalIcon from '../../assets/images/medal.svg';
import Button from '../../components/common/button';
import Card from '../../components/common/card';
import Table from '../../components/common/table';
import { Typography, TypographyType } from '../../components/common/typography';
import LootModal from '../../components/modals/loot_modal';
import { useContract } from '../../contexts/contract_context';
import { lootboxMetadataUrl, mintNFT, openLootBox } from '../../contracts/lootbox/utils';
import { HISTORY_DATA } from '../../mocks/history';
import { getRandomLoot, shadowMint } from '../../services/TutorialService';

const Container = styled.div`
  position: relative;
  margin-bottom: 7rem;
  display: flex;
  justify-content: center;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    display: block;
  }`}
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const HistoryTable = styled(Table)`
  width: 100%;
  height: 31rem;
`;

const BattleText = styled.div`
  text-align: right;
  white-space: nowrap;
`;

const WonText = styled.span<{ won: boolean }>`
  color: ${({ theme, won }) => (won ? theme.colors.green : theme.colors.red1)};
  white-space: nowrap;
`;

const MedalWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.green};
`;

const MedalImage = styled.img`
  height: 2.5rem;
  margin-right: 0.5rem;
`;

const LootboxCard = styled(Card)`
  flex: 1;
  height: 31rem;
`;

const MintWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ShadowRequiredText = styled(Typography)`
  text-decoration: underline;
  margin-bottom: 0.75rem;
`;

const LootboxList = styled.div`
  border-radius: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 17rem;
  background: ${({ theme }) => theme.colors.black};
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`;

const LootboxItem = styled.img<{ selected?: boolean }>`
  width: 80px;
  height: 80px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  ${({ theme, selected }) => selected && `border: 1px solid ${theme.colors.green};`}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  > button {
    margin-right: 1rem;
    flex: 1;
    white-space: nowrap;
  }
`;

const SelectAllButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white};
`;

const Lootbox: React.FC = () => {
  const columns: Column[] = useMemo(
    () => [
      {
        accessor: 'battle',
        width: 120,
        Cell: ({ value }) => <BattleText>{value}</BattleText>,
      },
      {
        accessor: 'won',
        width: 80,
        Cell: ({ value }) => <WonText won={value}>{value ? 'you won' : 'you lost'}</WonText>,
      },
      {
        Header: 'medal',
        width: 120,
        accessor: (value: any) =>
          value.won && (
            <MedalWrapper>
              <MedalImage alt="" src={MedalIcon} />
              <span>buy medal</span>
            </MedalWrapper>
          ),
      },
    ],
    []
  );

  const { publicKey } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { balance, updateBalance } = useContract();

  const [fetchedNfts, setFetchedNfts] = useState<any[]>([]);
  const [lootList, setLootList] = useState<any[]>([]);
  const [selectedLootboxes, setSelectedLootboxes] = useState<any[]>([]);
  const [kageRequired, setKageRequired] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openPrice = 5;

  useEffect(() => {
    if (publicKey && connection) {
      getNfts();
    } else {
      setFetchedNfts([]);
    }
  }, [publicKey, connection]);

  const getNfts = async () => {
    if (!publicKey) {
      return;
    }

    const address = publicKey?.toBase58();
    if (!isValidSolanaAddress(address)) {
      return;
    }

    const connect = createConnectionConfig(connection.rpcEndpoint);

    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress: address,
      connection: connect,
    });

    if (nftArray.length > 0) {
      await fetchMetadata(nftArray);
    }
  };

  const fetchMetadata = async (nftArray: any[]) => {
    const tmpFetchedNfts = [];
    for (const nft of nftArray) {
      if (nft.data.symbol === 'Lootbox') {
        try {
          const res = await axios.get(nft.data.uri);
          tmpFetchedNfts.push({ ...res.data, ...nft });
        } catch (error) {
          console.log(error);
        }
      }
    }
    setFetchedNfts(tmpFetchedNfts);
  };

  const getProvider = async () => {
    const network = 'https://metaplex.devnet.rpcpool.com';
    const _connection = new Connection(network, 'processed');
    const provider = new AnchorProvider(_connection, wallet as any, {
      preflightCommitment: 'processed',
    });
    return provider;
  };

  const mintLootbox = async () => {
    const provider = await getProvider();
    try {
      await mintNFT(provider, wallet, lootboxMetadataUrl);
      getNfts();
    } catch (e) {}
  };

  const selectLootBox = async (metadata: any) => {
    const boxes = [...selectedLootboxes];
    if (boxes.filter((e) => e.mint === metadata.mint).length === 0) {
      boxes.push(metadata);
    } else {
      boxes.splice(
        boxes.findIndex((e) => e.mint === metadata.mint),
        1
      );
    }
    setKageRequired(boxes.length * openPrice);
    setSelectedLootboxes(boxes);
  };

  const handleOpen = async () => {
    if (!loading) {
      setLoading(true);
      if (selectedLootboxes.length === 0) {
        toast.warn('please select lootbox');
        setLoading(false);
        return;
      }
      if (balance < 5 * selectedLootboxes.length) {
        toast.warn("You don't have enough $GLORY token");
        setLoading(false);
        return;
      }
      if (kageRequired > balance) {
        toast.warn('Kage required exceed your $GLORY balance');
        setLoading(false);
        return;
      }
      const provider = await getProvider();
      const kageAmount = new BN(1e9 * openPrice);
      const tx = await openLootBox(provider, wallet, selectedLootboxes, kageAmount);
      if (tx) {
        getNfts();
        setSelectedLootboxes([]);
        setLootList([]);
        setIsOpen(true);
        getRandomLoot({
          lootboxAddresses: selectedLootboxes,
          walletPubkey: wallet.publicKey,
        })
          .then((res: any) => {
            setLootList(res.data.mintedLoots);
            setLoading(false);
            setKageRequired(0);
          })
          .catch((err: any) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        toast.error('transaction was failed.');
        setLoading(false);
      }
    }
  };

  const onSelectAll = () => {
    setKageRequired(fetchedNfts.length * openPrice);
    setSelectedLootboxes(fetchedNfts);
  };

  const onBuyKage = () => {
    const data = {
      wallet: wallet.publicKey?.toString() || '',
    };
    shadowMint(data)
      .then(async () => {
        toast('Mint Success!!!');
        updateBalance();
      })
      .catch((e) => {
        toast.warn(`fail: ${e}`);
      });
  };

  return (
    <Container>
      <Content>
        <Title type={TypographyType.BOLD_TITLE}>Past History</Title>
        <HistoryTable columns={columns} data={HISTORY_DATA} hideHeader itemSize="4rem" />
      </Content>

      <div style={{ minWidth: '2rem', minHeight: '2rem' }} />

      <Content>
        <Title type={TypographyType.BOLD_TITLE}>Claim LOOTBOX</Title>
        <LootboxCard>
          <MintWrapper>
            <ShadowRequiredText type={TypographyType.REGULAR}>$GLORY: {balance}</ShadowRequiredText>
            <Button onClick={onBuyKage}>Mint $GLORY</Button>
          </MintWrapper>
          <ShadowRequiredText type={TypographyType.REGULAR}>Total $GLORY to open: {kageRequired}</ShadowRequiredText>

          <LootboxList>
            {fetchedNfts.map((nft, key) => (
              <LootboxItem
                alt=""
                key={key}
                onClick={() => selectLootBox(nft)}
                selected={selectedLootboxes.findIndex((e) => e.mint === nft.mint) > -1}
                src={nft.image}
              />
            ))}
          </LootboxList>

          <ButtonWrapper>
            <SelectAllButton onClick={onSelectAll}>Select all</SelectAllButton>
            <Button onClick={handleOpen}>Open</Button>
            <Button onClick={mintLootbox}>Mint Lootbox</Button>
          </ButtonWrapper>
        </LootboxCard>
      </Content>

      <LootModal loading={loading} lootList={lootList} onClose={() => setIsOpen(false)} visible={isOpen} />
    </Container>
  );
};

export default Lootbox;
