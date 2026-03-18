import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const reviewTypes = ['General', 'Order Review', 'Dine-in Experience', 'Catering Feedback'];

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({ name: '', type: 'General', rating: 0, text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await api.getTestimonials();
            if (Array.isArray(data)) {
                setTestimonials(data);
            } else {
                setTestimonials([]);
            }
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            toast.warning('Please select a star rating.');
            return;
        }
        if (!formData.name.trim()) {
            toast.warning('Please enter your name.');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.submitTestimonial(formData);
            toast.success('Thank you! Your review has been submitted.');
            setFormData({ name: '', type: 'General', rating: 0, text: '' });
            fetchTestimonials(); // Refresh list to show new review
        } catch (error) {
            console.error('Failed to submit testimonial:', error);
            toast.error('Failed to submit your review. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-14 min-h-screen bg-slate-950">
            {/* Hero Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-slate-950 to-slate-950" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-accent mx-auto mb-10 shadow-2xl"
                    >
                        <MessageCircle size={40} className="animate-pulse" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-playfair text-6xl md:text-8xl mb-8 leading-tight"
                    >
                        Guest <span className="text-primary italic">Experiences</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/60 text-sm md:text-base max-w-2xl mx-auto font-black uppercase tracking-[0.5em] leading-relaxed"
                    >
                        Real stories from our beloved community & global food enthusiasts
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left shadow-2xl">
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="text-6xl font-black text-white tracking-tighter tabular-nums">4.9</span>
                                <div className="text-left">
                                    <div className="flex text-primary mb-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Global Satisfaction Index</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-px w-24 bg-white/10 hidden md:block" />
                        <div className="grid grid-cols-2 gap-12 text-white">
                            <div>
                                <div className="text-3xl font-black tracking-tight">500+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Reviews</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black tracking-tight">98%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Loyalty Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="section-padding">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-primary" size={48} />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((review, idx) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx % 3) * 0.1 }}
                                    className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-primary/30 transition-all duration-700 group flex flex-col h-full relative"
                                >
                                    <Quote className="text-primary/10 w-16 h-16 absolute top-8 right-8 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                    <div className="flex items-center space-x-1 text-primary mb-8">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-white/80 text-xl font-medium leading-relaxed italic mb-10 flex-grow relative z-10">
                                        "{review.text}"
                                    </p>
                                    <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black uppercase italic tracking-widest text-xs">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-playfair text-xl text-white tracking-wide">{review.name}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{review.date}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Review Form */}
            <section id="review-form" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Voices of Heritage</span>
                        <h2 className="text-4xl md:text-6xl font-playfair text-white">Project Your <span className="text-primary italic">Narrative</span></h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-3xl p-10 md:p-16 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                             {/* Grid Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-4 mb-3 block">Full Identity *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-primary focus:bg-white/10 transition-all font-bold text-white placeholder:text-white/20 outline-none"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-4 mb-3 block">Review Category</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-8 py-5 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-primary focus:bg-white/10 transition-all font-bold text-white appearance-none cursor-pointer outline-none"
                                    >
                                        {reviewTypes.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Premium Star Selector */}
                            <div className="py-6 border-y border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 block">Heritage Rating *</label>
                                    <p className="text-xs text-white/30">Select the intensity of your journey</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none group/star"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-all duration-300 transform group-hover/star:scale-125 ${(hoverRating || formData.rating) >= star ? 'text-primary fill-primary shadow-[0_0_20px_rgba(192,75,42,0.5)]' : 'text-white/10'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-4 mb-3 block">Your Perspective *</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full px-8 py-5 rounded-3xl bg-white/5 border-2 border-white/10 focus:border-primary focus:bg-white/10 transition-all font-bold text-white placeholder:text-white/20 resize-none outline-none"
                                    placeholder="Detail your dream culinary landscape..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-6 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.5em] text-xs shadow-2xl hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-6 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0 mr-3" />
                                        <span>Submitting...</span>
                                    </>
                                ) : 'Submit Review'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Ready to Try CTA Section */}
            <section className="py-24 relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-playfair text-white mb-8"
                    >
                        Ready to <span className="text-primary italic">Ascend?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-12 font-medium tracking-[0.2em] uppercase"
                    >
                        Join our elite community and experience the pinnacle of artisanal dining
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            to="/menu"
                            className="btn-primary !px-12 !py-6 shadow-[0_20px_50px_rgba(192,75,42,0.3)] !text-xs"
                        >
                            EXPLORE THE HERITAGE MENU
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TestimonialsPage;
