import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ProductItem from '../components/ProductItem'
import { RootState } from '../store'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Pagination from '../components/Pagination'
import { compareHydroJugFirst, getProductColorNames } from '../utils/productColors'

const PAGE_SIZE = 8
const MAX_PRICE = 2000
const categories = ['HydroJug', 'Stanley', 'Owala', 'Aqua Flask', 'Starbucks', 'Purply Muse', 'Tumblers', 'Bottles', 'Travel Cups', 'Cups', 'Gift Sets']
const dressStyles = ['Everyday', 'Home', 'Outdoor', 'Gifting']
const normalizeSize = (size: string) => size.toLowerCase().replace(/[^a-z0-9]/g, '')

type ProductsPageProps = {
  initialSearchQuery: string
  initialCategory: string
  initialPage: number
}

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async ({ query }) => {
  const requestedPage = typeof query.page === 'string' ? Number(query.page) : 1
  return {
    props: {
      initialSearchQuery: typeof query.q === 'string' ? query.q : '',
      initialCategory: typeof query.category === 'string' ? query.category : '',
      initialPage: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    }
  }
}

export default function ProductsPage({ initialSearchQuery, initialCategory, initialPage }: ProductsPageProps): JSX.Element {
  const router = useRouter()
  const queryString = router.asPath.split('?')[1]?.split('#')[0] || ''
  const searchQuery = typeof router.query.q === 'string'
    ? router.query.q
    : initialSearchQuery || new URLSearchParams(queryString).get('q') || ''
  const q = searchQuery.toLowerCase()
  const dressStyleQuery = typeof router.query.dressStyle === 'string' ? router.query.dressStyle : ''
  const all = useSelector((s: RootState) => s.products.items)
  const catalogProducts = [...all].sort(compareHydroJugFirst)
  const maxPrice = Math.max(MAX_PRICE, Math.ceil(Math.max(...all.map(product => product.price), MAX_PRICE) / 500) * 500)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.includes(initialCategory) ? [initialCategory] : []
  )
  const [colorQuery, setColorQuery] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedDressStyles, setSelectedDressStyles] = useState<string[]>([])
  const [priceLimit, setPriceLimit] = useState(maxPrice)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const filterState = JSON.stringify([q, selectedCategories, colorQuery, selectedSizes, selectedDressStyles, priceLimit])
  const previousFilterState = useRef(filterState)
  const sizeOptions = Array.from(new Map(
    catalogProducts.flatMap(product => product.sizes).map(size => [normalizeSize(size), size] as const)
  ).values()).sort((first, second) => {
    if (normalizeSize(first) === 'onesize') return 1
    if (normalizeSize(second) === 'onesize') return -1
    return parseFloat(first) - parseFloat(second)
  })
  const colorCategories = selectedCategories.length > 0
    ? catalogProducts.filter(product => selectedCategories.includes(product.category))
    : catalogProducts
  const colorOptions = Array.from(new Map(
    colorCategories
      .flatMap(getProductColorNames)
      .map(color => [color.toLowerCase(), color] as const)
  ).values()).sort((first, second) => first.localeCompare(second))

  useEffect(() => {
    setSelectedDressStyles(dressStyleQuery && dressStyles.includes(dressStyleQuery) ? [dressStyleQuery] : [])
  }, [dressStyleQuery])

  const toggle = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value])
  }

  const products = catalogProducts.filter(product => {
    const searchText = [product.title, ...product.colors, ...product.sizes].join(' ').toLowerCase()
    const matchesSearch = !q || searchText.includes(q) || normalizeSize(searchText).includes(normalizeSize(q))
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const normalizedColorQuery = colorQuery.trim().toLowerCase()
    const matchesColor = !normalizedColorQuery ||
      product.title.toLowerCase().includes(normalizedColorQuery) ||
      getProductColorNames(product).some(color => color.toLowerCase().includes(normalizedColorQuery))
    const matchesSize = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.some(selectedSize => normalizeSize(selectedSize) === normalizeSize(size)))
    const matchesStyle = selectedDressStyles.length === 0 || selectedDressStyles.includes(product.dressStyle)
    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesStyle && product.price <= priceLimit
  })
  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1))
  const visibleProducts = products.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  useEffect(() => {
    if (previousFilterState.current === filterState) return
    previousFilterState.current = filterState
    setCurrentPage(1)
  }, [filterState])
  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage)
  }, [currentPage, safeCurrentPage])

  const clearFilters = () => {
    setSelectedCategories([])
    setColorQuery('')
    setSelectedSizes([])
    setSelectedDressStyles([])
    setPriceLimit(maxPrice)
  }

  const filterContent = (
    <>
      <div className="filter-heading"><strong>Filters</strong><button type="button" aria-label="Clear filters" onClick={clearFilters}>Clear</button></div>
      <div className="filter-group">
        {categories.map(category => <button type="button" className={selectedCategories.includes(category) ? 'filter-link active' : 'filter-link'} key={category} onClick={() => toggle(category, selectedCategories, setSelectedCategories)}>{category}<span>›</span></button>)}
      </div>
      <div className="filter-group">
        <h3>Price <span>{priceLimit.toLocaleString('en-EG')} EGP</span></h3>
        <input className="price-range" type="range" min="0" max={maxPrice} step="10" value={priceLimit} onChange={event => setPriceLimit(Number(event.target.value))} />
        <div className="price-labels"><span>EGP 0</span><span>EGP {maxPrice.toLocaleString('en-EG')}</span></div>
      </div>
      <div className="filter-group">
        <h3>Color</h3>
        <select className="filter-search-input" value={colorQuery} aria-label="Filter products by color" onChange={event => setColorQuery(event.target.value)}>
          <option value="">All colors</option>
          {colorOptions.map(color => <option key={color.toLowerCase()} value={color}>{color}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <h3>Size</h3>
        <div className="filter-chips">{sizeOptions.map(size => <button type="button" key={normalizeSize(size)} className={selectedSizes.some(selectedSize => normalizeSize(selectedSize) === normalizeSize(size)) ? 'filter-chip selected' : 'filter-chip'} onClick={() => toggle(size, selectedSizes, setSelectedSizes)}>{size}</button>)}</div>
      </div>
      <div className="filter-group">
        <h3>Shop by moment</h3>
        {dressStyles.map(style => <button type="button" className={selectedDressStyles.includes(style) ? 'filter-link active' : 'filter-link'} key={style} onClick={() => toggle(style, selectedDressStyles, setSelectedDressStyles)}>{style}<span>›</span></button>)}
      </div>
    </>
  )

  return (
    <main className="arrival-section catalog-page">
      <div className="catalog-page-inner">
        <div className="products-toolbar">
          <div className="catalog-heading">
            <p className="catalog-eyebrow">Explore our collection</p>
            <h1 className="section-title">Drinkware for every day</h1>
          </div>
          <div className="products-toolbar-actions"><button className="mobile-filter-button" type="button" onClick={() => setIsFiltersOpen(true)}>Filters</button><Link href="/" className="btn-view-all">Back to shop</Link></div>
        </div>

        <div className="products-layout">
          {isFiltersOpen && <button className="catalog-filter-backdrop" type="button" onClick={() => setIsFiltersOpen(false)} aria-label="Close filters" />}
          <aside className={isFiltersOpen ? 'catalog-filters open' : 'catalog-filters'}>
            <button className="filter-close" type="button" onClick={() => setIsFiltersOpen(false)} aria-label="Close filters">&times;</button>
            {filterContent}
          </aside>
          <div className="products-results" id="products">
            <div className="products-result-meta">Showing {visibleProducts.length ? (safeCurrentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(safeCurrentPage * PAGE_SIZE, products.length)} of {products.length} products</div>
            <div className="product-grid">
              {visibleProducts.map(p => <ProductItem key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} oldPrice={p.isOnSale ? Math.round(p.price * 1.25) : undefined} />)}
            </div>
            {products.length === 0 && (
              <div className="products-empty-state" role="status">
                <strong>{q ? 'No products found' : 'No products match these filters'}</strong>
                <span>{q ? `We could not find products matching “${q}”.` : 'Try clearing a filter or choosing different options.'}</span>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              hrefForPage={page => {
                const params = new URLSearchParams(queryString)
                params.set('page', String(page))
                return `/all-products?${params.toString()}#products`
              }}
            />
          </div>
        </div>

      </div>
    </main>
  )
}
