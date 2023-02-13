import { useState } from 'react';

import { Modal } from 'antd';
import styled from 'styled-components';

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

    .ant-modal-body {
      padding: 3rem;
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 2rem;
`;

const RowTitle = styled(Typography)`
  text-align: left;
  text-decoration: underline;
`;

const RowValue = styled(Typography)`
  text-align: right;
`;

const TeamImage = styled.img`
  width: 30%;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.colors.white};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.black};
  border-radius: 12px;
  padding: 1rem 2rem;
  margin: 1rem 0;
  position: relative;
`;

const InputTitle = styled(Typography)`
  width: 20%;
`;

const CustomInput = styled(Input)`
  width: 40%;
`;

const BoostButton = styled(Button)`
  width: 20%;
`;

const InputValue = styled(Typography)`
  width: 10%;
  text-align: right;
`;

const Description = styled(Typography)`
  color: ${({ theme }) => theme.colors.grey2};
`;

interface IBoostModal {
  visible: boolean;
  onClose: () => void;
  balance: number;
  earned: number;
  onStake: (amount: number) => void;
  onBurn: (amount: number) => void;
  teamImg: any;
}

const BoostModal: React.FC<IBoostModal> = ({ visible, onClose, balance, earned, onStake, onBurn, teamImg }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const totalAmount = balance + earned;

  const handleStakeMax = () => {
    setStakeAmount(Math.round(totalAmount).toString());
  };

  const handleBurnMax = () => {
    setBurnAmount(Math.round(totalAmount).toString());
  };

  return (
    <ModalWrapper centered closable footer={null} onCancel={onClose} title="" visible={visible} width="60rem">
      <Typography type={TypographyType.BOLD_TITLE}>BOOST with $GLORY</Typography>

      <Content>
        <div style={{ width: '60%' }}>
          <Row>
            <RowTitle type={TypographyType.REGULAR}>In Wallet</RowTitle>
            <RowValue type={TypographyType.REGULAR}>{balance.toLocaleString()}</RowValue>
          </Row>
          <Row>
            <RowTitle type={TypographyType.REGULAR}>Earned</RowTitle>
            <RowValue type={TypographyType.REGULAR}>{Math.round(earned).toLocaleString()}</RowValue>
          </Row>
          <Row style={{ marginTop: '4rem' }}>
            <RowTitle style={{ textDecoration: 'none' }} type={TypographyType.REGULAR}>
              Total
            </RowTitle>
            <RowValue type={TypographyType.REGULAR}>{Math.round(totalAmount).toLocaleString()}</RowValue>
          </Row>
        </div>

        <TeamImage alt="" src={teamImg} />
      </Content>

      <InputWrapper>
        <InputTitle type={TypographyType.BOLD_TITLE}>Stake</InputTitle>
        <CustomInput
          onChange={(e) => setStakeAmount(e.target.value)}
          onMax={handleStakeMax}
          placeholder={Math.round(totalAmount).toString()}
          type="number"
          value={stakeAmount}
        />
        <BoostButton
          disabled={Number.isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0 || Number(stakeAmount) > totalAmount}
          onClick={() => onStake(Math.min(Number(stakeAmount), balance))}
        >
          Stake
        </BoostButton>
        <InputValue type={TypographyType.REGULAR}>{((Number(stakeAmount) || 0) * 1).toLocaleString()}</InputValue>
      </InputWrapper>

      <InputWrapper>
        <InputTitle type={TypographyType.BOLD_TITLE}>Burn*</InputTitle>
        <CustomInput
          onChange={(e) => setBurnAmount(e.target.value)}
          onMax={handleBurnMax}
          placeholder={(Math.round(totalAmount) * 1).toString()}
          type="number"
          value={burnAmount}
        />
        <BoostButton
          disabled={Number.isNaN(Number(burnAmount)) || Number(burnAmount) <= 0 || Number(burnAmount) > totalAmount}
          onClick={() => onBurn(Math.min(Number(burnAmount), balance))}
        >
          Burn
        </BoostButton>
        <InputValue type={TypographyType.REGULAR}>{((Number(burnAmount) || 0) * 2).toLocaleString()}</InputValue>
      </InputWrapper>

      <Content style={{ alignItems: 'flex-start' }}>
        <Description type={TypographyType.REGULAR_SMALL}>*Double points toward team and Dashboard score</Description>
        {/* {isExpired && <Button onClick={onClaimAll}>Claim All</Button>} */}
      </Content>
    </ModalWrapper>
  );
};

export default BoostModal;
