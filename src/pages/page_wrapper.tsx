import styled from 'styled-components';

const Container = styled.div<{ grayscale?: boolean }>`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 13rem);
  display: block;
  padding: 4rem;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.black};
  background-size: cover;
  background-repeat: no-repeat;

  ${({ theme }) => `${theme.media_width.upToMedium} {
    padding: 2rem;
  }`}
`;

interface IPageWrapper {
  grayscale?: boolean;
  component: any;
}

const PageWrapper: React.FC<IPageWrapper> = ({ grayscale, component }) => (
  <Container grayscale={grayscale}>{component}</Container>
);

export default PageWrapper;
