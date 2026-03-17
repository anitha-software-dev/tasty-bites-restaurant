import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CateringEnquiry = sequelize.define('CateringEnquiry', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    eventType: { type: DataTypes.STRING, defaultValue: '' },
    eventDate: { type: DataTypes.STRING, defaultValue: '' },
    guests: { type: DataTypes.STRING, defaultValue: '' },
    budget: { type: DataTypes.STRING, defaultValue: '' },
    details: { type: DataTypes.TEXT, defaultValue: '' },
    status: { type: DataTypes.STRING, defaultValue: 'New' }
}, { 
    timestamps: true,
    freezeTableName: true,
    tableName: 'catering_enquiries'
});

export default CateringEnquiry;
