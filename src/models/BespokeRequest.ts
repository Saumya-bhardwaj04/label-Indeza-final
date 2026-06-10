import mongoose, { Schema, Document } from 'mongoose'

export interface IBespokeRequest extends Document {
  name:        string
  email:       string
  phone:       string
  occasion:    string
  garmentType: string
  colors?:     string
  fabric?:     string
  embroidery?:  string
  budgetRange: string
  timeline:    string
  measurements: {
    bust?:   string
    waist?:  string
    hip?:    string
    height?: string
  }
  referenceImageUrl?: string
  additionalNotes?:   string
  status:    'new' | 'reviewed' | 'quoted' | 'confirmed' | 'rejected'
  createdAt: Date
}

const BespokeRequestSchema = new Schema<IBespokeRequest>({
  name:        { type: String, required: true },
  email:       { type: String, required: true, lowercase: true },
  phone:       { type: String, required: true },
  occasion:    { type: String, required: true },
  garmentType: { type: String, required: true },
  colors:      { type: String },
  fabric:      { type: String },
  embroidery:  { type: String },
  budgetRange: { type: String, required: true },
  timeline:    { type: String, required: true },
  measurements: {
    bust:   { type: String },
    waist:  { type: String },
    hip:    { type: String },
    height: { type: String },
  },
  referenceImageUrl: { type: String },
  additionalNotes:   { type: String },
  status: {
    type:    String,
    enum:    ['new','reviewed','quoted','confirmed','rejected'],
    default: 'new',
  },
}, { timestamps: true })

export default mongoose.models.BespokeRequest ||
  mongoose.model<IBespokeRequest>('BespokeRequest', BespokeRequestSchema)
