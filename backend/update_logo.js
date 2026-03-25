import { RestaurantInfo } from './models/index.js';
import { db } from './config/database.js';

async function updateLogo() {
    try {
        await db.authenticate();
        let info = await RestaurantInfo.findOne();
        if (!info) {
            info = await RestaurantInfo.create({
                name: 'Tasty Bites',
                logo: '/uploads/logo-default.png'
            });
            console.log('✅ Created new RestaurantInfo with logo');
        } else {
            info.logo = '/uploads/logo-default.png';
            await info.save();
            console.log('✅ Updated existing RestaurantInfo logo');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to update logo:', err);
        process.exit(1);
    }
}

updateLogo();
