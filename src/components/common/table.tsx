import React from 'react';
import { Column, useBlockLayout, useFlexLayout, useTable } from 'react-table';

import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  min-width: 100% !important;
  box-sizing: border-box;
  display: inline-block;
  border-spacing: 0;
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  background: radial-gradient(50.08% 49.91% at 50% 50%, #1d1d1b 46.65%, #181817 66.03%, #0a0a0a 88.29%, #000000 100%);
  overflow-x: auto;
  overflow-y: hidden;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const Header = styled.div`
  display: inline-block;
  min-width: 100%;
`;

const HeaderRow = styled.div`
  width: 100% !important;
  background: ${({ theme }) => theme.colors.black};
  border-bottom: 2px solid ${({ theme }) => theme.colors.white};
`;

const HeaderCell = styled.div`
  padding: 1rem 2rem;
  font-size: ${({ theme }) => theme.typography.regular.fontSize};
  // font-size: 24px;
  text-align: left;
  flex-grow: 1;
`;

const Body = styled.div`
  display: inline-block;
  min-width: 100%;
  height: 33rem;
  overflow-y: auto;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const Row = styled.div<{ itemSize?: string }>`
  width: 100% !important;
  display: flex;
  align-items: center;
  ${({ itemSize }) => `height: ${itemSize};`}

  &:nth-child(odd) {
    background: ${({ theme }) => theme.colors.grey1};
  }
`;

const Cell = styled.div`
  flex-grow: 1;
  padding: 0 2rem;
  font-size: ${({ theme }) => theme.typography.regular.fontSize};
  // font-size: 24px;
  text-align: left;
  overflow: hidden;
`;

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: Array<Column>;
  data: Array<any>;
  itemSize?: string;
  hideHeader?: boolean;
}

const Table: React.FC<TableProps> = ({ columns, data, itemSize, hideHeader, ...props }) => {
  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
      minWidth: 50,
    }),
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFlexLayout,
    useBlockLayout
  );

  return (
    <TableContainer {...getTableProps()} {...props}>
      {!hideHeader && (
        <Header>
          {headerGroups.map((headerGroup) => (
            <HeaderRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <HeaderCell {...column.getHeaderProps()}>{column.render('Header')}</HeaderCell>
              ))}
            </HeaderRow>
          ))}
        </Header>
      )}

      <Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Row {...row.getRowProps()} itemSize={itemSize}>
              {row.cells.map((cell) => (
                <Cell {...cell.getCellProps()}>{cell.render('Cell')}</Cell>
              ))}
            </Row>
          );
        })}
      </Body>
    </TableContainer>
  );
};

export default Table;
