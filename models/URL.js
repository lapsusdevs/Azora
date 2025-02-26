const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const URL = sequelize.define("URL", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    originalURL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = URL;
