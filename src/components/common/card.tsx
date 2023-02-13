import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.grey1};
  box-shadow: -1px 17px 14px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 2rem;
  box-sizing: border-box;
`;

export default Card;
