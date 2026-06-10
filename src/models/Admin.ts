import mongoose, { Schema, Document } from 'mongoose'

export interface IAdmin extends Document {
  name: string
  email: string
  password: string
  role: string
}

const AdminSchema = new Schema<IAdmin>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'admin' },
}, { timestamps: true })

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)
