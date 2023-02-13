/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';

import CloseIcon from '../assets/images/close.svg';
import HamburgerIcon from '../assets/images/hamburger.svg';
import LogoIcon from '../assets/images/logo.png';
import LogoIcon1 from '../assets/images/logo2.png';
import SolIcon from '../assets/images/sol_icon.png';
import { useContract } from '../contexts/contract_context';
import { Typography, TypographyType } from './common/typography';
import TeamImg1 from '../assets/images/team1.png';
import TeamImg2 from '../assets/images/team2.png';
import MyBetModal from '../components/modals/my_bet_modal';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 4rem;
  height: 6.25rem;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text1};
  background: ${({ theme }) => theme.colors.black};

  ${({ theme }) => `${theme.media_width.upToMedium} {
    padding: 1rem 2rem;
  }`}
`;

const Logo = styled.img`
  height: 4rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => `${theme.media_width.upToLarge} {
    display: none;
  }`}
`;

const LinkWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    display: none;
  }`}
`;

const LinkItem = styled(Link)`
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.text1};
  text-decoration: none;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BalanceLogo = styled.img`
  height: 1.5rem;
  margin-right: 0.5rem;
`;

const BalanceItem = styled(Typography)`
  line-height: 140%;
`;

const WalletButton = styled(WalletMultiButton)`
  color: ${({ theme }) => theme.colors.text1};
  background: ${({ theme }) => theme.colors.red1};
  border: none;
  border-radius: 12px;
  padding: 0.5rem;
  font-family: ${({ theme }) => theme.typography.regular.fontFamily};
  font-weight: ${({ theme }) => theme.typography.regular.fontWeight};
  font-size: ${({ theme }) => theme.typography.regular.fontSize};
  line-height: ${({ theme }) => theme.typography.regular.fontSize};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    color: ${({ theme }) => theme.colors.text1};
    background: ${({ theme }) => theme.colors.red1} !important;
  }

  &:active {
    opacity: 0.6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ theme }) => `${theme.media_width.upToLarge} {
    font-size: ${theme.typography.boldTitle.fontSize};
    line-height: ${theme.typography.boldTitle.fontSize};
    padding: 1rem;
  }`}
`;

const MenuButton = styled.img`
  display: none;
  cursor: pointer;

  ${({ theme }) => `${theme.media_width.upToLarge} {
    display: block;
  }`}
`;

const MobileView = styled.div<{ show: boolean }>`
  display: none;
  background: ${({ theme }) => theme.colors.black};
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme, show }) => `${theme.media_width.upToLarge} {
    display: ${show ? 'flex' : 'none'};
  }`}
`;

const MobileLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.img`
  cursor: pointer;
  position: absolute;
  width: 24px;
  height: 24px;
  top: 4rem;
  right: calc(4rem + 12px);
`;

const ROUTES = [
  {
    name: 'UPCOMING',
    route: '/upcoming',
  },
  {
    name: 'FEATURED',
    route: '/',
  },
  {
    name: 'BRAWL',
    route: '/brawl',
  },
  {
    name: 'DASHBOARD',
    route: '/dashboard',
  },
];

const Header: React.FC = () => {
  const { balance, myBattleInfo } = useContract();

  const [showMobileView, setShowMobileView] = useState(false);
  const [showMyBetModal, setShowMyBetModal] = useState(false);

  const handleClose = () => {
    setShowMobileView(false);
  };

  return (
    <>
    <Container>
      <Link to="/">
        <BalanceWrapper>
          <Logo alt="" src={LogoIcon} />
          {/* <Typography type={TypographyType.BOLD_SUBTITLE}>ALPHABETS</Typography> */}
        </BalanceWrapper>
      </Link>

      {/* <LinkWrapper>
        {ROUTES.map((link, key) => (
          <LinkItem key={key} to={link.route}>
            <Typography type={TypographyType.BOLD_SUBTITLE}>{link.name}</Typography>
          </LinkItem>
        ))}
      </LinkWrapper> */}

      <ButtonWrapper>
        <LinkItem to="/">
          <BalanceWrapper onClick={() => setShowMyBetModal(true)}>
            <BalanceLogo alt="" src={SolIcon} />
            <BalanceItem type={TypographyType.BOLD_SUBTITLE}>{balance.toFixed(2)}</BalanceItem>
          </BalanceWrapper>
        </LinkItem>

        <WalletButton />
      </ButtonWrapper>

      <MenuButton alt="" onClick={() => setShowMobileView(true)} src={HamburgerIcon} />

      <MobileView show={showMobileView}>
        {/* <MobileLinkWrapper>
          {ROUTES.map((link, key) => (
            <LinkItem key={key} onClick={handleClose} to={link.route}>
              <Typography style={{ padding: '1rem' }} type={TypographyType.BOLD_MEDIUM_LARGE}>
                {link.name}
              </Typography>
            </LinkItem>
          ))}
        </MobileLinkWrapper> */}

        <LinkItem onClick={handleClose} to="/">
          <BalanceWrapper>
            <BalanceLogo alt="" src={LogoIcon1} style={{ height: '8rem', marginTop: '1rem' }} />
            <BalanceItem type={TypographyType.BOLD_LARGE}>{Math.floor(balance).toLocaleString()}</BalanceItem>
          </BalanceWrapper>
        </LinkItem>

        <WalletButton />

        <CloseButton alt="" onClick={handleClose} src={CloseIcon} />
      </MobileView>
    </Container>
    <MyBetModal 
      visible={showMyBetModal}
      onClose={() => setShowMyBetModal(false)}
      userBetAmountA={myBattleInfo?.userBetAmountA || 0}
      userBetAmountB={myBattleInfo?.userBetAmountB || 0}
      userNftStakedA={myBattleInfo?.userNftStakedA || 0}
      userNftStakedB={myBattleInfo?.userNftStakedB || 0}
      teamImgA={TeamImg1}
      teamImgB={TeamImg2}
    />
    </>
  );
};

export default Header;
