import styled from 'styled-components'

const BORDER = 'rgba(255,255,255,0.07)'
const TEXT   = '#f5f5f7'
const MUTED  = 'rgba(255,255,255,0.4)'

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${BORDER};
  border-radius: 14px;
  -webkit-overflow-scrolling: touch;
`

export const StyledTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: 13.5px;
`

export const Thead = styled.thead`
  background: rgba(255,255,255,0.03);
`

export const Th = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-weight: 600;
  color: ${MUTED};
  white-space: nowrap;
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  user-select: none;
  border-bottom: 1px solid ${BORDER};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.07em;

  &:hover {
    color: ${({ $sortable }) => $sortable ? TEXT : 'inherit'};
  }
`

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  border-bottom: 1px solid ${BORDER};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: background 120ms;

  &:hover { background: rgba(255,255,255,0.03); }
  &:last-child { border-bottom: none; }
`

export const Td = styled.td`
  padding: 12px 16px;
  color: ${TEXT};
  vertical-align: middle;
`

export const SortIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  vertical-align: middle;
  opacity: 0.7;
`

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    color: ${MUTED};
    padding: 48px 16px;
    font-size: 14px;
  }
`

export const LoadingRow = styled.tr`
  td {
    text-align: center;
    padding: 48px 16px;
  }
`
