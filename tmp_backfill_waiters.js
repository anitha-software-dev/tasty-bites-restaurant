import { Order, Table, User } from './backend/models/index.js';
import sequelize from './backend/config/database.js';

async function backfillWaiters() {
    try {
        console.log('Starting waiter backfill for Dine-In orders...');
        
        // 1. Get all tables with assigned waiters
        const tables = await Table.findAll({
            include: [{
                model: User,
                as: 'waiter',
                attributes: ['name']
            }]
        });

        const tableMap = {};
        tables.forEach(t => {
            if (t.waiter) {
                tableMap[t.number] = t.waiter.name;
            }
        });

        console.log('Table Map:', tableMap);

        // 2. Get all Dine-In orders that are NOT Completed or Cancelled
        // Or all Dine-In orders as requested
        const orders = await Order.findAll({
            where: {
                orderType: 'Dine-In',
                status: ['Order Received', 'In Progress', 'Ready']
            }
        });

        console.log(`Found ${orders.length} active Dine-In orders to process.`);

        let updatedCount = 0;
        for (const order of orders) {
            if (order.tableNumber && tableMap[order.tableNumber]) {
                const newWaiter = tableMap[order.tableNumber];
                if (order.waiterName !== newWaiter) {
                    await order.update({ waiterName: newWaiter });
                    console.log(`Updated Order #${order.orderId} (Table ${order.tableNumber}) -> Waiter: ${newWaiter}`);
                    updatedCount++;
                }
            }
        }

        console.log(`Backfill complete. Updated ${updatedCount} orders.`);
        process.exit(0);
    } catch (error) {
        console.error('Backfill failed:', error);
        process.exit(1);
    }
}

backfillWaiters();
