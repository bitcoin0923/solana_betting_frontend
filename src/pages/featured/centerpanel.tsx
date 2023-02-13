/* eslint-disable */
import styled from 'styled-components';

import Button from '../../components/common/button';
import Input from '../../components/common/input';
// import Card from '../../components/common/card';
import Card from '../../components/common/card';
import InfoCard from '../../components/common/info_card';
import { Typography, TypographyType } from '../../components/common/typography';


function CenterPanel() {
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
  margin-left:10px;
`;
const InfoWrapper_1 = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  margin: 0.5rem 0;
  min-width: 10rem;
  margin-left:-4.5em;

`;
const InfoDetailCard = styled(InfoCard)`
  width: 120%;
  height: 4rem;
  margin-bottom: 1rem;
`;

const InfoTitle = styled(Typography)`
  text-align: center;
`;

const InfoText = styled(Typography)`
  white-space: nowrap;
  font-size : 1.2rem;
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
  height: 12rem;
  margin: 1rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  margin-top:-1rem
`;

interface IOverviewInfo {
  title1:string;
  title2:string;
}

const BoostButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;
const MyLabel: React.FC<IOverviewInfo> = ({title1,title2}) => (
  <InfoWrapper style = {{marginLeft : -30}}>
      <InfoText type={TypographyType.REGULAR} >{title1}</InfoText>
      <InfoText type={TypographyType.REGULAR} style = {{marginTop:40}}  >{title2}</InfoText>
  </InfoWrapper>
);
const MyInput: React.FC<IOverviewInfo> = ({title1,title2}) => (
  <InfoWrapper style = {{marginTop:15}}>
    <InfoDetailCard>
      <InfoText type={TypographyType.BOLD_TITLE} style = {{marginBottom : 25}} >{title1}</InfoText>
    </InfoDetailCard>
    <InfoDetailCard>
      <InfoText type={TypographyType.BOLD_TITLE} style = {{marginBottom : 25}}>{title2}</InfoText>
    </InfoDetailCard>
  </InfoWrapper>
);
const MyButton: React.FC<IOverviewInfo> = ({title1,title2}) => (
  <InfoWrapper >
    <BoostButton style = {{marginTop:20,width:100}}  >{title1}</BoostButton>
    <BoostButton  style = {{marginTop:25,width:100}} >{title2}</BoostButton>
  </InfoWrapper>
);
return  (<Container>
            <OverviewWrapper style = {{paddingBottom:0}}>
              <MyLabel title1 = "LeftProject" title2 = "RightProject"  />
              <MyInput title1 = "General2022" title2 = "Dota2022War" />
              <MyButton title1 = "Set" title2 = "Set" />
              <InfoLine/>
              <MyLabel title1 = "BetFee" title2 = "ABP Token" />
              <MyInput title1 = "5 %" title2 = "1jkqk12jk32j1" />
              <InfoWrapper >
              <BoostButton  style = {{marginTop:25,width:80,height:100}} >Set</BoostButton>
              </InfoWrapper >
              
            </OverviewWrapper>
        </Container>);
  
}
export default CenterPanel;
