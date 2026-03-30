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

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T extends { id?: string | number }> {
  columns?: TableColumn<T>[]
  rows?: T[]
  loading?: boolean
  onSort?: (key: string, dir: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
}

export default function DataTable<T extends { id?: string | number }>({
  columns = [],
  rows = [],
  loading = false,
  onSort,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (col: TableColumn<T>) => {
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
                $sortable={col.sortable}
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
              <Tr key={row.id ?? idx} $clickable={!!onRowClick} onClick={() => onRowClick?.(row)}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.render
                      ? col.render((row as Record<string, unknown>)[col.key], row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
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
