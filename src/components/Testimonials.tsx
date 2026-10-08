const reviews = [
  {name: 'Sarah M.', text: 'Great quality and fast shipping!', rating: 5},
  {name: 'Alex K.', text: 'Excellent customer service.', rating: 5},
  {name: 'James L.', text: 'Fits perfectly.', rating: 5},
  {name: 'Lisa R.', text: 'Very satisfied with my purchase.', rating: 5},
  {name: 'David P.', text: 'Highly recommend this store!', rating: 5},
]

export default function Testimonials(){
  return (
    <div className="testimonials">
      {reviews.map((r, i) => (
        <div key={i} className="testimonial">
          <div className="stars">{'★'.repeat(r.rating)}</div>
          <p>{r.text}</p>
          <small>- {r.name}</small>
        </div>
      ))}
    </div>
  )
}
