const { Sequelize } = require("sequelize");
const path = require("path");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database.sqlite"), // Path to SQLite file
    logging: false, // Disable logging for cleaner output
});

module.exports = sequelize;
