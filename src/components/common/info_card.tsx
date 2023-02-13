import styled from 'styled-components';

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.black};
  border-radius: 12px;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default InfoCard;
