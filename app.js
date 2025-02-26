require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./models/index");
const urlRoutes = require("./routes/urls");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/", urlRoutes);

// Sync the database and start the server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    console.log("Database synced!");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database sync error:", err);
});
