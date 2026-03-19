import React from 'react';
import { motion } from 'framer-motion';

const LegalPage = ({ title }) => {
    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-playfair text-slate-900 uppercase tracking-widest">{title}</h1>
                    <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10 text-slate-600 leading-relaxed"
                >
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-500 italic mb-8 border-l-4 border-primary/30 pl-6">
                            Tasty Bites is committed to transparency and providing clear terms for our customers.
                            Please check our official documentation for full details regarding our {title.toLowerCase()}.
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-2xl font-playfair text-slate-900 mb-4">Section 1: Introduction</h3>
                                <p>Details regarding the {title} and how it applies to your use of our services. We strive to provide the best possible service while maintaining clear guidelines.</p>
                            </section>

                            <section>
                                <h3 className="text-2xl font-playfair text-slate-900 mb-4">Section 2: Our Commitment</h3>
                                <p>We take our responsibility towards our customers seriously, ensuring a high-quality experience and complete satisfaction with every interaction.</p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LegalPage;
