import React from 'react';

import styled from 'styled-components';

import DiscordIcon from '../assets/images/discord.svg';
import TwitterIcon from '../assets/images/twitter.svg';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6.75rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.black};
`;

const SocialLink = styled.a``;

const SocialIcon = styled.img`
  height: 2.625rem;
  margin: 1.5rem;
`;

const Footer: React.FC = () => (
  <Container>
    <SocialLink href="https://twitter.com/AlphaBetsGG" target="_blank">
      <SocialIcon alt="" src={TwitterIcon} />
    </SocialLink>
    <SocialLink href="https://discord.gg/AlphaBets" target="_blank">
      <SocialIcon alt="" src={DiscordIcon} />
    </SocialLink>
  </Container>
);

export default Footer;
