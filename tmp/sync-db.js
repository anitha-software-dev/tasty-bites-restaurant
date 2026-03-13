import sequelize from '../server/config/database.js';
import { Order, MenuItem, User, Reservation, Address, ContactMessage, CateringEnquiry, Testimonial, FAQ } from '../server/models/index.js';

async function syncDatabase() {
    try {
        console.log('🔄 Starting manual database synchronization...');
        
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        // Forcing sync with alter: true to update the schema to match the models
        await sequelize.sync({ alter: true });
        
        const dialect = sequelize.getDialect();
        console.log(`✨ Database synchronization complete (Dialect: ${dialect})`);
        
        // Specific verification for Order table columns
        const orderTableDesc = await sequelize.getQueryInterface().describeTable('Orders');
        const requiredColumns = ['orderType', 'tableNumber', 'collectionTime', 'instructions'];
        
        console.log('\n📊 Order Table Column Check:');
        requiredColumns.forEach(col => {
            if (orderTableDesc[col]) {
                console.log(`✅ Column "${col}" exists.`);
            } else {
                console.error(`❌ Column "${col}" is MISSING!`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to sync database:', error);
        process.exit(1);
    }
}

syncDatabase();
