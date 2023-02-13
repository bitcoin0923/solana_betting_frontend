import { ScrollbarProps, Scrollbars } from 'react-custom-scrollbars';

import styled from 'styled-components';

const VTrack = styled.div`
  position: absolute;
  width: 2px !important;
  right: 48px;
  bottom: 0px;
  top: 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.red1};
`;

const VThumb = styled.div`
  background: ${({ theme }) => theme.colors.red1};
  width: 16px !important;
`;

const HTrack = styled.div`
  position: absolute;
  height: 2px !important;
  left: 0px;
  right: 0px;
  bottom: 48px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.red1};
  display: none;
`;

const HThumb = styled.div`
  background: ${({ theme }) => theme.colors.red1};
  height: 16px !important;
`;

const RenderView = styled.div`
  position: relative;
  inset: 0px;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: scroll;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const ScrollBar: React.FC<ScrollbarProps> = ({ children, style, ...props }) => (
  <Scrollbars
    {...props}
    renderThumbHorizontal={(p) => <HThumb {...p} />}
    renderThumbVertical={(p) => <VThumb {...p} />}
    renderTrackHorizontal={(p) => <HTrack {...p} />}
    renderTrackVertical={(p) => <VTrack {...p} />}
    renderView={(p) => <RenderView {...p} style={{ overflowX: 'hidden' }} />}
    style={{ ...style, display: 'inline-block', width: 'auto' }}
  >
    {children}
  </Scrollbars>
);

export default ScrollBar;
