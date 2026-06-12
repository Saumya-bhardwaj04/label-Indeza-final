const ITEMS = [
  '30-DAY RETURNS',
  'SUSTAINABLY SOURCED',
  'LABEL INDEZA — NEW SPRING COLLECTION',
  'FREE SHIPPING OVER ₹2999',
  'EASY RETURNS',
  'MINDFULLY MADE',
]

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="announcement-item">
          {item}
          <span className="announcement-sep" aria-hidden>
            +
          </span>
        </span>
      ))}
    </>
  )
}

export default function AnnouncementMarquee() {
  return (
    <div className="announcement-marquee" aria-label="Store announcements">
      <div className="announcement-track">
        <div className="announcement-group">
          <MarqueeContent />
        </div>
        <div className="announcement-group" aria-hidden>
          <MarqueeContent />
        </div>
      </div>
    </div>
  )
}
