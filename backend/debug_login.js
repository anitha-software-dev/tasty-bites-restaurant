import { User } from './models/index.js';
import sequelize from './config/database.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
    const email = 'tastybitesrestaurant7@gmail.com';
    const password = 'admin123';

    try {
        console.log(`🔍 Testing login for: ${email}`);
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            console.error('❌ User not found in database.');
            return;
        }

        console.log('✅ User found. Checking password...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`);

        if (isMatch) {
            console.log('📅 User createdAt:', user.createdAt);
            try {
               const memberSince = user.createdAt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
               console.log(`📅 User memberSince: ${memberSince}`);
            } catch (dateErr) {
               console.error('❌ Date formatting failed:', dateErr.message);
            }
        }
        
    } catch (err) {
        console.error('❌ CRITICAL ERROR during testLogin:');
        console.error(err);
        if (err.parent) {
            console.error('Sequelize Parent Error:', err.parent);
        }
    } finally {
        process.exit(0);
    }
}

testLogin();
