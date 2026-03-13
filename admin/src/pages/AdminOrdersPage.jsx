import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    User, 
    Phone, 
    Mail, 
    ChevronDown, 
    Search, 
    Loader2,
    RefreshCw,
    MapPin,
    Clock,
    CreditCard,
    Printer,
    XCircle,
    Download,
    Eye,
    ChevronRight,
    Filter
} from 'lucide-react';
import { adminOrdersApi } from '../services/adminApi';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const StatusBadge = ({ status }) => {
    const variants = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
        'In Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Ready': 'bg-purple-50 text-purple-600 border-purple-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${variants[status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {status}
        </span>
    );
};

const OrderRow = ({ order, onUpdateStatus, onPrint }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);

    const statuses = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'];

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            await onUpdateStatus(order.id, newStatus);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={`bg-white border-b border-slate-100 transition-all duration-200 ${isExpanded ? 'bg-slate-50/30 ring-1 ring-inset ring-slate-100' : 'hover:bg-slate-50 shadow-sm hover:shadow-md'}`}>
            <div className="px-6 py-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-6 min-w-[200px]">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        #{order.orderId}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500 mt-1.5">{new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                </div>

                <div className="hidden lg:block flex-1 max-w-sm">
                    <p className="text-xs text-slate-600 font-medium truncate">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                </div>

                <div className="w-24 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</p>
                    <p className="text-[10px] text-admin-primary font-bold uppercase tracking-widest mt-1">{order.orderType}</p>
                </div>

                <div className="w-32 flex justify-center">
                    <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPrint(order); }}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                        title="Print Invoice"
                    >
                        <Printer size={18} />
                    </button>
                    <div className={`p-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-admin-primary' : 'text-slate-300'}`}>
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                    >
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Order Summary */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                    <ShoppingBag size={12} /> Items Summary
                                </h4>
                                <ul className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-slate-900 text-white text-[9px] flex items-center justify-center rounded-md font-bold">{item.quantity}</span>
                                                <span className="text-xs font-bold text-slate-800">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">£{Number((parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4 flex justify-between items-center border-t border-slate-200">
                                    <span className="text-xs font-bold text-slate-400">Grand Total</span>
                                    <span className="text-xl font-black text-slate-900">£{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                    <User size={12} /> Customer Information
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400"><User size={14} /></div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Name</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Phone</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{order.customerPhone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Service Type</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">{order.orderType} {order.tableNumber ? `• Table ${order.tableNumber}` : ''}</p>
                                        </div>
                                    </div>
                                </div>
                                {order.instructions && (
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mt-4">
                                        <p className="text-[9px] font-bold uppercase text-amber-600 tracking-wider flex items-center gap-2 mb-1.5"><AlertCircle size={10} /> Chef's Note</p>
                                        <p className="text-xs text-slate-700 italic font-medium leading-relaxed">"{order.instructions}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Update Status */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                    <Clock size={12} /> Order Management
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {statuses.map(s => (
                                        <button 
                                            key={s}
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(s); }}
                                            disabled={updating}
                                            className={`
                                                px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border
                                                ${order.status === s 
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                                                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-700'}
                                                flex items-center justify-center
                                            `}
                                        >
                                            {updating && order.status === s ? <Loader2 size={12} className="animate-spin" /> : s}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); confirmCancel(order); }}
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-white text-rose-500 border border-slate-100 hover:bg-rose-50 hover:border-rose-100 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    <XCircle size={14} />
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToCancel, setItemToCancel] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminOrdersApi.getAll();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await adminOrdersApi.updateStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleConfirmCancel = () => {
        if (!itemToCancel) return;
        updateStatus(itemToCancel.id, 'Cancelled');
    };

    const confirmCancel = (order) => {
        setItemToCancel(order);
        setIsDeleteModalOpen(true);
    };

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${order.orderId}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        .details { margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
                        .total { text-align: right; margin-top: 30px; font-size: 20px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>TASTY BITES</h1>
                        <p>Order Invoice</p>
                    </div>
                    <div class="details">
                        <p><strong>Order ID:</strong> #${order.orderId}</p>
                        <p><strong>Customer:</strong> ${order.customerName}</p>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                        <p><strong>Type:</strong> ${order.orderType}</p>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                        </thead>
                        <tbody>
                            ${order.items.map(i => `
                                <tr>
                                    <td>${i.name}</td>
                                    <td>${i.quantity}</td>
                                    <td>£{Number(String(i.price || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</td>
                                    <td>£{(i.quantity * (parseFloat(String(i.price || 0).replace(/[^0-9.]/g, '')) || 0)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">Total: £{Number(String(order.total || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderId.includes(searchQuery);
        const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
        const matchesType = filterType === 'All' || o.orderType === filterType;
        const matchesDate = !dateFilter || new Date(o.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Process and fulfill customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchOrders}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Enter Order ID or Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all shadow-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="h-10 w-px bg-slate-100 hidden xl:block mx-2" />
                        
                        <div className="flex flex-col gap-2 min-w-[180px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Status</label>
                            <div className="relative">
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[160px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                            <div className="relative">
                                <select 
                                    value={filterType} 
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-all"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Collection">Collection Only</option>
                                    <option value="Dine-In">Dine-In</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[180px]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Date</label>
                            <div className="relative group">
                                <Flatpickr
                                    value={dateFilter}
                                    onChange={([date]) => setDateFilter(date ? date.toISOString() : '')}
                                    options={{ dateFormat: 'Y-m-d', placeholder: 'Select Date' }}
                                    className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-slate-100 transition-all"
                                    placeholder="SELECT DATE"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {(filterStatus !== 'All' || filterType !== 'All' || dateFilter !== '') && (
                    <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-b border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{filteredOrders.length} Orders matching filters</span>
                        <div className="flex items-center gap-2 grayscale opacity-50">
                            <RefreshCw size={12} className="animate-spin text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Sync Active</span>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-300" size={48} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Loading active orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="flex flex-col">
                        {filteredOrders.map(order => (
                            <OrderRow key={order.id} order={order} onUpdateStatus={updateStatus} onPrint={handlePrintInvoice} />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Orders Found</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">There are no orders that match your current filters. Adjust your search or filters to see more.</p>
                    </div>
                )}
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToCancel(null); }}
                onConfirm={handleConfirmCancel}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This will halt the preparation process."
                itemName={itemToCancel ? `Order #${itemToCancel.orderId} - ${itemToCancel.customerName}` : ''}
            />
        </div>
    );
};

export default AdminOrdersPage;
