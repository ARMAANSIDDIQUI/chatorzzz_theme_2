import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { 
  FiArrowLeft, FiStar, FiShoppingBag, FiPlus, FiMinus, 
  FiTruck, FiShield, FiRotateCcw 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Product = () => {
  const { id } = useParams();
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
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        toast.error('Product not found');
        setLoading(false);
      }
    };

    const checkReviewStatus = async () => {
      if (!user) return;
      try {
        // We'll use a special check endpoint or just filter orders on frontend
        // For security, backend check is better. Let's assume we have an endpoint or just check results.
        const { data: orders } = await axios.get('/api/orders/myorders');
        const hasBought = orders.some(order => 
          order.status === 'Delivered' && 
          order.orderItems.some(item => item.product === id)
        );
        const alreadyReviewed = product?.reviews?.some(r => r.user === user._id);
        setCanReview(hasBought && !alreadyReviewed);
      } catch (err) {
        console.error('Error checking review status', err);
      }
    };

    fetchProduct();
    if (user) checkReviewStatus();
  }, [id, user, product?.reviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await axios.post(`/api/reviews/${id}`, { rating, comment });
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

  if (loading) return <div className="text-center py-40 text-fuchsia-500 font-black animate-pulse text-3xl italic">Fetching Your Sweet...</div>;
  if (!product) return <div className="text-center py-40 text-gray-500 font-bold">Product not found. <Link to="/products" className="text-fuchsia-500 underline">Back to Shop</Link></div>;

  return (
    <div className="relative min-h-screen bg-white selection:bg-fuchsia-100">
      {/* Background Floating Text */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-[0.03]">
        <h1 className="text-[25vw] font-black italic uppercase tracking-tighter leading-none whitespace-nowrap -rotate-12 translate-x-[-10%] translate-y-[20%] text-gray-900">
          {product.name}
        </h1>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <header className="flex justify-between items-center mb-16">
          <Link to="/products" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-fuchsia-500 transition-all">
            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-fuchsia-200 transition-all">
              <FiArrowLeft size={16} />
            </div>
            Back to Library
          </Link>
          <div className="px-6 py-2 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">
            {product.category} — ID: {product._id?.slice(-6)}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Side: Information Content */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.rating} / 5.0</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-7xl md:text-8xl font-black italic text-gray-900 leading-[0.9] tracking-tighter mb-8"
              >
                {product.name.split(' ').map((word, i) => (
                  <span key={i} className="block last:text-fuchsia-500">{word}</span>
                ))}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg font-medium leading-relaxed max-w-md italic border-l-4 border-fuchsia-100 pl-6"
              >
                "{product.description}"
              </motion.p>
            </div>

            <div className="space-y-4">
              <div className="text-6xl font-black text-gray-900 flex items-baseline gap-2 italic">
                <span className="text-2xl text-fuchsia-300">$</span>
                {product.price}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {product.stock > 0 ? `${product.stock} Units In Vault` : 'Vault Empty'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-8">
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 min-w-[140px] border border-gray-100">
                <button 
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-400 hover:text-gray-900"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-black italic">{qty}</span>
                <button 
                  onClick={() => qty < product.stock && setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-400 hover:text-gray-900"
                >
                  <FiPlus />
                </button>
              </div>

              <button 
                onClick={() => addToCart(product, qty)}
                className="flex-grow flex items-center justify-center gap-4 py-5 px-10 rounded-2xl bg-gray-900 text-white font-black italic uppercase tracking-widest hover:bg-fuchsia-600 transition-all group active:scale-95 shadow-2xl shadow-gray-200"
              >
                <FiShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                Capture Sweet
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-100">
              {[
                { icon: FiTruck, label: 'Swift' },
                { icon: FiShield, label: 'Pure' },
                { icon: FiRotateCcw, label: 'Legal' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start gap-2">
                   <item.icon className="text-gray-300" size={18} />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Center (Asymmetrical Image) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, rotate: 5, y: 50 }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative aspect-[4/5] lg:aspect-square w-full"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border-[1.5px] border-fuchsia-100 rounded-full pointer-events-none"></div>
              <div className="absolute bottom-10 left-[-20px] px-6 py-4 bg-white shadow-2xl rounded-2xl z-20 border border-gray-50 flex items-center gap-4 max-w-xs group cursor-default">
                 <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center text-fuchsia-400">
                    <FiStar fill="currentColor" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase text-gray-300 mb-0.5">Community Veridict</div>
                    <div className="text-sm font-black italic text-gray-800">Magically Recommended</div>
                 </div>
              </div>

              <div className="w-full h-full bg-gray-50 rounded-[4rem] lg:rounded-[6rem] overflow-hidden p-6 relative group">
                <motion.div 
                  className="absolute inset-0 bg-fuchsia-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  whileHover={{ scale: 1.05 }}
                />
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-[3rem] lg:rounded-[5rem] shadow-2xl relative z-10 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <section className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black italic text-gray-900 tracking-tighter mb-4">Unwrapped Thoughts</h2>
            <div className="flex items-center justify-center gap-4 text-gray-400">
               <span className="h-[1px] w-12 bg-gray-100"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">{product.numReviews} Verified Sessions</span>
               <span className="h-[1px] w-12 bg-gray-100"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Form Side */}
            <div className="space-y-8">
              {canReview ? (
                <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                  <h3 className="text-2xl font-black italic text-gray-900 mb-8">Add Your Layer</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div className="flex gap-4">
                      {[1,2,3,4,5].map(i => (
                        <button key={i} type="button" onClick={() => setRating(i)} className={`text-3xl ${rating >= i ? 'text-amber-400' : 'text-gray-200'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="The sensation was..."
                      className="w-full bg-white rounded-2xl p-6 border-none focus:ring-2 focus:ring-fuchsia-200 font-medium italic text-gray-600"
                    />
                    <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black italic uppercase text-sm tracking-widest hover:bg-fuchsia-500 transition-all">
                      Finalize Thought
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-100 p-10 rounded-[3rem] text-center flex flex-col items-center justify-center py-20">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                      <FiShield size={32} />
                   </div>
                   <h4 className="font-black italic text-gray-800 text-xl mb-2">Member Vault Only</h4>
                   <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                     Reviews are exclusively reserved for those who have experienced the magic.
                   </p>
                </div>
              )}
            </div>

            {/* List Side */}
            <div className="space-y-6">
              {!product.reviews || product.reviews.filter(r => r.isApproved).length === 0 ? (
                <div className="bg-white p-12 text-center text-gray-300 font-black italic uppercase tracking-tighter text-2xl">
                  Vacuum Detected...
                </div>
              ) : (
                product.reviews.filter(r => r.isApproved).map((review, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-white border border-gray-50 shadow-sm relative overflow-hidden group hover:border-fuchsia-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div>
                          <div className="text-lg font-black italic text-gray-900 flex items-center gap-2">
                            {review.name}
                            {review.isAdminReview && <span className="bg-fuchsia-50 text-fuchsia-500 uppercase text-[8px] font-black px-2 py-0.5 rounded tracking-widest">Admin</span>}
                          </div>
                          <div className="flex text-amber-300 mt-1">
                            {[...Array(review.rating)].map((_, i) => <FiStar size={10} key={i} fill="currentColor" />)}
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-gray-300 uppercase italic">
                         {new Date(review.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="text-gray-500 font-medium italic relative z-10 leading-relaxed group-hover:text-gray-700 transition-colors">
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
