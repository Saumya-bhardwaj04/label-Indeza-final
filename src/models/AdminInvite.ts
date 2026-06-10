import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminInvite extends Document {
  email:     string
  token:     string
  used:      boolean
  expiresAt: Date
  createdAt: Date
}

const AdminInviteSchema = new Schema<IAdminInvite>({
  email:     { type: String, required: true, lowercase: true },
  token:     { type: String, required: true, unique: true },
  used:      { type: Boolean, default: false },
  expiresAt: { type: Date,   required: true },
}, { timestamps: true })

AdminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.AdminInvite ||
  mongoose.model<IAdminInvite>('AdminInvite', AdminInviteSchema)
