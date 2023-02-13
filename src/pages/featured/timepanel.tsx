/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '../../components/common/button';
import Input from '../../components/common/input';
// import Card from '../../components/common/card';
import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import { Typography, TypographyType } from '../../components/common/typography';


function TimePanel() {
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const Container = styled.div`
  position: relative;
  margin-bottom: 7rem;
`;

const Title = styled(Typography)`
  margin-bottom: 0.5rem;
`;
const Flex = styled.div`
display : flex;
`
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
  margin-left:12em

`;
const InfoWrapper_1 = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  margin: 0.5rem 0;
  min-width: 10rem;
  margin-left:-4.5em
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
  font-size : 1.5rem;
  margin-top : 2rem;
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
const InfoLine = styled.div`
  width: 0.25rem;
  height: 11rem;
  margin: 1rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  margin-top:-1rem
`;

interface IOverviewInfo {
}

const BoostButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;
const MyLabel: React.FC<IOverviewInfo> = () => (
  <InfoWrapper>
      <InfoText type={TypographyType.REGULAR}>Start Date</InfoText>
      <InfoText type={TypographyType.REGULAR}>End Date</InfoText>
  </InfoWrapper>
);
const DatePanel: React.FC<IOverviewInfo> = () => (
  <InfoWrapper_1>
      <Input  style={{marginTop:10}}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Select StartDate"
          type="datetime-local"
      />
      <Input style={{marginTop:10}}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Select EndDate"
          type="datetime-local"
      />
  </InfoWrapper_1>
);
return  (<Container>
      <OverviewWrapper  style = {{paddingBottom:5}}>
          <MyLabel  />
          <DatePanel  />
          <InfoLine />
           <GroupWrapper>
              <BoostButton style = {{marginTop:25}}  >Start</BoostButton>
              <BoostButton  style = {{marginTop:25}} >End</BoostButton>
           </GroupWrapper>

      </OverviewWrapper>
        </Container>);
  
}
export default TimePanel;
