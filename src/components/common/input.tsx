/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components';

import Button from './button';
import { Typography, TypographyType } from './typography';

const Container = styled.div`
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
`;

const CustomInput = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  border: none;
  font-family: ${({ theme }) => theme.typography.boldSubTitle.fontFamily};
  font-weight: ${({ theme }) => theme.typography.boldSubTitle.fontWeight};
  font-style: ${({ theme }) => theme.typography.boldSubTitle.fontStyle};
  font-size: ${({ theme }) => theme.typography.boldSubTitle.fontSize};
  line-height: ${({ theme }) => theme.typography.boldSubTitle.fontSize};
  padding: 1rem 2rem;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const MaxButton = styled(Button)`
  background: transparent;
  padding-left: 1rem;
  filter: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.boldSubTitle.fontFamily};
  font-weight: ${({ theme }) => theme.typography.boldSubTitle.fontWeight};
  font-style: ${({ theme }) => theme.typography.boldSubTitle.fontStyle};
  font-size: ${({ theme }) => theme.typography.boldSubTitle.fontSize};
  text-transform: none;
  text-shadow: none;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  point?: number;
  onMax?: () => void;
}

const Input: React.FC<InputProps> = ({ style, className, point, onMax, disabled, ...props }) => (
  <Container className={className} style={style}>
    <CustomInput disabled={disabled} {...props} />
    {point && (
      <Typography style={{ marginRight: '1rem' }} type={TypographyType.REGULAR}>
        {point.toLocaleString()}
      </Typography>
    )}
    {onMax && (
      <>
        <Typography type={TypographyType.BOLD_TITLE}>|</Typography>
        <MaxButton disabled={disabled} onClick={onMax}>
          max
        </MaxButton>
      </>
    )}
  </Container>
);

export default Input;
