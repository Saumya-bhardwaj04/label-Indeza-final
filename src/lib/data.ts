import { connectDB } from '@/lib/mongodb'
import HeroMedia from '@/models/HeroMedia'
import SiteContent from '@/models/SiteContent'
import Product from '@/models/Product'
import Collection from '@/models/Collection'

export type ProductDTO = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  gender: string
  description?: string
  collection?: string
  featured?: boolean
  inStock?: boolean
}

export type CollectionDTO = {
  id: string
  name: string
  slug: string
  description?: string
  bannerImage?: string
  bgColor: string
  active: boolean
}

function mapProduct(doc: Record<string, unknown>): ProductDTO {
  return {
    id: String(doc._id),
    name: doc.name as string,
    price: doc.price as number,
    originalPrice: doc.originalPrice as number | undefined,
    image: doc.image as string,
    category: doc.category as string,
    gender: doc.gender as string,
    description: doc.description as string | undefined,
    collection: doc.collection as string | undefined,
    featured: doc.featured as boolean | undefined,
    inStock: doc.inStock as boolean | undefined,
  }
}

function mapCollection(doc: Record<string, unknown>): CollectionDTO {
  return {
    id: String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    description: doc.description as string | undefined,
    bannerImage: doc.bannerImage as string | undefined,
    bgColor: (doc.bgColor as string) || '#F5C5D5',
    active: doc.active as boolean,
  }
}

type HeroLean = { type: string; url: string } | null
type ContentLean = { value: string } | null

export async function getHeroData() {
  await connectDB()
  const activeHero = (await HeroMedia.findOne({ active: true })
    .sort({ createdAt: -1 })
    .lean()) as HeroLean
  const fallbackImage = (await HeroMedia.findOne({ type: 'image' })
    .sort({ createdAt: -1 })
    .lean()) as HeroLean
  const heroTitle = (await SiteContent.findOne({ key: 'hero_title' }).lean()) as ContentLean
  const heroSubtitle = (await SiteContent.findOne({ key: 'hero_subtitle' }).lean()) as ContentLean

  const posterUrl = fallbackImage?.url || '/images/hero-poster.jpg'
  const videoUrl = activeHero?.type === 'video' ? activeHero.url : null
  const imageUrl =
    activeHero?.type === 'image'
      ? activeHero.url
      : posterUrl

  return {
    videoUrl,
    posterUrl,
    imageUrl,
    heroTitle: heroTitle?.value || 'Effortless Style,\nThoughtfully Made',
    heroSubtitle:
      heroSubtitle?.value ||
      'Modern essentials in soft tones and timeless cuts — designed to feel good and look even better.',
  }
}

export async function getSiteContent(keys: string[]) {
  await connectDB()
  const docs = await SiteContent.find({ key: { $in: keys } }).lean()
  const map: Record<string, string> = {}
  for (const k of keys) map[k] = ''
  for (const doc of docs) map[doc.key] = doc.value
  return map
}

export async function getProducts(filter: {
  collection?: string
  gender?: string
  category?: string
  q?: string
  featured?: boolean
  inStock?: boolean
  limit?: number
} = {}) {
  await connectDB()
  const query: Record<string, unknown> = {}
  if (filter.collection) query.collection = filter.collection
  if (filter.gender) query.gender = filter.gender
  if (filter.category) query.category = filter.category
  if (filter.featured) query.featured = true
  if (filter.inStock === true) query.inStock = true
  if (filter.q) {
    query.$or = [
      { name: { $regex: filter.q, $options: 'i' } },
      { description: { $regex: filter.q, $options: 'i' } },
      { category: { $regex: filter.q, $options: 'i' } },
    ]
  }

  let q = Product.find(query).sort({ createdAt: -1 })
  if (filter.limit) q = q.limit(filter.limit)
  const docs = await q.lean()
  return docs.map((d) => mapProduct(d as Record<string, unknown>))
}

export async function getCollections(activeOnly = false) {
  await connectDB()
  const query = activeOnly ? { active: true } : {}
  const docs = await Collection.find(query).sort({ name: 1 }).lean()
  return docs.map((d) => mapCollection(d as Record<string, unknown>))
}

export async function getCollectionBySlug(slug: string) {
  await connectDB()
  const doc = await Collection.findOne({ slug }).lean()
  return doc ? mapCollection(doc as Record<string, unknown>) : null
}
