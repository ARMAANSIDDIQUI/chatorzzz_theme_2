import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingCart, Package, Download, TrendingUp, 
  BarChart3, PieChart as PieChartIcon, ArrowUpRight, 
  Settings, LogOut, Search, Plus, Edit, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Cell, Pie
} from 'recharts';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { Image } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes, reviewsRes, galleryRes, inquiriesRes, ticketsRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/products'),
          axios.get('/api/auth/users'),
          axios.get('/api/reviews/pending'),
          axios.get('/api/gallery'),
          axios.get('/api/contact'),
          axios.get('/api/support/all')
        ]);
        
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data || []);
        setPendingReviews(reviewsRes.data || []);
        setGalleryItems(galleryRes.data || []);
        setInquiries(inquiriesRes.data || []);
        setSupportTickets(ticketsRes.data || []);
        
        const revenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
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

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-fuchsia-500 text-3xl italic">Accessing Master Panel...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50 pt-24">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 glass-panel m-4 rounded-[2.5rem] p-8 flex flex-col items-center">
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
            { id: 'inquiries', icon: FiMessageSquare, label: 'Inquiries' },
            { id: 'support', icon: FiMessageSquare, label: 'Support' },
            { id: 'users', icon: Users, label: 'Customers' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
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
                { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
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
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600}} />
                      <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
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
                <div className="h-[300px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
                          { name: 'Out for dev', value: orders.filter(o => o.status === 'Out for delivery').length },
                          { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#f0abfc" />
                        <Cell fill="#67e8f9" />
                        <Cell fill="#34d399" />
                      </Pie>
                      <Tooltip />
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
                      <td className="px-8 py-6 font-black text-gray-800">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black italic uppercase ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
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
                              } catch(e) { toast.error('Approval failed'); }
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
                              } catch(e) { toast.error('Rejection failed'); }
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
                } catch(e) { toast.error('Creation failed'); }
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
               <h3 className="text-2xl font-black italic text-gray-800 mb-2">Home Gallery Manager</h3>
               <p className="text-gray-500 mb-8 font-medium">Click on any card to update its image or title. Changes are instant!</p>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[150px]">
                  {galleryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`relative rounded-3xl overflow-hidden border-4 border-white shadow-xl cursor-pointer group ${item.span}`}
                      onClick={() => {
                        const newTitle = prompt('Enter new title for this card:', item.title);
                        if (!newTitle) return;
                        
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', 'chatorzzz_gallery'); // Need to ensure this exists or use standard upload
                          
                          toast.loading('Uploading magic...', { id: 'gallery-up' });
                          try {
                            // Upload to cloudinary first
                            const upRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
                            const imageUrl = upRes.data.secure_url;
                            
                            // Update backend
                            const { data } = await axios.put('/api/gallery', { 
                              id: item.id, 
                              image: imageUrl, 
                              title: newTitle 
                            });
                            
                            setGalleryItems(prev => prev.map(i => i.id === item.id ? data : i));
                            toast.success('Gallery card updated!', { id: 'gallery-up' });
                          } catch (err) {
                            toast.error('Magic upload failed', { id: 'gallery-up' });
                          }
                        };
                        input.click();
                      }}
                    >
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Edit className="text-white" size={32} />
                       </div>
                       <div className="absolute bottom-3 left-4">
                          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase italic text-fuchsia-500">
                             {item.title}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 items-start">
               <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Package size={24} />
               </div>
               <div>
                  <h4 className="font-black italic text-amber-900 mb-1">Grid Layout Note</h4>
                  <p className="text-amber-800/70 text-sm font-medium leading-relaxed">
                     The layout is fixed to ensure a professional look on the home page. You can only change the "Sweets" inside each frame, not the frames themselves.
                  </p>
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
                <div className="glass-panel p-20 text-center text-gray-300 font-black italic">No messages from the wild...</div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq._id} className="glass-panel p-8 rounded-[2.5rem] relative group border-white/60">
                    <button 
                      onClick={async () => {
                        if (window.confirm('Vanish this inquiry?')) {
                          await axios.delete(`/api/contact/${inq._id}`);
                          setInquiries(inquiries.filter(i => i._id !== inq._id));
                          toast.success('Inquiry vanished!');
                        }
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

        {/* Support Tab */}
        {activeTab === 'support' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
            <div className="lg:col-span-4 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col border-white/60">
               <div className="p-6 border-b border-fuchsia-50 bg-fuchsia-50/30">
                  <h4 className="font-black italic text-gray-800 uppercase tracking-widest text-xs">Active Sessions</h4>
               </div>
               <div className="flex-grow overflow-y-auto no-scrollbar">
                  {supportTickets.map(ticket => (
                    <button 
                      key={ticket._id}
                      onClick={async () => {
                        setActiveTicket(ticket);
                        await axios.put(`/api/support/read/${ticket._id}`);
                        setSupportTickets(supportTickets.map(t => t._id === ticket._id ? {...t, messages: t.messages.map(m => m.sender === 'user' ? {...m, status: 'read'} : m)} : t));
                      }}
                      className={`w-full p-6 text-left border-b border-gray-50 transition-all flex items-center gap-4 ${activeTicket?._id === ticket._id ? 'bg-fuchsia-50 border-l-4 border-l-fuchsia-500' : 'hover:bg-gray-50'}`}
                    >
                       <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-black italic">
                          {ticket.user.name[0]}
                       </div>
                       <div className="flex-grow overflow-hidden">
                          <h5 className="font-black italic text-gray-800 truncate">{ticket.user.name}</h5>
                          <p className="text-[10px] text-gray-400 font-medium truncate italic">
                             {ticket.messages[ticket.messages.length-1]?.content}
                          </p>
                       </div>
                       {ticket.messages.some(m => m.sender === 'user' && m.status === 'sent') && (
                         <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></div>
                       )}
                    </button>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-8 glass-panel rounded-[2.5rem] flex flex-col overflow-hidden relative border-white/60">
               {activeTicket ? (
                 <>
                   <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
                      <div>
                         <h4 className="font-black italic uppercase tracking-tighter text-xl">{activeTicket.user.name}</h4>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{activeTicket.user.email}</p>
                      </div>
                   </div>
                   <div className="flex-grow p-8 space-y-4 overflow-y-auto no-scrollbar bg-white/30 italic font-medium">
                      {activeTicket.messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] p-5 rounded-[2rem] ${
                             msg.sender === 'admin' 
                             ? 'bg-fuchsia-500 text-white rounded-tr-none shadow-xl' 
                             : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                           }`}>
                              <p>{msg.content}</p>
                              <p className={`text-[8px] mt-2 font-black uppercase tracking-widest ${msg.sender === 'admin' ? 'text-white/50' : 'text-gray-300'}`}>
                                 {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <form 
                     onSubmit={async (e) => {
                       e.preventDefault();
                       if (!adminReply.trim()) return;
                       const { data } = await axios.post('/api/support/message', { content: adminReply, userId: activeTicket.user._id });
                       setActiveTicket(data);
                       setSupportTickets(supportTickets.map(t => t._id === data._id ? data : t));
                       setAdminReply('');
                     }} 
                     className="p-6 bg-white border-t border-gray-100 flex gap-4"
                   >
                      <input 
                        className="flex-grow px-8 py-4 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-fuchsia-200 font-bold italic"
                        placeholder="Reply to customer..."
                        value={adminReply} onChange={(e) => setAdminReply(e.target.value)}
                      />
                      <button className="px-10 py-4 bg-gray-900 text-white rounded-full font-black italic shadow-lg active:scale-95 transition-all">
                        Reply
                      </button>
                   </form>
                 </>
               ) : (
                 <div className="flex-grow flex flex-col items-center justify-center p-20 text-center opacity-30">
                    <FiMessageSquare size={80} className="mb-6" />
                    <h3 className="text-3xl font-black italic">Select a session</h3>
                 </div>
               )}
            </div>
          </motion.div>
        )}
        {(activeTab === 'products' || activeTab === 'users') && (
           <div className="glass-panel p-20 rounded-[3rem] text-center border-white/40">
             <div className="text-6xl mb-6 text-fuchsia-300 opacity-50 flex justify-center">
               <FiSettings size={80} className="animate-spin-slow" />
             </div>
             <h2 className="text-3xl font-black italic text-gray-400">Section Under Construction</h2>
             <p className="text-gray-400 font-medium">We're wrapping this section in sweet sugar. Check back soon!</p>
             <button 
              onClick={() => downloadCSV(activeTab)}
              className="mt-8 px-8 py-4 candy-gradient text-white rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto"
            >
              <Download size={20} />
              Backup {activeTab === 'users' ? 'User' : 'Product'} Data Anyway
            </button>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
