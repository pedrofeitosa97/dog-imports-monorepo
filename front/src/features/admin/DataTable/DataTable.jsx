import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Spinner from '../../../ui/Spinner/Spinner'
import {
  TableWrapper,
  StyledTable,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  SortIcon,
  EmptyRow,
  LoadingRow,
} from './DataTable.styles'

export default function DataTable({ columns = [], rows = [], loading = false, onSort, onRowClick }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (col) => {
    if (!col.sortable) return
    const newDir = sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc'
    setSortKey(col.key)
    setSortDir(newDir)
    onSort?.(col.key, newDir)
  }

  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map((col) => (
              <Th
                key={col.key}
                sortable={col.sortable}
                onClick={() => handleSort(col)}
                style={{ width: col.width }}
              >
                {col.label}
                {col.sortable && (
                  <SortIcon>
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                      <ChevronDown size={14} opacity={0.3} />
                    )}
                  </SortIcon>
                )}
              </Th>
            ))}
          </tr>
        </Thead>
        <Tbody>
          {loading ? (
            <LoadingRow>
              <Td colSpan={columns.length}>
                <Spinner size="md" />
              </Td>
            </LoadingRow>
          ) : rows.length === 0 ? (
            <EmptyRow>
              <Td colSpan={columns.length}>Nenhum item encontrado.</Td>
            </EmptyRow>
          ) : (
            rows.map((row, idx) => (
              <Tr key={row.id ?? idx} clickable={!!onRowClick} onClick={() => onRowClick?.(row)}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </StyledTable>
    </TableWrapper>
  )
}
