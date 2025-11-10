import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config/db'

const Admin = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    image: '',
    price: '',
    features: '',
    isFeatured: false
  })

  // Load products from MongoDB
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products`)
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      toast.error('Failed to load products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        // Update existing product
        await axios.put(`${API_BASE_URL}/products`, { id: editingId, ...formData })
        toast.success('Product updated successfully!')
      } else {
        // Add new product
        await axios.post(`${API_BASE_URL}/products`, formData)
        toast.success('Product added successfully!')
      }

      // Reset form and refresh
      setFormData({
        category: '',
        title: '',
        description: '',
        image: '',
        price: '',
        features: '',
        isFeatured: false
      })
      setShowForm(false)
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to save product')
      console.error(error)
    }
  }

  // Edit product
  const handleEdit = (product) => {
    setFormData({
      category: product.category,
      title: product.title,
      description: product.description,
      image: product.image,
      price: product.price,
      features: product.features || '',
      isFeatured: product.isFeatured || false
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/products`, { data: { id } })
        toast.success('Product deleted successfully!')
        fetchProducts()
      } catch (error) {
        toast.error('Failed to delete product')
        console.error(error)
      }
    }
  }

  // Toggle featured status
  const toggleFeatured = async (product) => {
    try {
      await axios.put(`${API_BASE_URL}/products`, {
        id: product._id,
        ...product,
        isFeatured: !product.isFeatured
      })
      toast.success('Featured status updated!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update status')
      console.error(error)
    }
  }

  // Get featured count
  const featuredCount = products.filter(p => p.isFeatured).length

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-2xl'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen py-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-gray-700 dark:text-white'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-7xl mx-auto'
      >
        {/* Header */}
        <div className='flex justify-between items-center mb-10'>
          <div>
            <h1 className='text-4xl font-bold'>
              Product <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Management</span>
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Total Products: {products.length} | Featured in Banner: {featuredCount}
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                category: '',
                title: '',
                description: '',
                image: '',
                price: '',
                features: '',
                isFeatured: false
              })
            }}
            className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all'
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className='bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 mb-10 shadow-xl'
          >
            <h2 className='text-2xl font-bold mb-6'>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block mb-2 font-medium'>Category</label>
                <input
                  type='text'
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                  placeholder='e.g., SaaS Solutions'
                  required
                />
              </div>

              <div>
                <label className='block mb-2 font-medium'>Title</label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                  placeholder='Product Title'
                  required
                />
              </div>

              <div>
                <label className='block mb-2 font-medium'>Price</label>
                <input
                  type='text'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                  placeholder='₹999.99'
                  required
                />
              </div>

              <div>
                <label className='block mb-2 font-medium'>Product Image</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                />
                {formData.image && (
                  <img src={formData.image} alt='Preview' className='mt-2 w-32 h-32 object-cover rounded-lg' />
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='block mb-2 font-medium'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows='4'
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                  placeholder='Product description...'
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block mb-2 font-medium'>Features (comma separated)</label>
                <input
                  type='text'
                  name='features'
                  value={formData.features}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent outline-none'
                  placeholder='Feature 1, Feature 2, Feature 3'
                />
              </div>

              {/* Featured Toggle */}
              <div className='md:col-span-2'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isFeatured'
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className='w-5 h-5 accent-primary cursor-pointer'
                  />
                  <span className='font-medium'>
                    Show in Banner Slider (Featured Product)
                  </span>
                </label>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8'>
                  Enable this to display the product in the homepage banner slider
                </p>
              </div>
            </div>

            <button
              type='submit'
              className='mt-6 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-all'
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </motion.form>
        )}

        {/* Products List */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.length === 0 ? (
            <p className='col-span-full text-center text-gray-500 py-10'>No products added yet. Click "Add Product" to get started.</p>
          ) : (
            products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl relative'
              >
                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className='absolute top-4 right-4 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-xs px-3 py-1 rounded-full font-semibold'>
                    ⭐ Featured
                  </div>
                )}

                {product.image && (
                  <img src={product.image} alt={product.title} className='w-full h-48 object-cover rounded-lg mb-4' />
                )}
                <p className='text-xs text-primary font-semibold uppercase mb-2'>{product.category}</p>
                <h3 className='text-xl font-bold mb-2'>{product.title}</h3>
                <p className='text-gray-600 dark:text-gray-400 mb-2 text-sm line-clamp-2'>{product.description}</p>
                <p className='text-lg font-bold text-primary mb-4'>{product.price}</p>
                
                <div className='flex flex-col gap-3'>
                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`w-full py-2 rounded-lg transition-all font-medium ${
                      product.isFeatured 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {product.isFeatured ? '⭐ Featured in Banner' : 'Add to Banner'}
                  </button>

                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleEdit(product)}
                      className='flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className='flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Admin
