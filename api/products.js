import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// Product Schema
const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  features: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// MongoDB Connection with caching
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// API Handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // GET all products
    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 })
      return res.status(200).json({ success: true, data: products })
    }

    // POST new product
    if (req.method === 'POST') {
      const product = await Product.create(req.body)
      return res.status(201).json({ success: true, data: product })
    }

    // PUT update product
    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body
      const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
      return res.status(200).json({ success: true, data: product })
    }

    // DELETE product
    if (req.method === 'DELETE') {
      const { id } = req.body
      await Product.findByIdAndDelete(id)
      return res.status(200).json({ success: true, message: 'Product deleted' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
