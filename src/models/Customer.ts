import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomer extends Document {
  name: string
  email: string
  image?: string
  provider: 'google' | 'email' | 'both'
  googleId?: string
  emailVerified?: Date
  savedAddress?: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  createdAt: Date
}

const CustomerSchema = new Schema<ICustomer>({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  image:         { type: String },
  provider:      { type: String, enum: ['google', 'email', 'both'], required: true },
  googleId:      { type: String },
  emailVerified: { type: Date },
  savedAddress: {
    fullName:     { type: String },
    phone:        { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city:         { type: String },
    state:        { type: String },
    pincode:      { type: String },
    country:      { type: String, default: 'India' },
  },
}, { timestamps: true })

export default mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', CustomerSchema)
