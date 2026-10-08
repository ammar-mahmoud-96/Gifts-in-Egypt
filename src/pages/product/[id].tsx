import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useState } from 'react'
import ProductItem from '../../components/ProductItem'
import { addToCart } from '../../store/slices/cartSlice'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const product = useSelector((state: RootState) => state.products.items.find(p => p.id === Number(id)))
  const all = useSelector((s: RootState) => s.products.items)
  const dispatch = useDispatch()
  const [qty, setQty] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) return <div style={{padding:20}}>Product not found</div>

  // simple gallery: duplicate same image as thumbnails if only one provided
  const gallery = product.image ? [product.image, product.image, product.image, product.image] : []

  const related = all.filter(p => p.id !== product.id).slice(0,4)

  return (
    <main className="product-page">
      <div className="product-grid-wrapper">
        <aside className="product-gallery">
          <div className="thumbs">
            {gallery.map((g, idx) => (
              <button key={idx} className={`thumb ${idx === selectedImageIndex ? 'active' : ''}`} onClick={() => setSelectedImageIndex(idx)}>
                <img src={g} alt={`thumb-${idx}`} />
              </button>
            ))}
          </div>

          <div className="main-image-box">
            {gallery.length > 0
              ? <img src={gallery[selectedImageIndex]} alt={product.title} />
              : <div className="product-image-placeholder" aria-label="Product image not available" />}
          </div>
        </aside>

        <section className="product-info">
          <h1 className="prod-title">{product.title}</h1>

          <div className="prod-meta-row">
            <div className="rating">★★★★☆ <span className="rating-num">4.5</span></div>
            <div className="price-block">
              <div className="price">EGP {product.price}</div>
              {product.isOnSale && <div className="old-price">EGP {Math.round(product.price * 1.25)}</div>}
              {product.isOnSale && <div className="discount">-20%</div>}
            </div>
          </div>

          <p className="prod-short">{product.description || 'This product is made from quality materials and offers great comfort.'}</p>

          <div className="selectors">
            <div>
              <div className="label">Select Colors</div>
              <div className="swatches">
                <button className="swatch" style={{background:'#e6e6e6'}} />
                <button className="swatch" style={{background:'#2b2f33'}} />
                <button className="swatch" style={{background:'#9aa4b2'}} />
              </div>
            </div>

            <div>
              <div className="label">Choose Size</div>
              <div className="size-options">
                <button className="size">S</button>
                <button className="size">M</button>
                <button className="size active">L</button>
                <button className="size">XL</button>
              </div>
            </div>
          </div>

          <div className="purchase-row">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty-1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty+1)}>+</button>
            </div>

            <button className="add-cart" onClick={() => dispatch(addToCart({ id: product.id, title: product.title, price: product.price, quantity: qty, image: product.image }))}>Add to Cart</button>
          </div>
        </section>
      </div>

      <div className="product-tabs">
        <nav className="tabs">
          <button className="tab active">Product Details</button>
          <button className="tab">Rating & Reviews</button>
          <button className="tab">FAQs</button>
        </nav>

        <div className="tab-content">
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-header"><strong>Samantha D.</strong><span className="stars">★★★★★</span></div>
              <p className="review-body">I already love this t-shirt! The design is unique and the fabric feels comfortable.</p>
            </div>
            <div className="review-card">
              <div className="review-header"><strong>Alex M.</strong><span className="stars">★★★★★</span></div>
              <p className="review-body">The color was vibrant and fit was great.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="also-like">
        <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>
        <div className="arrival-grid">
          {related.map(r => (
            <ProductItem key={r.id} id={r.id} title={r.title} price={r.price} image={r.image} />
          ))}
        </div>
      </section>
    </main>
  )
}
