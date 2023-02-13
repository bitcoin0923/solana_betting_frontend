import styled from 'styled-components';

import { Typography, TypographyType } from './typography';

const Container = styled.div<{ bgColor?: string }>`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  background: ${({ theme, bgColor }) => bgColor || theme.colors.grey2};
  border-radius: 12px;
  overflow: hidden;
`;

const ProgressView = styled.div<{ value: number; fillColor?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ value }) => `${value}%`};
  background: ${({ theme, fillColor }) => fillColor || theme.colors.green};
`;

const TextView = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  box-sizing: border-box;
`;

interface IProgressBar extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  bgColor?: string;
  fillColor?: string;
  text?: string;
}

const ProgressBar: React.FC<IProgressBar> = ({ value, bgColor, fillColor, text, ...props }) => (
  <Container bgColor={bgColor} {...props}>
    <ProgressView fillColor={fillColor} value={Math.min(Math.max(value, 0), 100)} />
    {text && (
      <TextView>
        <Typography type={TypographyType.REGULAR_SMALL}>{text}</Typography>
      </TextView>
    )}
  </Container>
);

export default ProgressBar;
