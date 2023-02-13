/* eslint-disable */
import styled from 'styled-components';

import { Typography, TypographyType } from '../../components/common/typography';

const Container = styled.div<{ secondary?: boolean }>`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.grey3};
  ${({ secondary }) => (secondary ? 'border-top-right-radius: 0;' : 'border-top-left-radius: 0;')}
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 25rem;
  background: ${({ theme }) => theme.colors.black};
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`;

const NftItem = styled.div<{ selected?: boolean; staked?: boolean }>`
  width: 10rem;
  height: 10rem;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 3px solid
    ${({ theme, selected, staked }) =>
      selected ? theme.colors.green : staked ? theme.colors.red1 : theme.colors.grey1};
  cursor: pointer;
  margin: 0.5rem;
`;

const NftImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

interface INftList {
  secondary?: boolean;
  loading: boolean;
  unstakedNfts: any[];
  stakedNfts: any[];
  isSelected: (_nft: any) => boolean;
  selectItem: (_nft: any) => void;
}

const NftList: React.FC<INftList> = ({
  secondary,
  loading,
  unstakedNfts,
  stakedNfts,
  isSelected,
  selectItem,
}) => (
  <Container secondary={secondary}>
    {(
      stakedNfts.map((metadata, index) => (
        <NftItem
          key={index}
          onClick={() => {}}
          selected={false}
          staked={true}
        >
          <NftImage alt={metadata?.metadata.data.name} src={metadata?.metadata.data.image} />
        </NftItem>
      ))
    )}
    {(
      unstakedNfts.map((metadata, index) => (
        <NftItem
          key={index}
          onClick={() => selectItem(metadata)}
          selected={isSelected(metadata)}
          staked={false}
        >
          <NftImage alt={metadata?.metadata.data.name} src={metadata?.metadata.data.image} />
        </NftItem>
      ))
    )}
  </Container>
);

export default NftList;
