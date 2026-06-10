// src/models/SiteSettings.ts
// Stores all dynamic site-wide settings as key-value pairs
// Same pattern as SiteContent but for settings/config
import mongoose, { Schema, Document } from 'mongoose'

export interface ISiteSetting extends Document {
  key:   string
  value: string   // always stored as string, parsed as needed on frontend
  group: string   // 'social' | 'brand_story' | 'categories' | 'about' | 'general'
  label: string   // human-readable label for admin UI
}

const SiteSettingSchema = new Schema<ISiteSetting>({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
  group: { type: String, required: true },
  label: { type: String, required: true },
})

export default mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema)
