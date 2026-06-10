'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cardStyle, btnPrimary, btnSecondary, inputBoxStyle, labelStyle } from '@/components/admin/adminStyles'
import Loader from '@/components/Loader'

type Product = {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  gender: string
  image: string
  description?: string
  inStock: boolean
  featured: boolean
  collection?: string
  sizes?: string[]
  allowCustomMeasurements?: boolean
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom Only']

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  category: 'tops',
  gender: 'women',
  collection: '',
  featured: false,
  image: '',
  description: '',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL'])
  const [allowCustom, setAllowCustom] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadProducts = useCallback(async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }, [])

  const loadCollections = useCallback(async () => {
    try {
      const res = await fetch(`/api/collections?t=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json()
      setCollections(data)
    } catch (e) {
      console.error('Failed to load collections', e)
    }
  }, [])

  useEffect(() => {
    loadProducts()
    loadCollections()
  }, [loadProducts, loadCollections])

  const resetForm = () => {
    setForm(emptyForm)
    setPreview('')
    setEditingId(null)
    setShowForm(false)
  }

  const openAdd = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p._id)
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
      category: p.category,
      gender: p.gender,
      collection: p.collection || '',
      featured: p.featured,
      image: p.image,
      description: p.description || '',
    })
    setSelectedSizes(p.sizes || ['S', 'M', 'L', 'XL'])
    setAllowCustom(p.allowCustomMeasurements !== false)
    setPreview(p.image)
    setShowForm(true)
  }

  const toggleSize = (size: string) => {
    if (size === 'Custom Only') {
      setSelectedSizes(['Custom Only'])
      return
    }
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size && s !== 'Custom Only')
        : [...prev.filter(s => s !== 'Custom Only'), size]
    )
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', 'image')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) {
      setForm((f) => ({ ...f, image: data.url }))
      setPreview(data.url)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) return alert('Please upload an image')
    setSaving(true)
    const payload = {
      name: form.name,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      gender: form.gender,
      collection: form.collection || undefined,
      featured: form.featured,
      image: form.image,
      description: form.description || undefined,
      inStock: true,
      sizes: selectedSizes,
      allowCustomMeasurements: allowCustom,
    }
    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    setSaving(false)
    resetForm()
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setDeleteId(null)
    loadProducts()
  }

  const toggleStock = async (product: any) => {
    await fetch(`/api/products/${product._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !product.inStock }),
    })
    loadProducts()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Products</h1>
        <button type="button" onClick={openAdd} style={btnPrimary}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
            {editingId ? 'Edit Product' : 'Add Product'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Product Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Original Price (optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
              >
                <option value="outwear">Outwear</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Collection</label>
              <select
                value={form.collection}
                onChange={(e) => setForm({ ...form, collection: e.target.value })}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
              >
                <option value="">None</option>
                {collections.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured product
          </label>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Available Sizes</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {ALL_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: selectedSizes.includes(size) ? '#1A1A1A' : 'white',
                    color: selectedSizes.includes(size) ? 'white' : '#555',
                    border: selectedSizes.includes(size) ? 'none' : '1px solid #E0E0E0',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={allowCustom}
              onChange={e => setAllowCustom(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            Allow custom fit measurements for this product
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleImageUpload(file)
            }}
            style={{
              border: '2px dashed #D0C8BC',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
              background: '#FAF8F5',
              marginBottom: 16,
            }}
          >
            {preview ? (
              <img src={preview} alt="" style={{ maxHeight: 160, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <p style={{ color: '#999', margin: 0 }}>
                {uploading ? 'Uploading...' : 'Click or drag image here'}
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
          </div>
          <div style={{ ...inputBoxStyle, marginBottom: 16 }}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={resetForm} style={btnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={cardStyle}>
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 32 }}>No products yet. Add your first product above.</p>
        ) : (
          <div className="admin-product-list" style={{ display: 'flex', flexDirection: 'column' }}>
            {products.map((p, i) => (
              <div
                key={p._id}
                className="admin-product-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 0',
                  borderTop: i > 0 ? '1px solid #F0EDE8' : 'none',
                }}
              >
                <img
                  src={p.image}
                  alt=""
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, background: '#f5f5f5' }}
                />
                <div className="product-info-col" style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#888', textTransform: 'capitalize' }}>
                    {p.category} · {p.gender}
                  </div>
                </div>
                <div className="product-price-col" style={{ fontWeight: 600 }}>₹{p.price}</div>
                <div className="product-actions-group">
                  <button
                    type="button"
                    onClick={() => toggleStock(p)}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                      fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                      background: p.inStock ? '#DCFCE7' : '#FEE2E2',
                      color: p.inStock ? '#15803D' : '#991B1B',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                  <button type="button" onClick={() => openEdit(p)} style={btnSecondary}>
                    Edit
                  </button>
                  {deleteId === p._id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => handleDelete(p._id)} style={{ ...btnSecondary, color: 'red', borderColor: 'red' }}>
                        Confirm
                      </button>
                      <button type="button" onClick={() => setDeleteId(null)} style={btnSecondary}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setDeleteId(p._id)} style={{ ...btnSecondary, color: '#888' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
