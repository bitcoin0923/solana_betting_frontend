/* eslint-disable */
import { useState } from 'react';

import { Modal } from 'antd';
import styled from 'styled-components';
import EthIcon from '../../assets/images/sol_icon.png';
import Button from '../common/button';
import Input from '../common/input';
import { Typography, TypographyType } from '../common/typography';

const ModalWrapper = styled(Modal)`
  color: ${({ theme }) => theme.colors.text1};
  border-radius: 12px;
  overflow: hidden;

  .ant-modal-content {
    background-color: ${({ theme }) => theme.colors.grey1};

    .ant-modal-close {
      color: ${({ theme }) => theme.colors.white};
    }

    .ant-modal-header {
      background: transparent;
    }

    .ant-modal-body {
      padding: 3rem;
      background: radial-gradient(
        50% 50% at 50.01% 50.01%,
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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  width: 100%;
`;

const TeamLogo = styled.img<{ color: string }>`
  width: 8rem;
  height: 8rem;
  border-radius: 0.75rem;
  filter: drop-shadow(0px 0px 0.6875rem ${({ color }) => color});
`;

const BalanceWrapper = styled.div<{ color: string }>`
  flex: 1;
  height: 8rem;
  border: 2px solid ${({ color }) => color};
  border-radius: 0.75rem;
  filter: drop-shadow(0px 0px 0.6875rem ${({ color }) => color});
  margin-left: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

const BalanceImg = styled.img`
  height: 4rem;
`;

const BetButton = styled(Button)`
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 70%;
`;

const StatsWrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
`;

interface IBoostModal {
  visible: boolean;
  onClose: () => void;
  balance: number;
  reward: number;
  isBet: boolean;
  color: string;
  onBet: (amount: number) => void;
  teamImg: any;
}

const BetModal: React.FC<IBoostModal> = ({ visible, onClose, balance, color, reward, isBet, onBet, teamImg }) => {
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStakeMax = () => {
    setStakeAmount(balance.toFixed(2));
  };

  return (
    <ModalWrapper centered closable footer={null} onCancel={onClose} title={
      <HeaderWrapper>
        <Typography type={TypographyType.REGULAR}>BET With Sol</Typography>
      </HeaderWrapper>
    } visible={visible} width="60rem">
      <Wrapper>
        <TeamLogo alt="" color={color} src={teamImg} />
        <BalanceWrapper color={color}>
          <BalanceImg alt="" src={EthIcon} />
          <div style={{ marginRight: '2rem' }}>
            <Typography color={color} style={{ lineHeight: '3rem' }} type={TypographyType.BOLD_SUBTITLE}>
              {balance.toLocaleString()} SOL
            </Typography>
            <Typography type={TypographyType.REGULAR}>in-wallet balance</Typography>
          </div>
        </BalanceWrapper>
      </Wrapper>
      <Input
        disabled={!isBet}
        onChange={(e) => setStakeAmount(e.target.value)}
        onMax={handleStakeMax}
        placeholder={balance.toLocaleString()}
        point={balance}
        style={{ width: '100%' }}
        type="number"
        value={stakeAmount}
      />

      <StatsWrapper>
        <Typography type={TypographyType.REGULAR}>reward potential</Typography>
        <Typography type={TypographyType.REGULAR}>{reward.toFixed(2)}x</Typography>
      </StatsWrapper>

      <BetButton
        color={color}
        disabled={
          !isBet ||
          Number.isNaN(Number(stakeAmount)) ||
          Number(stakeAmount) <= 0 ||
          Number(stakeAmount) > balance
        }
        onClick={() => onBet(Math.min(Number(stakeAmount), balance))}
      >
       Bet
      </BetButton>

      <Typography color={color} type={TypographyType.REGULAR}>
        if you lose you will earn 3000 BP
      </Typography>
      <Typography style={{ textTransform: 'uppercase' }} type={TypographyType.REGULAR}>
        find out more about bp <a>here</a>
      </Typography>

    </ModalWrapper>
  );
};

export default BetModal;
