/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';

import styled from 'styled-components';

import MedalIcon from '../../assets/images/medal.svg';
import PlusIcon from '../../assets/images/plus.svg';
import Button from '../../components/common/button';
import Table from '../../components/common/table';
import { Typography, TypographyType } from '../../components/common/typography';
import { LEADERBOARD_DATA, LeaderboardInfo } from '../../mocks/leaderboard';
import { getShortWalletAddress } from '../../utils';

const Container = styled.div`
  position: relative;
`;

const LeaderboardTable = styled(Table)`
  width: 100%;
  border-top-right-radius: 0 !important;
`;

const Content = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  ${({ theme }) => `${theme.media_width.upToSmall} {
    display: block;
  }`}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

const Title = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const TabButton = styled(Button)<{ active: boolean }>`
  margin-left: 3rem;
  border-radius: 12px 12px 0 0;

  ${({ active, theme }) => !active && `background: ${theme.colors.red2}`}
`;

const MedalContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MedalImage = styled.img`
  width: 2.5rem;
`;

const PlusImage = styled.img`
  width: 1rem;
`;

const Leaderboard: React.FC = () => {
  const [sortByBt, setSortByBt] = useState(false);
  const [data, setData] = useState<LeaderboardInfo[]>([]);

  useEffect(() => {
    if (sortByBt) {
      setData([...LEADERBOARD_DATA].sort((a, b) => b.total_battles - a.total_battles));
    } else {
      setData([...LEADERBOARD_DATA].sort((a, b) => b.total_points - a.total_points));
    }
  }, [sortByBt]);

  const renderMedal = (value: number) => (
    <MedalContainer>
      {new Array(Math.min(value, 3)).fill(1).map((_, key) => (
        <MedalImage alt="" key={key} src={MedalIcon} />
      ))}
      {value > 3 && <PlusImage alt="" src={PlusIcon} />}
    </MedalContainer>
  );

  const columns: Column[] = useMemo(
    () => [
      {
        Header: 'Medals',
        accessor: 'medals',
        width: 120,
        Cell: ({ value }) => renderMedal(value),
      },
      {
        Header: 'Wallet Address',
        accessor: 'wallet_address',
        width: 120,
        Cell: ({ value }) => <span>{getShortWalletAddress(value)}</span>,
      },
      {
        Header: 'Rank',
        width: 60,
        accessor: (_, index) => <span>{(index + 1).toLocaleString()}</span>,
      },
      {
        Header: '$GLORY staked',
        accessor: 'staked',
        width: 80,
        Cell: ({ value }) => <span>{value.toLocaleString()}</span>,
      },
      {
        Header: '$GLORY burned',
        accessor: 'burned',
        width: 80,
        Cell: ({ value }) => <span>{value.toLocaleString()}</span>,
      },
      {
        Header: 'Total points',
        accessor: 'total_points',
        width: 80,
        Cell: ({ value }) => <span>{value.toLocaleString()}</span>,
      },
      {
        Header: 'Total battles',
        accessor: 'total_battles',
        width: 90,
        Cell: ({ value }) => <span>{value.toLocaleString()}</span>,
      },
    ],
    []
  );

  return (
    <Container>
      <Content>
        <Title type={TypographyType.BOLD_TITLE}>LEADERBOARD</Title>

        <ButtonWrapper>
          <TabButton active={!sortByBt} onClick={() => setSortByBt(false)}>
            sort by Total Points
          </TabButton>
          <TabButton active={sortByBt} onClick={() => setSortByBt(true)}>
            sort by Total Battles
          </TabButton>
        </ButtonWrapper>
      </Content>

      <LeaderboardTable columns={columns} data={data} itemSize="6rem" />
    </Container>
  );
};

export default Leaderboard;
