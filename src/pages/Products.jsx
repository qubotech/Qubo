import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import assets from '../assets/assets'
import axios from 'axios'
import { API_BASE_URL } from '../config/db'

const Products = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load products from MongoDB
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products`)
      if (data.success) {
        setProducts(data.data)
        const featured = data.data.filter(product => product.isFeatured)
        setFeaturedProducts(featured)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-scroll effect for featured products
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % featuredProducts.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [featuredProducts.length])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-700 dark:text-white'>
        <div className='text-2xl'>Loading products...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen text-gray-700 dark:text-white'>
      
      {/* Background Image */}
      <img src={assets.bgImage1} alt="" className='absolute top-20 -left-40 -z-1 dark:hidden'/>
      
      {/* Featured Products Slider */}
      {featuredProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='relative px-4 sm:px-12 lg:px-24 xl:px-40 pt-10 pb-20'
        >
          <div className='relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl'>
            <div className='grid lg:grid-cols-2 gap-10 p-8 sm:p-16 items-center min-h-[500px]'>
              
              {/* Left Content */}
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className='space-y-6'
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className='text-sm font-semibold text-primary uppercase tracking-wider'
                >
                  {featuredProducts[activeSlide].category}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight'
                >
                  {featuredProducts[activeSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className='text-lg text-gray-600 dark:text-gray-300'
                >
                  {featuredProducts[activeSlide].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className='flex items-center gap-4'
                >
                  <span className='text-3xl font-bold text-primary'>
                    {featuredProducts[activeSlide].price.startsWith('₹') 
                      ? featuredProducts[activeSlide].price 
                      : `₹${featuredProducts[activeSlide].price}`}
                  </span>
                  <button className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg'>
                    Buy Now
                  </button>
                </motion.div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                key={`img-${activeSlide}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='relative'
              >
                <img 
                  src={featuredProducts[activeSlide].image || assets.hero_img} 
                  alt={featuredProducts[activeSlide].title}
                  className='w-full h-auto drop-shadow-2xl rounded-lg'
                />
              </motion.div>
            </div>

            {/* Slide Navigation Dots */}
            <div className='absolute bottom-8 right-8 flex gap-3'>
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    activeSlide === index 
                      ? 'bg-white dark:bg-gray-700 border-primary scale-110' 
                      : 'bg-transparent border-gray-400 dark:border-gray-500 hover:border-primary'
                  }`}
                >
                  <span className='font-semibold text-sm'>{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* All Products Grid Section */}
      <div className='px-4 sm:px-12 lg:px-24 xl:px-40 py-20'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl sm:text-5xl font-medium mb-4'>
            Our <span className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent'>Products</span>
          </h2>
          <p className='text-lg text-gray-500 dark:text-white/75 max-w-2xl mx-auto'>
            Explore our innovative digital solutions designed to transform your business.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-xl text-gray-500 dark:text-gray-400'>No products available yet.</p>
            <p className='text-sm text-gray-400 mt-2'>Products will appear here once added from the admin panel.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto'
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                className='bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl'
              >
                {product.image && (
                  <img src={product.image} alt={product.title} className='w-full h-48 object-cover rounded-lg mb-4' />
                )}
                <p className='text-xs text-primary font-semibold uppercase mb-2'>{product.category}</p>
                <h3 className='text-xl font-bold mb-3'>{product.title}</h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
                  {product.description}
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-2xl font-bold text-primary'>
                    {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                  </span>
                  <button className='bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-all'>
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Products
