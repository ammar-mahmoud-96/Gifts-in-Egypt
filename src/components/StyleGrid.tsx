import Link from 'next/link'

const styles = [
  { title: 'OWALA FREESIP', image: '/assets/brand-cups/product7.jpeg' },
  { title: 'STANLEY FLIP STRAW', image: '/assets/brand-cups/product2.webp' },
  { title: 'STARBUCKS BEAR CUPS', image: '/assets/brand-cups/product6.webp' },
  { title: 'OWALA 24OZ', image: '/assets/brand-cups/product8.jpeg' },
  { title: 'OWALA BOW EDITION', image: '/assets/brand-cups/product9.webp' },
  { title: 'STANLEY SHAKER', image: '/assets/brand-cups/product3.webp' },
  { title: 'STANLEY QUENCHER', image: '/assets/brand-cups/product2.webp' },
  { title: 'STANLEY CUPS', image: '/assets/brand-cups/product3.webp' },
  { title: 'PURPLY MUSE', image: '/assets/brand-cups/product4.webp' },
  { title: 'STANLEY MARBLE', image: '/assets/brand-cups/product2.webp' },
  { title: 'MINI STANLEY', image: '/assets/brand-cups/product3.webp' },
  { title: 'CHARACTER CUPS', image: '/assets/brand-cups/product4.webp' },
]

export default function StyleGrid(){
  return (
    <div className="style-wrapper">
      <div className="style-inner">
        <h3 className="style-heading">CATEGORIES</h3>

        <div className="style-grid">
          {styles.map((s, i) => (
            <Link key={i} href={`/all-products?q=${encodeURIComponent(s.title)}`} className={`style-card style-card-${i+1}`} aria-label={`Browse ${s.title} products`}>
              <div className="style-img">
                <img src={s.image} alt={s.title} />
              </div>
              <div className="style-title">{s.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
