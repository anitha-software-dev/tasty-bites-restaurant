import { sequelize, MenuItem } from '../server/models/index.js';

async function checkMenu() {
    try {
        await sequelize.authenticate();
        const items = await MenuItem.findAll();
        console.log(JSON.stringify(items, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Database error:', error);
        process.exit(1);
    }
}

checkMenu();
