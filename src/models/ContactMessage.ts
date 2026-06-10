import mongoose, { Schema, Document } from 'mongoose'

export interface IContactMessage extends Document {
  name:     string
  surname?: string
  email:    string
  phone?:   string
  topic?:   string
  message:  string
  read:     boolean
  createdAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>({
  name:     { type: String, required: true },
  surname:  { type: String },
  email:    { type: String, required: true, lowercase: true },
  phone:    { type: String },
  topic:    { type: String },
  message:  { type: String, required: true },
  read:     { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema)
