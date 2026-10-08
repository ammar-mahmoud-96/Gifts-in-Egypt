export default function BrandStrip(){
  const brands = ['MUGS', 'TUMBLERS', 'BOTTLES', 'GIFT SETS', 'MADE IN EGYPT']
  return (
    <div className="brand-strip black">
      <div className="brand-inner">
        {brands.map((b, i) => <div key={i} className="brand">{b}</div>)}
      </div>
    </div>
  )
}
