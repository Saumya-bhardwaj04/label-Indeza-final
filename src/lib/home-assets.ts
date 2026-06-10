import type { ProductDTO } from '@/lib/data'

/** Local storefront images (public/images) — not from label-indeza cursor */
export const LOCAL_PRODUCT_IMAGES: Record<string, string> = {
  'Coral Curve Skirt': '/images/coral-curve-skirt.png',
  'Mist Ruffle Top': '/images/mist-ruffle-top.png',
  'Willow Knit Top': '/images/willow-knit-top.png',
  'Midnight Hoodie': '/images/midnight-hoodie.png',
  'Serene Flow Dress': '/images/serene-flow-dress.png',
  'Bloom Linen Top': '/images/bloom-linen-top.png',
  'Petal Slip Dress': '/images/mist-ruffle-top.png',
  'Blush Chain Earrings': '/images/willow-knit-top.png',
}

export const FALLBACK_PASTEL: ProductDTO[] = [
  {
    id: 'local-pastel-1',
    name: 'Coral Curve Skirt',
    price: 100,
    originalPrice: 117,
    image: '/images/coral-curve-skirt.png',
    category: 'bottoms',
    gender: 'women',
    collection: 'pastel-dreams',
  },
  {
    id: 'local-pastel-2',
    name: 'Mist Ruffle Top',
    price: 15,
    originalPrice: 30,
    image: '/images/mist-ruffle-top.png',
    category: 'tops',
    gender: 'women',
    collection: 'pastel-dreams',
  },
  {
    id: 'local-pastel-3',
    name: 'Willow Knit Top',
    price: 94,
    image: '/images/willow-knit-top.png',
    category: 'tops',
    gender: 'women',
    collection: 'pastel-dreams',
  },
  {
    id: 'local-pastel-4',
    name: 'Midnight Hoodie',
    price: 97,
    image: '/images/midnight-hoodie.png',
    category: 'outwear',
    gender: 'women',
    collection: 'pastel-dreams',
  },
]

export const FALLBACK_SUMMER: ProductDTO[] = [
  {
    id: 'local-summer-1',
    name: 'Serene Flow Dress',
    price: 93,
    originalPrice: 120,
    image: '/images/serene-flow-dress.png',
    category: 'outwear',
    gender: 'women',
    collection: 'summer-2026',
  },
  {
    id: 'local-summer-2',
    name: 'Bloom Linen Top',
    price: 49,
    image: '/images/bloom-linen-top.png',
    category: 'tops',
    gender: 'women',
    collection: 'summer-2026',
  },
  {
    id: 'local-summer-3',
    name: 'Petal Slip Dress',
    price: 119,
    image: '/images/mist-ruffle-top.png',
    category: 'outwear',
    gender: 'women',
    collection: 'summer-2026',
  },
  {
    id: 'local-summer-4',
    name: 'Blush Chain Earrings',
    price: 44,
    originalPrice: 80,
    image: '/images/willow-knit-top.png',
    category: 'accessories',
    gender: 'women',
    collection: 'summer-2026',
  },
]

export const CATEGORY_TILES = [
  {
    name: 'Outerwear',
    sub: 'Light, flowy, easy',
    image: '/images/cat-outwear.jpg',
    barBg: 'rgba(168, 196, 162, 0.85)',
    href: '/shop/women?category=outwear',
  },
  {
    name: 'Tops',
    sub: 'Cute meets comfy',
    image: '/images/cat-tops.jpg',
    barBg: 'rgba(245, 197, 213, 0.9)',
    href: '/shop/women?category=tops',
  },
  {
    name: 'Bottoms',
    sub: 'Reached this, always',
    image: '/images/cat-bottoms.jpg',
    barBg: 'rgba(212, 197, 232, 0.9)',
    href: '/shop/women?category=bottoms',
  },
  {
    name: 'Accessories',
    sub: 'Small things, big vibe',
    image: '/images/cat-accessories.jpg',
    barBg: 'rgba(245, 230, 168, 0.92)',
    href: '/shop/women?category=accessories',
  },
]

export function withLocalImages(products: ProductDTO[]): ProductDTO[] {
  return products.map((p) => ({
    ...p,
    image: LOCAL_PRODUCT_IMAGES[p.name] || p.image,
  }))
}

export function pickHomeProducts(
  fromDb: ProductDTO[],
  fallback: ProductDTO[]
): ProductDTO[] {
  const list = fromDb.length >= 4 ? fromDb : fallback
  return withLocalImages(list).slice(0, 4)
}
