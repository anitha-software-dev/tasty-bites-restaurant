import express from 'express';
import { ContactMessage } from '../models/index.js';
import { sendContactNotification } from '../services/email.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Required fields: name, email, message' });
        }

        const msg = await ContactMessage.create({
            name, email, phone: phone || '', subject: subject || 'General Inquiry', message
        });

        // Send email notification to restaurant
        const emailSent = await sendContactNotification({ name, email, phone, subject, message });

        if (!emailSent) {
            console.error("WARNING: Contact message saved but email failed to send.");
        }

        res.status(201).json({ success: true, message: 'Message received successfully.' });
    } catch (err) {
        console.error('CRITICAL: Contact form error:', err);
        console.error('Request Body:', req.body);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

export default router;
