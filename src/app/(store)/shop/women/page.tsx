import { Suspense } from 'react'
import ProductGrid from '@/components/ProductGrid'
import FilterBar from '@/components/FilterBar'
import { getProducts } from '@/lib/data'

export default async function ShopWomen({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string; q?: string; sort?: string }>
}) {
  const params = await searchParams
  const products = await getProducts({
    gender: 'women',
    category: params.category,
    collection: params.collection,
    q: params.q,
    sort: params.sort,
  })

  return (
    <main>
      <div
        className="page-header"
        style={{
          background: '#FEFCE8',
          padding: '80px 0 48px',
          textAlign: 'center',
          marginTop: 64,
        }}
      >
        <h1 className="section-title">Shop Women</h1>
        <p className="section-subtitle">
          Thoughtful pieces designed with function, form, and quiet confidence.
          <br />
          Essentials that go beyond the season.
        </p>
        {params.q && (
          <p style={{ marginTop: 12, fontSize: 14, color: '#6B6B6B' }}>
            Results for &ldquo;{params.q}&rdquo;
          </p>
        )}
      </div>
      <Suspense fallback={<div className="container" style={{ padding: 24 }}>Loading filters...</div>}>
        <FilterBar />
      </Suspense>
      <div style={{ paddingBottom: 80 }}>
        <ProductGrid products={products} centered={false} priceLocale="inr" showProductDescription paginate />
      </div>
    </main>
  )
}
