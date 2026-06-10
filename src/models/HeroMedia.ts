import mongoose, { Schema, Document } from 'mongoose'

export interface IHeroMedia extends Document {
  type: 'video' | 'image'
  url: string
  active: boolean
}

const HeroMediaSchema = new Schema<IHeroMedia>({
  type:   { type: String, required: true, enum: ['video', 'image'] },
  url:    { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.HeroMedia || mongoose.model<IHeroMedia>('HeroMedia', HeroMediaSchema)
