import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code:          string
  type:          'percent' | 'flat'
  value:         number
  minOrderValue: number
  maxUses:       number
  usedCount:     number
  expiresAt?:    Date
  active:        boolean
  description?:  string
  createdAt:     Date
}

const CouponSchema = new Schema<ICoupon>({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  type:          { type: String, required: true, enum: ['percent', 'flat'] },
  value:         { type: Number, required: true, min: 1 },
  minOrderValue: { type: Number, default: 0 },
  maxUses:       { type: Number, default: 0 },
  usedCount:     { type: Number, default: 0 },
  expiresAt:     { type: Date },
  active:        { type: Boolean, default: true },
  description:   { type: String },
}, { timestamps: true })

export default mongoose.models.Coupon ||
  mongoose.model<ICoupon>('Coupon', CouponSchema)
