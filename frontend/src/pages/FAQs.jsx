import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AccordionItem = ({ item, isOpen, onToggle }) => (
    <div className="border-b border-slate-100 last:border-b-0 overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-7 px-4 text-left group transition-all"
        >
            <span className={`text-sm sm:text-lg font-medium tracking-tight transition-all duration-300 ${isOpen ? 'text-primary translate-x-2' : 'text-slate-600 group-hover:text-slate-900'}`}>
                {item.q}
            </span>
            <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                <ChevronDown size={20} />
            </div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-6 pb-8 text-slate-500 text-[13px] sm:text-base leading-relaxed font-light italic">
                        {item.a}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQs = () => {
    const [faqCategories, setFaqCategories] = useState({});
    const [categoryKeys, setCategoryKeys] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [openIndex, setOpenIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const data = await api.getFaqs();
            if (data && !data.error) {
                setFaqCategories(data);
                const keys = Object.keys(data);
                setCategoryKeys(keys);
                if (keys.length > 0) {
                    setActiveCategory(keys[0]);
                }
            } else {
                setFaqCategories({});
                setCategoryKeys([]);
            }
        } catch (error) {
            console.error('Failed to load FAQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setOpenIndex(null);
    };

    return (
        <div className="pt-14 min-h-screen bg-slate-50 pb-24">
            {/* Hero Section */}
            <section className="py-32 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-white to-white" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-sm"
                    >
                        <HelpCircle size={40} className="animate-pulse" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-900 font-playfair text-3xl md:text-5xl mb-8 leading-tight"
                    >
                        Common <span className="text-primary italic">Questions</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-black uppercase tracking-[0.5em] leading-relaxed"
                    >
                        Find answers to your questions about our food and service.
                    </motion.p>
                </div>
            </section>

            {/* Category Tabs & Accordion */}
            <section className="container mx-auto px-6 mt-16">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : categoryKeys.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No FAQs found.</p>
                    </div>
                ) : (
                    <>
                        {/* Category Tabs */}
                        <div className="flex flex-wrap justify-center gap-4 mb-20 px-4">
                            {categoryKeys.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-4 sm:px-8 py-4 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all relative overflow-hidden group whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-[0_10px_30px_rgba(192,75,42,0.3)]'
                                        : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/50 hover:text-primary shadow-sm'
                                        }`}
                                >
                                    <span className="relative z-10">{cat}</span>
                                    {activeCategory === cat && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Accordion */}
                        <div className="max-w-4xl mx-auto px-4">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-8 md:p-14 border border-slate-100 shadow-sm relative"
                            >
                                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                                {faqCategories[activeCategory]?.map((item, idx) => (
                                    <AccordionItem
                                        key={idx}
                                        item={item}
                                        isOpen={openIndex === idx}
                                        onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </>
                )}
            </section>

            {/* Still Have Questions CTA */}
            <section className="mt-40 bg-slate-50 py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto bg-white rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden border border-slate-100 shadow-sm"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <h2 className="text-2xl md:text-4xl font-playfair text-slate-900 mb-8 relative z-10 leading-tight">
                            Still Have <br />
                            <span className="text-primary italic font-light">Questions?</span>
                        </h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-14 relative z-10">
                            Our team is here to help you.
                        </p>
                        <Link
                            to="/contact"
                            className="btn-primary !px-8 !py-4 sm:!py-7 !text-xs shadow-[0_20px_60px_rgba(192,75,42,0.4)] whitespace-nowrap"
                        >
                            CONTACT US
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default FAQs;
