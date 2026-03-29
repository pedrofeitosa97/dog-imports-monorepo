import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationWrapper, PageButton, NavButton, Ellipsis } from './Pagination.styles'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <PaginationWrapper>
      <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={18} />
      </NavButton>

      {pages.map((page, idx) =>
        page === '...' ? (
          <Ellipsis key={`ellipsis-${idx}`}>...</Ellipsis>
        ) : (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        )
      )}

      <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight size={18} />
      </NavButton>
    </PaginationWrapper>
  )
}
