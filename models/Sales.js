const { Sequelize, DataTypes } = require('sequelize');

// Connect Sequelize to your database
const sequelize = new Sequelize('prinson_inventory_manager', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});

// Define the Sales model
const Sale = sequelize.define('Sale', {
    flavor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    sale_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    salesperson: {
        type: DataTypes.STRING,
        allowNull: true
    },
    market_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    market_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false // Disable auto timestamps (createdAt, updatedAt)
});

// Export the model
module.exports = { Sale, sequelize };
