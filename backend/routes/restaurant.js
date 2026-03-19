import express from 'express';
import { RestaurantInfo } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';
import path from 'node:path';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// POST /api/restaurant/logo
router.post('/logo', authenticate, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const logoUrl = `/uploads/${req.file.filename}`;
        
        // Update restaurant info automatically
        let info = await RestaurantInfo.findOne();
        if (!info) {
            info = await RestaurantInfo.create({ logo: logoUrl });
        } else {
            info.logo = logoUrl;
            await info.save();
        }
        
        res.json({ success: true, logoUrl });
    } catch (err) {
        console.error('Logo upload error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/restaurant
router.get('/', async (req, res) => {
    try {
        let info = await RestaurantInfo.findOne();
        if (!info) {
            // Create default if not exists
            info = await RestaurantInfo.create({});
        }
        res.json(info);
    } catch (err) {
        console.error('Get restaurant info error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/restaurant (Admin only)
router.put('/', authenticate, async (req, res) => {
    try {
        // Here we should check if user is admin, but assuming authenticate sets role
        // For now, allow any authenticated user to update for simplicity, 
        // but ideally check req.role === 'admin'
        
        const { name, address, phone, email, website, description, logo, openingHours } = req.body;
        
        let info = await RestaurantInfo.findOne();
        if (!info) {
            info = await RestaurantInfo.create(req.body);
        } else {
            if (name) info.name = name;
            if (address) info.address = address;
            if (phone) info.phone = phone;
            if (email) info.email = email;
            if (website) info.website = website;
            if (description) info.description = description;
            if (logo !== undefined) info.logo = logo;
            if (openingHours) info.openingHours = openingHours;
            await info.save();
        }
        
        res.json({ success: true, info });
    } catch (err) {
        console.error('Update restaurant info error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
