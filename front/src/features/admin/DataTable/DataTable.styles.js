import styled from 'styled-components'

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.size.sm};
`

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.surface};
`

export const Th = styled.th`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme, sortable }) => sortable ? theme.colors.textPrimary : 'inherit'};
  }
`

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
`

export const SortIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing[1]};
  vertical-align: middle;
`

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: ${({ theme }) => theme.spacing[8]};
  }
`

export const LoadingRow = styled.tr`
  td {
    text-align: center;
    padding: ${({ theme }) => theme.spacing[8]};
  }
`
