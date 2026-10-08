import React from 'react'

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hrefForPage?: (page: number) => string
}

export default function Pagination({ currentPage, totalPages, onPageChange, hrefForPage }: Props) {
  if (totalPages <= 1) return null

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
    requestAnimationFrame(() => {
      const target = document.querySelector('.products-results') || document.querySelector('.arrival-section')
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const visiblePages = currentPage <= 3
    ? [1, 2, 3]
    : currentPage >= totalPages - 2
      ? [totalPages - 2, totalPages - 1, totalPages]
      : [currentPage - 1, currentPage, currentPage + 1]
  const pages: Array<number | 'ellipsis'> = []
  const addPage = (page: number) => {
    if (page >= 1 && page <= totalPages && !pages.includes(page)) pages.push(page)
  }
  const pageLink = (page: number, label: string, className = '', ariaCurrent?: 'page') => hrefForPage
    ? <a href={hrefForPage(page)} className={className} aria-current={ariaCurrent}>{label}</a>
    : <button type="button" className={className} aria-current={ariaCurrent} onClick={() => changePage(page)}>{label}</button>

  addPage(1)
  if (visiblePages[0] > 2) pages.push('ellipsis')
  visiblePages.forEach(addPage)
  if (visiblePages[visiblePages.length - 1] < totalPages - 1) pages.push('ellipsis')
  addPage(totalPages)

  return (
    <nav className="pagination" aria-label="Product pages">
      {currentPage === 1
        ? <button type="button" className="pagination-arrow" disabled aria-label="Previous page">‹</button>
        : pageLink(currentPage - 1, '‹', 'pagination-arrow')}
      {pages.map((page, index) => page === 'ellipsis' ? (
        <span className="pagination-ellipsis" key={`ellipsis-${index}`}>...</span>
      ) : (
        <React.Fragment key={page}>
          {pageLink(page, String(page), page === currentPage ? 'active' : '', page === currentPage ? 'page' : undefined)}
        </React.Fragment>
      ))}
      {currentPage === totalPages
        ? <button type="button" className="pagination-arrow" disabled aria-label="Next page">›</button>
        : pageLink(currentPage + 1, '›', 'pagination-arrow')}
    </nav>
  )
}