/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import styled from 'styled-components';

import LogoIcon1 from '../../assets/images/logo2.png';
import Button from '../../components/common/button';
import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import DefaultProgressBar from '../../components/common/progress_bar';
import { Typography, TypographyType } from '../../components/common/typography';
import { useTheme } from '../../contexts/theme_context';

const Container = styled.div`
  position: relative;
  margin-bottom: 7rem;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    display: block;
  }`}
`;

const Title = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const DashboardSection = styled.div`
  width: 60%;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    width: 100%;
  }`}
`;

const PointsCard = styled(Card)`
  width: 100%;
  height: 17rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    height: auto;
  }`}
`;

const InfoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;

const InfoDetailCard = styled(InfoCard)`
  width: 100%;
  height: 6rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  white-space: nowrap;
`;

const MyRankCard = styled(InfoCard)`
  width: 100%;
  height: 11rem;
  margin-top: 2rem;
  padding: 1rem 4rem;
  border: 1px solid ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  text-align: center;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    height: auto;
  }`}
`;

const InfoTitle = styled(Typography)`
  text-align: center;
  white-space: nowrap;
`;

const InfoSymbol = styled(Typography)`
  width: 3rem;
  height: 6rem;
  margin-top: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const BalanceLogo = styled.img`
  height: 1.5rem;
  margin-right: 0.5rem;
`;

const LootBoxSection = styled.div`
  width: calc(40% - 2rem);
  margin-left: 2rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    width: 100%;
    margin-left: 0;
    margin-top: 2rem;
  }`}
`;

const ProgressCard = styled(Card)`
  width: 100%;
  height: 30rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    height: auto;
  }`}
`;

const ProgressTitle = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.colors.red3};
  font-size: 2.8rem;
  text-transform: uppercase;
  margin-bottom: 1rem;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    white-space: normal;
  }`}
`;

const ProgressWrapper = styled.div`
  text-align: left;
  width: 16rem;
  margin-left: 2rem;
`;

const ProgressRed = styled.span`
  color: ${({ theme }) => theme.colors.red3};
`;

const ProgressBar = styled(DefaultProgressBar)`
  width: 100%;
  margin-top: 0.5rem;
  min-height: 2rem;
`;

const BoostButton = styled(Button)`
  width: 60%;
  margin-top: 1rem;
`;

const EndInText = styled(Typography)`
  color: ${({ theme }) => theme.colors.grey2};
  margin-top: 1rem;
`;

const UnderlineText = styled.span`
  text-decoration: underline;
`;

interface IPointInfo {
  title: string;
  content: string;
}

const PointInfo: React.FC<IPointInfo> = ({ title, content }) => (
  <InfoWrapper>
    {title && <InfoTitle type={TypographyType.REGULAR}>{title}</InfoTitle>}
    <InfoDetailCard>
      <Typography type={TypographyType.BOLD_TITLE}>{content}</Typography>
    </InfoDetailCard>
  </InfoWrapper>
);

const MyDashboard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Container>
      <Content>
        <DashboardSection>
          <Title type={TypographyType.BOLD_TITLE}>MY DASHBOARD</Title>
          <PointsCard>
            <Flex>
              <PointInfo content="7,209" title="Total Points" />
              <InfoSymbol type={TypographyType.BOLD_TITLE}>=</InfoSymbol>
              <PointInfo content="5,833" title="From Staking" />
              <InfoSymbol type={TypographyType.BOLD_TITLE}>+</InfoSymbol>
              <PointInfo content="1,376" title="From Burning*" />
            </Flex>

            <BalanceWrapper>
              <Button>Claim</Button>
              <BalanceWrapper style={{ marginLeft: '2rem' }}>
                <BalanceLogo alt="" src={LogoIcon1} />
                <Typography type={TypographyType.BOLD_SUBTITLE}>{84}</Typography>
              </BalanceWrapper>
            </BalanceWrapper>
          </PointsCard>

          <MyRankCard>
            <div>
              <Typography type={TypographyType.REGULAR}>My rank</Typography>
              <Typography type={TypographyType.BOLD_LARGE}>54</Typography>
            </div>
            <ProgressWrapper>
              <EndInText style={{ marginTop: '1rem' }} type={TypographyType.REGULAR_SMALL}>
                To the next rank:
              </EndInText>
              <ProgressBar bgColor={theme.colors.grey2} fillColor={theme.colors.red2} text="74 remaining" value={80} />
            </ProgressWrapper>
          </MyRankCard>
        </DashboardSection>

        <LootBoxSection>
          <Title type={TypographyType.BOLD_TITLE}>weekly loot</Title>
          <ProgressCard>
            <div style={{ width: '100%' }}>
              <ProgressTitle type={TypographyType.BOLD_TITLE}>you're not qualified</ProgressTitle>

              <Typography type={TypographyType.REGULAR}>
                Need to be in the top 50% of all stakers to qualify.
                <br />
                Your place <ProgressRed>156 out of 222</ProgressRed>.
              </Typography>

              <ProgressBar
                bgColor={theme.colors.grey2}
                fillColor={theme.colors.red2}
                text="you need 332 points"
                value={60}
              />
            </div>

            <BoostButton>BOOST</BoostButton>

            <EndInText type={TypographyType.REGULAR_SMALL}>
              <UnderlineText>Ends In:</UnderlineText> 10 hr 23 min 38 sec
            </EndInText>
          </ProgressCard>
        </LootBoxSection>
      </Content>
    </Container>
  );
};

export default MyDashboard;
