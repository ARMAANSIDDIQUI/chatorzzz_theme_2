import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import {
  FiArrowLeft, FiStar, FiShoppingBag, FiPlus, FiMinus,
  FiTruck, FiShield, FiRotateCcw, FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${slug}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        toast.error('Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!user || !product) return;
    const checkReviewStatus = async () => {
      try {
        const { data: orders } = await axios.get('/api/orders/myorders');
        const hasBought = orders.some(
          order =>
            order.status === 'Delivered' &&
            order.orderItems.some(item => item.product === product._id)
        );
        const alreadyReviewed = product.reviews?.some(r => r.user === user._id);
        setCanReview(hasBought && !alreadyReviewed);
      } catch (err) {
        console.error('Error checking review status', err);
      }
    };
    checkReviewStatus();
  }, [user, product?._id]);

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (rating < 1) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await axios.post(`/api/reviews/${product._id}`, { rating, comment });
      toast.success('Review submitted! Pending admin approval');
      setComment('');
      setRating(5);
      setCanReview(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🍬</div>
          <p className="text-fuchsia-600 font-black italic text-xl">Fetching Your Sweet...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-panel p-12 rounded-3xl">
          <div className="text-5xl mb-4">😢</div>
          <p className="text-gray-600 font-bold mb-4">Product not found.</p>
          <Link to="/products" className="candy-gradient px-6 py-3 rounded-full font-black italic text-gray-800">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const approvedReviews = product.reviews?.filter(r => r.isApproved) || [];

  return (
    <div className="min-h-screen py-8 pt-24 sm:pt-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back nav + category badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-12"
        >
          <Link
            to="/products"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-fuchsia-600 transition-all"
          >
            <div className="w-9 h-9 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-all">
              <FiArrowLeft size={15} />
            </div>
            Back to Shop
          </Link>
          <div className="glass-panel px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-fuchsia-600">
            {product.category}
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── Image Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative"
          >
            <div className="relative aspect-square w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden glass-panel p-4 sm:p-6 shadow-2xl shadow-fuchsia-200/40">
              {/* Candy blobs behind image */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-fuchsia-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-200/20 rounded-full blur-3xl" />
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full h-full object-cover rounded-[1.8rem] sm:rounded-[2.5rem] shadow-xl"
              />
            </div>

            {/* Floating verdict badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 left-6 glass-panel px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/60"
            >
              <div className="w-9 h-9 candy-gradient rounded-xl flex items-center justify-center text-white">
                <FiStar fill="currentColor" size={14} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Community</div>
                <div className="text-sm font-black italic text-gray-800">
                  {product.rating >= 4.5 ? 'Loved It 🍬' : product.rating >= 3 ? 'Pretty Good' : 'Mixed Views'}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Info Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mt-6 lg:mt-0"
          >
            {/* Stars + rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {product.rating} / 5.0 · {product.numReviews} reviews
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-fuchsia-300 pl-5">
              "{product.description}"
            </p>

            {/* Price + stock */}
            <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl text-fuchsia-400 font-black">₹</span>
                <span className="text-5xl font-black italic text-gray-900">{product.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              <div className="flex items-center justify-between glass-panel rounded-2xl p-1.5 min-w-[140px]">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-all text-gray-500 hover:text-fuchsia-600"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-black italic text-gray-800">{qty}</span>
                <button
                  onClick={() => qty < product.stock && setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-all text-gray-500 hover:text-fuchsia-600"
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                className="flex-grow flex items-center justify-center gap-3 py-4 px-8 rounded-2xl candy-gradient text-gray-900 font-black italic uppercase tracking-widest hover:shadow-xl hover:shadow-fuchsia-200/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FiShoppingBag size={20} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/40">
              {[
                { icon: FiTruck, label: 'Fast Delivery' },
                { icon: FiShield, label: 'Quality Assured' },
                { icon: FiRotateCcw, label: 'Easy Returns' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center">
                    <item.icon className="text-fuchsia-400" size={16} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Reviews Section ── */}
        <section className="mt-20 sm:mt-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic text-gray-900 tracking-tight mb-3">
              Sweet Thoughts 💬
            </h2>
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <span className="h-px w-10 bg-fuchsia-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">
                {product.numReviews} verified reviews
              </span>
              <span className="h-px w-10 bg-fuchsia-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Form or locked state */}
            <div>
              {canReview ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 sm:p-8 rounded-3xl"
                >
                  <h3 className="text-xl font-black italic text-gray-900 mb-6">Share Your Experience</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i)}
                          className={`text-3xl transition-transform hover:scale-110 ${rating >= i ? 'text-amber-400' : 'text-gray-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="What did you think of this sweet?"
                      className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 font-medium italic text-gray-600 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 candy-gradient rounded-2xl font-black italic uppercase text-sm tracking-widest text-gray-800 hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-fuchsia-200/60 min-h-[200px]">
                  <div className="w-14 h-14 candy-gradient rounded-full flex items-center justify-center text-white">
                    <FiShield size={26} />
                  </div>
                  <div>
                    <h4 className="font-black italic text-gray-800 text-lg mb-1">Members Only</h4>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                      {user
                        ? 'Only verified buyers who received their order can leave a review.'
                        : 'Login and purchase this product to leave a review.'}
                    </p>
                  </div>
                  {!user && (
                    <Link
                      to="/login"
                      className="px-6 py-2.5 candy-gradient rounded-full font-black italic text-sm text-gray-800 hover:shadow-md transition-all"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Review list */}
            <div className="space-y-4">
              {approvedReviews.length === 0 ? (
                <div className="glass-panel p-10 rounded-3xl text-center">
                  <div className="text-4xl mb-3">🍭</div>
                  <p className="text-gray-400 font-black italic uppercase tracking-widest text-sm">
                    No reviews yet. Be the first!
                  </p>
                </div>
              ) : (
                approvedReviews.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-panel p-5 sm:p-6 rounded-2xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-black italic text-gray-800 flex items-center gap-2">
                          {review.name}
                          {review.isAdminReview && (
                            <span className="bg-fuchsia-100 text-fuchsia-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                              Staff
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400 mt-1">
                          {[...Array(review.rating)].map((_, j) => (
                            <FiStar key={j} size={11} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-300 font-black uppercase italic">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium italic leading-relaxed text-sm">
                      "{review.comment}"
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;
