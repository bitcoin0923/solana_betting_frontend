/* eslint-disable */
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import TeamImg1 from '../../assets/images/team1.png';
import Button from '../../components/common/button';
import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import { Typography, TypographyType } from '../../components/common/typography';
import BetModal from '../../components/modals/bet_modal';
import { useTheme } from '../../contexts/theme_context';
import { _bet } from '../../contracts/alphabets/utils';

function Overview(){

const Container = styled.div`
  position: relative;
  margin-bottom: 7rem;
`;

const Title = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const OverviewWrapper = styled(Card)`
  width: 100%;
  display: flex;
  justify-content: center;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    flex-wrap: wrap;
  }`}
`;
  const { theme } = useTheme();

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  margin: 0.5rem 0;
  min-width: 10rem;
`;

const InfoDetailCard = styled(InfoCard)`
  width: 100%;
  height: 6rem;
  margin-bottom: 1rem;
`;

const InfoTitle = styled(Typography)`
  text-align: center;
`;

const InfoText = styled(Typography)`
  white-space: nowrap;
`;

const InfoSymbol = styled(Typography)`
  width: 3rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GroupWrapper = styled.div`
  width: 20%;
  min-width: 13.5rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    min-width: 10rem;
  }`}
`;
const BoostButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;
const InfoLine = styled.div`
  width: 0.25rem;
  height: 11rem;
  margin: 1rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  margin-top:-1rem
`;

interface IOverviewInfo {
  title: string;
  content: string;
}

const [applyBetModalA, setApplyBetModalA] = useState(false);
const [balance,setBalance] = useState(0);
const [rewardLPotential,setBewardLPotential] = useState(0);
const [betIsClose, setBetIsClose] = useState(false);
const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
 
const OverviewInfo: React.FC<IOverviewInfo> = ({ title, content }) => (
  <InfoWrapper>
    <InfoDetailCard>
      <InfoText type={TypographyType.BOLD_TITLE}>{content}</InfoText>
    </InfoDetailCard>
    <InfoTitle type={TypographyType.REGULAR}>{title}</InfoTitle>
  </InfoWrapper>
);
  async function betA(amount: number) {
    try {
      await _bet(false, amount*1000);
      setApplyBetModalA(false);
    } catch (err) {
      console.log(err);
    }
  }

  return(
  <Container>
    <OverviewWrapper  style = {{paddingBottom:0}}>
      <OverviewInfo content="2,293 K" title="Vaoult Total" />
      <InfoSymbol type={TypographyType.BOLD_TITLE}>=</InfoSymbol>
      <OverviewInfo content="1,833 K" title="Betted" />
      <InfoSymbol type={TypographyType.BOLD_TITLE}>+</InfoSymbol>
      <OverviewInfo content="745 K" title="Remain" />
      <InfoLine />
       <GroupWrapper>
          <BoostButton onClick={() => setApplyBetModalA(true)} >Deposit</BoostButton>
          <BoostButton >Widraw</BoostButton>
        </GroupWrapper>

    </OverviewWrapper>
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
  </Container>
);
}

export default Overview;
