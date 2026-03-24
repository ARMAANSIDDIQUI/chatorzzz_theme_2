import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, ShoppingCart, Package, Download, TrendingUp,
  BarChart3, PieChart as PieChartIcon, ArrowUpRight,
  Settings, LogOut, Search, Plus, Edit, Trash2, CheckCircle, XCircle, List
} from 'lucide-react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Cell, Pie, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { Image } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white"
      >
        <div className="candy-gradient p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-black italic">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [salesData, setSalesData] = useState([
    { name: 'Sun', sales: 0 }, { name: 'Mon', sales: 0 }, { name: 'Tue', sales: 0 },
    { name: 'Wed', sales: 0 }, { name: 'Thu', sales: 0 }, { name: 'Fri', sales: 0 }, { name: 'Sat', sales: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [galleryType, setGalleryType] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [isCatLoading, setIsCatLoading] = useState(false);

  const orderStatusDistribution = useMemo(() => {
    const counts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const COLORS = ['#f0abfc', '#67e8f9', '#34d399', '#fbbf24', '#f87171'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes, reviewsRes, galleryRes, inquiriesRes, categoriesRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/products'),
          axios.get('/api/auth/users'),
          axios.get('/api/reviews/pending'),
          axios.get('/api/gallery'),
          axios.get('/api/contact'),
          axios.get('/api/categories')
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data || []);
        setPendingReviews(reviewsRes.data || []);
        setGalleryItems(galleryRes.data || []);
        setInquiries(inquiriesRes.data || []);
        setCategories(categoriesRes.data || []);

        // Calculate dynamic weekly sales chart
        const dailySales = [
          { name: 'Sun', sales: 0 }, { name: 'Mon', sales: 0 }, { name: 'Tue', sales: 0 },
          { name: 'Wed', sales: 0 }, { name: 'Thu', sales: 0 }, { name: 'Fri', sales: 0 }, { name: 'Sat', sales: 0 }
        ];

        let revenue = 0;
        ordersRes.data.forEach(order => {
          if (order.isPaid) {
            revenue += order.totalPrice;
            const date = new Date(order.createdAt);
            const dayIndex = date.getDay();
            dailySales[dayIndex].sales += order.totalPrice;
          }
        });

        setSalesData(dailySales);
        setStats({
          users: (usersRes.data || []).length,
          orders: ordersRes.data.length,
          products: productsRes.data.length,
          revenue
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadCSV = (type) => {
    let data = [];
    let headers = [];

    if (type === 'users') {
      data = users;
      headers = ['Name', 'Email', 'Role', 'Verified'];
    } else if (type === 'orders') {
      data = orders;
      headers = ['Order ID', 'User', 'Total', 'Payment', 'Status'];
    } else if (type === 'products') {
      data = products;
      headers = ['Name', 'Category', 'Price', 'Stock'];
    }

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (type === 'users') return `${item.name},${item.email},${item.role},${item.isVerified}`;
        if (type === 'orders') return `${item._id},${item.user?.name || 'Guest'},${item.totalPrice},${item.isPaid ? 'Paid' : 'Unpaid'},${item.status}`;
        if (type === 'products') return `${item.name},${item.category},${item.price},${item.stock}`;
        return '';
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${type}_backup_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} backup downloaded!`);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success(`Order set to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure? Removing a category might affect product filtering.')) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category removed');
    } catch (err) {
      toast.error('Failed to remove category');
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsCatLoading(true);
    try {
      const { data } = await axios.post('/api/categories', { name: newCatName });
      setCategories(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)));
      setNewCatName('');
      toast.success('Category added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsCatLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-fuchsia-500 text-3xl italic">Loading Administrative Panel...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50 pt-24">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 candy-gradient rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <Settings size={40} className="text-white animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black italic text-gray-800">Admin Panel</h2>
        </div>

        <nav className="w-full space-y-4 flex-grow">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'reviews', icon: Edit, label: 'Reviews' },
            { id: 'gallery', icon: Image, label: 'Gallery' },
            { id: 'categories', icon: List, label: 'Categories' },
            { id: 'inquiries', icon: FiMessageSquare, label: 'Inquiries' },
            { id: 'users', icon: Users, label: 'Customers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                ? 'candy-gradient text-white shadow-xl'
                : 'text-gray-500 hover:bg-white hover:text-fuchsia-500'
                }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto w-full pt-8 border-t border-gray-200">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            Exit Panel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic text-gray-800">
              Welcome, Boss!
            </h1>
            <p className="text-gray-500 font-medium">Here's what's happening today in the candy shop.</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => downloadCSV(activeTab === 'overview' ? 'orders' : activeTab)}
              className="px-6 py-3 bg-white rounded-2xl font-bold text-gray-600 shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-gray-100"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
                { label: 'Active Orders', value: stats.orders, icon: ShoppingCart, color: 'text-fuchsia-500', bg: 'bg-fuchsia-100' },
                { label: 'Total Products', value: stats.products, icon: Package, color: 'text-cyan-500', bg: 'bg-cyan-100' },
                { label: 'Sweet Customers', value: stats.users, icon: Users, color: 'text-amber-500', bg: 'bg-amber-100' }
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-6 rounded-[2rem] flex items-center gap-6">
                  <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                  <TrendingUp className="text-fuchsia-500" />
                  Sales Performance
                </h3>
                <div className="h-[300px] w-full relative min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontWeight: 600 }} />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="sales" stroke="#d946ef" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                  <PieChartIcon className="text-cyan-500" />
                  Order Status Distribution
                </h3>
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={orderStatusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-300 w-64" placeholder="Search orders..." />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-fuchsia-50/30 transition-all">
                      <td className="px-8 py-6 font-bold text-gray-800">{order._id.substring(0, 8)}...</td>
                      <td className="px-8 py-6 text-gray-600 font-medium">{order.user?.name || 'Guest'}</td>
                      <td className="px-8 py-6 font-black text-gray-800">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black italic uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'Out for delivery' ? 'bg-cyan-100 text-cyan-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <select
                          className="bg-white border rounded-xl px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-fuchsia-300"
                          defaultValue={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for delivery">Out for dev</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="glass-panel rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Pending Reviews Moderation</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Comment</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Rating</th>
                      <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReviews.length === 0 ? (
                      <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 italic font-bold">No pending reviews found.</td></tr>
                    ) : pendingReviews.map(item => (
                      <tr key={item.review._id} className="hover:bg-fuchsia-50/30 transition-all">
                        <td className="px-8 py-6 font-bold text-gray-800">{item.productName}</td>
                        <td className="px-8 py-6 text-gray-600">{item.review.name}</td>
                        <td className="px-8 py-6 text-gray-500 italic">"{item.review.comment}"</td>
                        <td className="px-8 py-6">
                          <div className="flex text-amber-400">
                            {[...Array(item.review.rating)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                await axios.put(`/api/reviews/${item.productId}/${item.review._id}/approve`);
                                setPendingReviews(prev => prev.filter(r => r.review._id !== item.review._id));
                                toast.success('Review Approved!');
                              } catch (e) { toast.error('Approval failed'); }
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await axios.delete(`/api/reviews/${item.productId}/${item.review._id}`);
                                setPendingReviews(prev => prev.filter(r => r.review._id !== item.review._id));
                                toast.success('Review Rejected');
                              } catch (e) { toast.error('Rejection failed'); }
                            }}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                          >
                            <XCircle size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct Admin Review Creation */}
            <div className="glass-panel p-10 rounded-[2.5rem]">
              <h3 className="text-2xl font-black italic text-gray-800 mb-8">Admin Direct Reviews</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const productId = form.product.value;
                const rating = form.rating.value;
                const comment = form.comment.value;
                const userName = form.userName.value;

                if (!productId) return toast.error('Select a product');

                try {
                  await axios.post(`/api/reviews/${productId}/admin`, { rating, comment, userName });
                  toast.success('Admin Review Created!');
                  form.reset();
                } catch (e) { toast.error('Creation failed'); }
              }}>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Product</label>
                  <select name="product" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold text-gray-600">
                    <option value="">Select Sweets...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Rating</label>
                  <input name="rating" type="number" min="1" max="5" defaultValue="5" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Fake Username (Optional)</label>
                  <input name="userName" type="text" placeholder="e.g. CandyLover" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" />
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Comment</label>
                  <input name="comment" required type="text" placeholder="Magical taste!" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" />
                </div>
                <button type="submit" className="md:col-span-2 lg:col-span-4 w-full py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg">
                  Deploy Magical Review
                </button>
              </form>
            </div>
          </motion.div>
        )}
        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="glass-panel p-10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black italic text-gray-800 mb-2">Dynamic Media Hub</h3>
                  <p className="text-gray-500 font-medium text-sm">Organize your sweet world into "Video Showcases" and "Image Snapshots".</p>
                </div>
                <button
                  onClick={() => {
                    setGalleryType('image');
                    setPreview(null);
                    setFileName('');
                    setSelectedFile(null);
                    setModal({ isOpen: true, type: 'gallery', data: null });
                  }}
                  className="px-8 py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} /> Add New Slide
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item._id}
                    className="group relative h-48 rounded-3xl overflow-hidden border-4 border-white shadow-xl cursor-pointer"
                  >
                    {item.video ? (
                      <video src={item.video} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryType(item.type || 'image');
                          setPreview(null);
                          setFileName('');
                          setSelectedFile(null);
                          setModal({ isOpen: true, type: 'gallery', data: item });
                        }}
                        className="bg-white/20 hover:bg-white/40 p-3 rounded-xl backdrop-blur-md text-white transition-all transform hover:scale-110"
                      >
                        <Edit size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({
                            isOpen: true,
                            type: 'confirmDelete',
                            data: {
                              title: 'Burn this slide?',
                              message: 'Are you sure you want to delete this gallery item?',
                              onConfirm: async () => {
                                try {
                                  const id = item._id || item.id;
                                  await axios.delete(`/api/gallery/${id}`);
                                  setGalleryItems(prev => prev.filter(i => (i._id || i.id) !== id));
                                  toast.success('Slide removed!');
                                  setModal(prev => ({ ...prev, isOpen: false }));
                                } catch (err) {
                                  toast.error('Failed to remove slide');
                                }
                              }
                            }
                          });
                        }}
                        className="bg-red-500/80 hover:bg-red-600 p-3 rounded-xl backdrop-blur-md text-white transition-all transform hover:scale-110"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                    <div className="absolute top-3 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase italic text-fuchsia-500">
                        {item.title}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase italic text-white shadow-sm ${item.type === 'video' ? 'bg-cyan-500/80' : 'bg-fuchsia-500/80'}`}>
                        {item.type || 'image'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="glass-panel p-10 rounded-[2.5rem]">
              <h3 className="text-2xl font-black italic text-gray-800 mb-8">Product Categories</h3>
              
              <form onSubmit={createCategory} className="mb-10 flex gap-4">
                <input 
                  type="text" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New Category Name (e.g. Sour Belts)"
                  className="flex-grow bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-fuchsia-300 font-bold"
                />
                <button 
                  type="submit" 
                  disabled={isCatLoading}
                  className="px-8 py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Plus size={20} /> Add Category
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat._id} className="bg-white border-2 border-fuchsia-100 rounded-3xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div>
                      <p className="font-black italic text-fuchsia-900 text-lg uppercase">{cat.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Slug: {cat.slug}</p>
                    </div>
                    <button 
                      onClick={() => deleteCategory(cat._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h3 className="text-3xl font-black italic text-gray-900 tracking-tighter">Site Inquiries</h3>
            <div className="grid grid-cols-1 gap-6">
              {inquiries.length === 0 ? (
                <div className="glass-panel p-20 text-center text-gray-300 font-black italic">No messages...</div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq._id} className="glass-panel p-8 rounded-[2.5rem] relative group border-white/60">
                    <button
                      onClick={() => {
                        setModal({
                          isOpen: true,
                          type: 'confirmDelete',
                          data: {
                            title: 'Delete Inquiry?',
                            message: 'Are you sure you want to permanently remove this inquiry?',
                            onConfirm: async () => {
                              await axios.delete(`/api/contact/${inq._id}`);
                              setInquiries(inquiries.filter(i => i._id !== inq._id));
                              toast.success('Inquiry deleted');
                              setModal({ ...modal, isOpen: false });
                            }
                          }
                        });
                      }}
                      className="absolute top-6 right-6 p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-500 font-bold italic">
                        {inq.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black italic text-gray-800 text-lg">{inq.name}</h4>
                        <p className="text-xs text-gray-400 font-medium">{inq.email} • {new Date(inq.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-white/50 p-6 rounded-2xl border border-white/40">
                      <p className="text-[10px] font-black uppercase text-fuchsia-400 mb-2 tracking-widest">{inq.subject}</p>
                      <p className="text-gray-600 font-medium italic">"{inq.message}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Customer Management</h3>
              <button onClick={() => downloadCSV('users')} className="flex items-center gap-2 text-fuchsia-500 font-bold hover:text-fuchsia-600">
                <Download size={18} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Verified</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-fuchsia-50/30 transition-all">
                      <td className="px-8 py-6 font-bold text-gray-800 flex items-center gap-3">
                        {u.profileImage ? <img src={u.profileImage} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-500 font-bold">{u.name[0]}</div>}
                        {u.name}
                      </td>
                      <td className="px-8 py-6 text-gray-600 font-medium">{u.email}</td>
                      <td className="px-8 py-6">
                        {u.isVerified ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${u.role === 'admin' ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <select
                          className="bg-white border rounded-xl px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-fuchsia-300"
                          defaultValue={u.role}
                          onChange={async (e) => {
                            try {
                              const newRole = e.target.value;
                              await axios.put(`/api/auth/users/${u._id}/role`, { role: newRole });
                              setUsers(users.map(user => user._id === u._id ? { ...user, role: newRole } : user));
                              toast.success('User role updated!');
                            } catch (err) { toast.error('Failed to update role'); }
                          }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black italic text-fuchsia-900 tracking-tight">Product Inventory</h3>
              <button
                onClick={() => {
                  setPreview(null);
                  setFileName('');
                  setSelectedFile(null);
                  setModal({ isOpen: true, type: 'product', data: null });
                }}
                className="px-8 py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg flex items-center gap-2"
              >
                <Plus size={20} /> Add New Candy
              </button>
            </div>

            {/* Product List */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Product Inventory</h3>
                <button onClick={() => downloadCSV('products')} className="flex items-center gap-2 text-fuchsia-500 font-bold hover:text-fuchsia-600">
                  <Download size={18} /> Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                      <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-fuchsia-50/30 transition-all">
                        <td className="px-8 py-4 font-bold text-gray-800 flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          {p.name}
                        </td>
                        <td className="px-8 py-4 text-gray-600 font-bold">{p.category}</td>
                        <td className="px-8 py-4 text-gray-800 font-black">₹{p.price.toFixed(2)}</td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${p.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setModal({ isOpen: true, type: 'product', data: p });
                            }}
                            className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-all inline-block"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setModal({
                                isOpen: true,
                                type: 'confirmDelete',
                                data: {
                                  title: 'Delete this sweet?',
                                  message: `Are you sure you want to delete ${p.name}? This cannot be undone.`,
                                  onConfirm: async () => {
                                    await axios.delete(`/api/products/${p._id}`);
                                    setProducts(products.filter(prod => prod._id !== p._id));
                                    toast.success('Product deleted');
                                    setModal({ ...modal, isOpen: false });
                                  }
                                }
                              });
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all inline-block"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Admin Modals */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={
          modal.type === 'gallery' ? 'Edit Gallery Card' :
            modal.type === 'product' ? (modal.data ? 'Edit Product' : 'Add New Product') :
              modal.data?.title || 'Notification'
        }
      >
        {modal.type === 'product' && (
          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target;
            const editingP = modal.data;

            if (!selectedFile && !editingP) return toast.error('Please select an image');

            toast.loading(editingP ? 'Updating product...' : 'Creating product...', { id: 'modal-product' });
            try {
              let imageUrl = editingP ? editingP.image : '';
              if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const { data: upRes } = await axios.post('/api/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = upRes.url;
              }

              const productData = {
                name: modal.data?.name,
                category: modal.data?.category,
                price: Number(modal.data?.price),
                stock: Number(modal.data?.stock),
                description: modal.data?.description,
                image: imageUrl
              };

              if (editingP) {
                const { data } = await axios.put(`/api/products/${editingP._id}`, productData);
                setProducts(products.map(p => p._id === editingP._id ? data : p));
                toast.success('Product updated!', { id: 'modal-product' });
              } else {
                const { data } = await axios.post('/api/products', productData);
                setProducts([...products, data]);
                toast.success('Product added!', { id: 'modal-product' });
              }
              setModal({ ...modal, isOpen: false });
            } catch (err) {
              console.error('Product Save Error:', err);
              toast.error('Failed to save product', { id: 'modal-product' });
            }
          }}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Name</label>
                <input 
                  name="name" 
                  required 
                  value={modal.data?.name || ''} 
                  onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price (₹)</label>
                  <input 
                    name="price" 
                    required 
                    value={modal.data?.price || ''} 
                    onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, price: e.target.value } }))}
                    type="number" 
                    step="0.01" 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Stock</label>
                  <input 
                    name="stock" 
                    required 
                    value={modal.data?.stock || ''} 
                    onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, stock: e.target.value } }))}
                    type="number" 
                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Category</label>
                <select 
                  name="category" 
                  required 
                  value={modal.data?.category} 
                  onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                  className="w-full candy-select p-3"
                >
                  <option value="">Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea 
                  name="description" 
                  required 
                  value={modal.data?.description || ''} 
                  onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold h-24 no-scrollbar" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Image</label>
                <input name="image" type="file" accept="image/*" className="w-full text-xs font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg">
              {modal.data ? 'Update Sweet' : 'Add Sweet'}
            </button>
          </form>
        )}

        {modal.type === 'gallery' && (
          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            const item = modal.data;
            const title = item?.title || '';

            if (selectedFile && selectedFile.size > 100 * 1024 * 1024) return toast.error('Media too heavy! (Max 100MB)');
            if (!title) return toast.error('Please enter a display title');

            setIsGalleryLoading(true);
            try {
              let imageUrl = item?.image || '';
              let videoUrl = item?.video || '';

              if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                const { data: uploadRes } = await axios.post('/api/upload', uploadFormData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (galleryType === 'image') imageUrl = uploadRes.url;
                else videoUrl = uploadRes.url;
              }

              const finalData = {
                type: galleryType,
                title: title,
                image: galleryType === 'image' ? (imageUrl || '') : '',
                video: galleryType === 'video' ? (videoUrl || '') : ''
              };

              if (item?._id) {
                const { data } = await axios.put(`/api/gallery/${item._id}`, finalData);
                setGalleryItems(prev => prev.map(i => i._id === item._id ? data : i));
                toast.success('Gallery updated!', { id: 'modal-up' });
              } else {
                const { data } = await axios.post('/api/gallery', finalData);
                setGalleryItems(prev => [...prev, data]);
                toast.success('New slide added!', { id: 'modal-up' });
              }
              setModal(prev => ({ ...prev, isOpen: false }));
            } catch (err) {
              console.error('Gallery Upload Error:', err);
              const errorMsg = err.response?.data?.error?.message || err.message || 'Upload failed';
              toast.error(`Upload error: ${errorMsg}`, { id: 'modal-up' });
            } finally {
              setIsGalleryLoading(false);
            }
          }}>
            {modal.data?.image && (
              <div className="flex justify-center mb-6">
                <div className="relative group w-full h-40">
                  <img src={modal.data.image} alt="" className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-fuchsia-100" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                    <span className="text-white font-black italic uppercase text-xs">Current Preview</span>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Media Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setGalleryType('image'); setPreview(null); setFileName(''); }}
                    className={`py-3 rounded-xl font-black italic border-2 transition-all ${galleryType === 'image' ? 'candy-gradient text-white border-transparent shadow-lg scale-105' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  >
                    Image Snapshot
                  </button>
                  <button
                    type="button"
                    onClick={() => { setGalleryType('video'); setPreview(null); setFileName(''); }}
                    className={`py-3 rounded-xl font-black italic border-2 transition-all ${galleryType === 'video' ? 'candy-gradient text-white border-transparent shadow-lg scale-105' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  >
                    Video Showcase
                  </button>
                </div>
                <input type="hidden" name="type" value={galleryType} />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Title</label>
                <input 
                  name="title" 
                  required 
                  value={modal.data?.title || ''} 
                  onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-300 font-bold" 
                />
              </div>

              <div className="bg-fuchsia-50/50 p-6 rounded-[2rem] border-2 border-dashed border-fuchsia-200 min-h-[160px] flex items-center justify-center relative overflow-hidden">
                {galleryType === 'image' ? (
                  <div className="text-center w-full">
                    {preview ? (
                      <div className="relative group mx-auto w-full h-32">
                        {preview && <img src={preview} className="w-full h-full object-cover rounded-xl shadow-md" alt="Preview" />}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <span className="text-white text-[10px] font-black italic">{fileName}</span>
                        </div>
                        <input name="image" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setFileName(file.name); setSelectedFile(file); setPreview(URL.createObjectURL(file)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Plus size={48} className="mx-auto text-fuchsia-300 mb-2" />
                        <span className="block text-sm font-black italic text-fuchsia-900">Upload Sweet Snapshot</span>
                        <span className="block text-[10px] text-fuchsia-400 font-medium uppercase tracking-widest">Max 10MB • JPG, PNG or WEBP</span>
                        <input name="image" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setFileName(file.name); setSelectedFile(file); setPreview(URL.createObjectURL(file)); } }} className="hidden" />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="text-center w-full">
                    {preview ? (
                      <div className="relative group mx-auto w-full h-32 bg-black rounded-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle className="text-cyan-400" size={32} />
                        </div>
                        <div className="absolute inset-x-0 bottom-2 text-center">
                          <span className="text-cyan-400 text-[10px] font-black italic">{fileName}</span>
                        </div>
                        <input name="video" type="file" accept="video/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setFileName(file.name); setSelectedFile(file); setPreview('video-selected'); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Plus size={48} className="mx-auto text-cyan-300 mb-2" />
                        <span className="block text-sm font-black italic text-cyan-900">Upload Video Showcase</span>
                        <span className="block text-[10px] text-cyan-400 font-medium uppercase tracking-widest">Max 100MB • MP4 or HIGH-QUALITY</span>
                        <input name="video" type="file" accept="video/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setFileName(file.name); setSelectedFile(file); setPreview('video-selected'); } }} className="hidden" />
                      </label>
                    )}
                    {modal.data?.video && !preview && <p className="mt-2 text-[10px] text-cyan-500 font-bold truncate">Current: {modal.data.video.split('/').pop()}</p>}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isGalleryLoading}
              className={`w-full py-4 candy-gradient text-white rounded-2xl font-black italic shadow-lg flex items-center justify-center gap-3 transition-all ${isGalleryLoading ? 'opacity-70 grayscale' : 'hover:scale-105'}`}
            >
              {isGalleryLoading ? (
                <>
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-pulse"></div>
                  SAVING...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        )}

        {modal.type === 'confirmDelete' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={40} />
            </div>
            <p className="text-gray-600 font-bold text-lg">{modal.data?.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black italic">Cancel</button>
              <button onClick={() => modal.data.onConfirm()} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black italic shadow-lg hover:bg-red-600 transition-all">Yes, Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
