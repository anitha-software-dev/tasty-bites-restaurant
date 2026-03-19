import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const StorySection = () => {
    return (
        <section className="section-padding bg-white relative overflow-hidden">
            {/* Decorative accent - Moved further right and tilted to avoid text overlap */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50/50 -skew-x-12 transform translate-x-1/3 hidden lg:block" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="lg:col-span-5 relative group"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-premium aspect-[4/5]">
                            <img
                                src="/images/authentic-spread.png"
                                alt="Traditional Dosa Preparation"
                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Design accents */}
                        <div className="absolute -top-8 -left-8 w-32 h-32 border-t-2 border-l-2 border-primary/30 rounded-tl-[40px] pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="max-w-xl">
                            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Since Generations</span>
                            <h2 className="text-slate-900 font-playfair text-3xl md:text-4xl lg:text-4xl leading-[1.1] mb-10">
                                A Legacy of <br />
                                <span className="text-primary italic font-serif">Authentic Flavours</span>
                            </h2>
                            <div className="space-y-8 text-slate-500 text-base md:text-lg leading-relaxed font-medium">
                                <p>
                                    Our story began not in a boardroom, but through countless food adventures shared by close friends from across India.
                                    Bound by love for food and a deep passion for the flavours we grew up with, we dreamt of bringing the magic of
                                    our hometown dishes to the hearts of the UK.
                                </p>
                                <p>
                                    Every dosa is made from batter fermented overnight. Every sambar carries the essence of hand-ground spices.
                                    What started as conversations over crispy dosas soon transformed into a true passion project.
                                </p>
                            </div>
                            <div className="mt-14">
                                <Link to="/about" className="inline-flex items-center group">
                                    <div className="relative overflow-hidden mr-4">
                                        <span className="inline-block text-slate-900 font-bold uppercase tracking-widest text-xs sm:text-sm py-2 transition-transform duration-500 group-hover:-translate-y-full whitespace-nowrap">Read Our Story</span>
                                        <span className="absolute top-full left-0 inline-block text-primary font-bold uppercase tracking-widest text-xs sm:text-sm py-2 transition-transform duration-500 group-hover:-translate-y-full whitespace-nowrap">Read Our Story</span>
                                    </div>
                                    <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110">
                                        <ArrowRight size={22} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
