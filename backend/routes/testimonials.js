import express from 'express';
import { Testimonial } from '../models/index.js';

const router = express.Router();

// GET all testimonials (Admin)
router.get('/admin/all', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// GET approved testimonials (Public)
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            where: { approved: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(testimonials);
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// POST a new testimonial
router.post('/', async (req, res) => {
    try {
        const { name, text, rating, type } = req.body;
        const dateObj = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

        const newTestimonial = await Testimonial.create({
            name,
            text,
            rating,
            type: type || 'General',
            date: formattedDate,
            approved: true
        });

        res.status(201).json({ success: true, testimonial: newTestimonial });
    } catch (err) {
        console.error('Error creating testimonial:', err);
        res.status(500).json({ error: 'Failed to submit testimonial' });
    }
});

// PUT update testimonial (Admin)
router.put('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);
        if (!testimonial) return res.status(404).json({ error: 'Not found' });
        
        await testimonial.update(req.body);
        res.json(testimonial);
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// DELETE testimonial (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);
        if (!testimonial) return res.status(404).json({ error: 'Not found' });
        
        await testimonial.destroy();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

export default router;
