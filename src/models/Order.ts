import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  productId:   string
  name:        string
  image:       string
  price:       number
  quantity:    number
  selectedSize?:  string
  measurements?: {
    bust?:   string
    waist?:  string
    hip?:    string
    height?: string
    sleeve?: string
    notes?:  string
  }
}

export interface IDeliveryAddress {
  fullName:     string
  phone:        string
  addressLine1: string
  addressLine2?: string
  city:         string
  state:        string
  pincode:      string
  country:      string
}

export interface IOrder extends Document {
  customerId:        string
  customerEmail:     string
  customerName:      string
  items:             IOrderItem[]
  deliveryAddress:   IDeliveryAddress
  subtotal:          number
  deliveryCharge:    number
  total:             number
  couponCode?:       string
  couponDiscount?:   number
  status:            'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  razorpayOrderId?:  string
  razorpayPaymentId?: string
  razorpaySignature?: string
  paymentStatus:     'pending' | 'paid' | 'failed'
  notes?:            string
  createdAt:         Date
  updatedAt:         Date
}

const OrderSchema = new Schema<IOrder>({
  customerId:     { type: String, required: true, index: true },
  customerEmail:  { type: String, required: true },
  customerName:   { type: String, required: true },

  items: [{
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    image:     { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    selectedSize:  { type: String },
    measurements: {
      bust:   { type: String },
      waist:  { type: String },
      hip:    { type: String },
      height: { type: String },
      sleeve: { type: String },
      notes:  { type: String },
    },
  }],

  deliveryAddress: {
    fullName:     { type: String, required: true },
    phone:        { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    pincode:      { type: String, required: true },
    country:      { type: String, default: 'India' },
  },

  subtotal:       { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  total:          { type: Number, required: true },
  couponCode:     { type: String },
  couponDiscount: { type: Number, default: 0 },

  status: {
    type:    String,
    enum:    ['pending','confirmed','processing','shipped','completed','cancelled'],
    default: 'pending',
  },

  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  paymentStatus: {
    type:    String,
    enum:    ['pending','paid','failed'],
    default: 'pending',
  },

  notes: { type: String },
}, { timestamps: true })

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema)
