import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

// Force PostgreSQL for all environments to prevent sqlite3 native binding crashes on Vercel
const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
    sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 5000 // 5 seconds to prevent Vercel 10s silent kill
        },
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'tasty_bites',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false,
            dialectOptions: process.env.NODE_ENV === 'production' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                connectTimeout: 5000 // 5 seconds to prevent Vercel 10s silent kill
            } : {},
            pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
        }
    );
}

export default sequelize;
