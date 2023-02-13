import React from 'react';

import styled from 'styled-components';

import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import { Typography, TypographyType } from '../../components/common/typography';

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

const InfoLine = styled.div`
  width: 0.25rem;
  height: 9rem;
  margin: 1rem 2rem;
  background: ${({ theme }) => theme.colors.white};
`;

interface IOverviewInfo {
  title: string;
  content: string;
}

const OverviewInfo: React.FC<IOverviewInfo> = ({ title, content }) => (
  <InfoWrapper>
    <InfoDetailCard>
      <InfoText type={TypographyType.BOLD_TITLE}>{content}</InfoText>
    </InfoDetailCard>
    <InfoTitle type={TypographyType.REGULAR}>{title}</InfoTitle>
  </InfoWrapper>
);

const Overview: React.FC = () => (
  <Container>
    <Title type={TypographyType.BOLD_TITLE}>Total $GLORY</Title>

    <OverviewWrapper>
      <OverviewInfo content="2,293 K" title="Grand Total" />
      <InfoSymbol type={TypographyType.BOLD_TITLE}>=</InfoSymbol>
      <OverviewInfo content="1,833 K" title="Staked" />
      <InfoSymbol type={TypographyType.BOLD_TITLE}>+</InfoSymbol>
      <OverviewInfo content="745 K" title="Minted" />
      <InfoSymbol type={TypographyType.BOLD_TITLE}>-</InfoSymbol>
      <OverviewInfo content="285 K" title="Burned" />
      <InfoLine />
      <OverviewInfo content="42,234" title="Total players" />
    </OverviewWrapper>
  </Container>
);

export default Overview;
