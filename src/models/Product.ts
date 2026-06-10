import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Omit<Document, 'collection'> {
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

const ProductSchema = new Schema<IProduct>({
  name:          { type: String, required: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  category:      { type: String, required: true, enum: ['outwear','tops','bottoms','accessories'] },
  gender:        { type: String, required: true, enum: ['women','men'] },
  image:         { type: String, required: true },
  description:   { type: String },
  inStock:       { type: Boolean, default: true },
  featured:      { type: Boolean, default: false },
  collection:    { type: String },
  sizes: {
    type: [String],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom Only'],
    default: ['S', 'M', 'L', 'XL'],
  },
  allowCustomMeasurements: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
