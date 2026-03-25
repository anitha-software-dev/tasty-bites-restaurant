import express from 'express';
import { Table, User } from '../models/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.findAll({
            include: [
                {
                    model: User,
                    as: 'waiter',
                    attributes: ['id', 'name', 'role']
                }
            ],
            order: [['number', 'ASC']]
        });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create table
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const table = await Table.create(req.body);
        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update table
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { Table, User: UserModel, Order } = await import('../models/index.js');
        const table = await Table.findByPk(req.params.id);
        if (!table) return res.status(404).json({ error: 'Table not found' });
        
        await table.update(req.body);

        // SYNC LOGIC: If waiterId was updated, sync all active Dine-In orders for this table
        if (req.body.waiterId !== undefined) {
            const updatedTable = await Table.findByPk(table.id, {
                include: [{ model: UserModel, as: 'waiter', attributes: ['name'] }]
            });
            
            if (updatedTable.waiter) {
                await Order.update(
                    { waiterName: updatedTable.waiter.name },
                    { 
                        where: { 
                            tableNumber: updatedTable.number,
                            orderType: 'Dine-In',
                            status: ['Order Received', 'In Progress', 'Ready']
                        } 
                    }
                );
            } else if (req.body.waiterId === null) {
                // If waiter was unassigned, clear it from active orders too
                await Order.update(
                    { waiterName: '' },
                    { 
                        where: { 
                            tableNumber: updatedTable.number,
                            orderType: 'Dine-In',
                            status: ['Order Received', 'In Progress', 'Ready']
                        } 
                    }
                );
            }
        }
        res.json(table);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete table
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const table = await Table.findByPk(req.params.id);
        if (!table) return res.status(404).json({ error: 'Table not found' });
        
        await table.destroy();
        res.json({ message: 'Table deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
