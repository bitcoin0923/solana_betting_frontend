/* eslint-disable */
import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import styled from 'styled-components';

import Button from '../common/button';
import { Typography, TypographyType } from '../common/typography';
import NftList from '../../pages/featured/nft_list';
import { AllowedTokenData } from '../../hooks/useAllowedTokenDatas';

const ModalWrapper = styled(Modal)<{ color: string }>`
  color: ${({ theme }) => theme.colors.text1};
  overflow: hidden;

  .ant-modal-content {
    border: 0.25rem solid ${({ color }) => color};
    border-radius: 0.75rem;
    // box-shadow: 0px 0px 1rem ${({ color }) => color};
    background-color: ${({ theme }) => theme.colors.grey1};

    .ant-modal-close {
      color: ${({ theme }) => theme.colors.white};
      top: 5px;

      .ant-modal-close-x {
        font-size: 24px;
      }
    }

    .ant-modal-header {
      background: transparent;
      border-bottom: 1px solid ${({ color }) => color};
    }

    .ant-modal-body {
      padding: 2rem;
      background: radial-gradient(
        50% 50% at 50.01% 50.01%,
        ${({ color }) => `${color}40`} 0%,
        ${({ color }) => `${color}20`} 50%,
        ${({ color }) => `${color}00`} 100%
      );
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;

  button {
    flex: 1;
  }
`;

interface IStakeModal {
  visible: boolean;
  onClose: () => void;
  color: string;
  loading: boolean;
  isStake: boolean;
  allowedNfts: any[];
  handleSelect: (item: AllowedTokenData) => void
  handleSelectAll: (items: AllowedTokenData[]) => void
  stakedNfts: any[];
  unstakedNfts: any[];
  selectedNfts: AllowedTokenData[];
  onStake: () => void;
}

const StakeModal: React.FC<IStakeModal> = ({ visible, onClose, color, loading, isStake, stakedNfts, selectedNfts, handleSelect, handleSelectAll, allowedNfts, unstakedNfts, onStake }) => {

  useEffect(() => {
  }, [allowedNfts, unstakedNfts, stakedNfts]);

  const selectAll = () => {
    const unstaked_nfts = unstakedNfts.filter((tk): tk is any => isAllowed(tk));
    handleSelectAll(unstaked_nfts);
  };

  const isSelected = (_nft: any) => {
    return selectedNfts.findIndex((tk) => tk.metaplexData?.data.mint === _nft.metaplexData?.data.mint) > -1;
  }

  const isAllowed = (item: any) => {
    if(allowedNfts.length > 0)
      return allowedNfts.findIndex((tk) => tk.mint === item.metaplexData?.data.mint) > -1;
    else return false;
  }

  return (
    <ModalWrapper
      centered
      color={color}
      footer={null}
      onCancel={() => !loading && onClose()}
      title={
        <HeaderWrapper>
          <Typography type={TypographyType.REGULAR}>Stake</Typography>
        </HeaderWrapper>
      }
      visible={visible}
      width="53rem"
    >
      <NftList
        selectItem={handleSelect}
        loading={loading}
        unstakedNfts={unstakedNfts.filter((tk): tk is any => isAllowed(tk))}
        stakedNfts={stakedNfts.filter((tk): tk is any => isAllowed(tk))}
        isSelected={isSelected}
      />

      <ButtonWrapper>
        <Button color={color} disabled={loading || !isStake} onClick={selectAll}>
        {loading ? 'Loading...' : 'Select All'}
        </Button>
        <div style={{ minWidth: '2rem' }} />
        <Button
          color={color}
          disabled={loading || !isStake}
          onClick={onStake}
        >
          {loading ? 'Loading...' : 'Stake'}
        </Button>
      </ButtonWrapper>
    </ModalWrapper>
  );
};

export default StakeModal;
