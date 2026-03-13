import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Utensils, 
    Calendar, 
    MessageSquare, 
    Settings, 
    LogOut,
    ChevronRight,
    Users,
    X,
    Store,
    Layers,
    ChefHat
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { logout } = useAdminAuth();
    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
        { path: '/admin/menu', icon: <Utensils size={18} />, label: 'Menu Items' },
        { path: '/admin/categories', icon: <Layers size={18} />, label: 'Categories' },
        { path: '/admin/bookings', icon: <Calendar size={18} />, label: 'Reservations' },
        { path: '/admin/testimonials', icon: <MessageSquare size={18} />, label: 'Testimonials' },
    ];

    return (
        <aside className={`
            fixed top-0 left-0 h-full w-72 bg-white border-r border-admin-border z-50 flex flex-col transition-transform duration-300
            ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-admin-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-admin-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-admin-primary/20">
                        <ChefHat size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Tasty Bites</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg md:hidden"
                >
                    <X size={18} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                            ${isActive 
                                ? 'bg-admin-primary/[0.08] text-admin-primary' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <span className={`transition-colors duration-200`}>
                                {item.icon}
                            </span>
                            <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                        </div>
                        {item.path === '/admin/orders' && (
                            <span className="px-2 py-0.5 bg-admin-primary text-white text-[9px] font-bold rounded-full relative z-10">3</span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
