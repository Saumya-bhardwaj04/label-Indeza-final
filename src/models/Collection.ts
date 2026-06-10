import mongoose, { Schema, Document } from 'mongoose'

export interface ICollection extends Document {
  name: string
  slug: string
  description?: string
  bannerImage?: string
  bgColor: string
  active: boolean
}

const CollectionSchema = new Schema<ICollection>({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  bannerImage: { type: String },
  bgColor:     { type: String, default: '#F5C5D5' },
  active:      { type: Boolean, default: true },
})

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema)
