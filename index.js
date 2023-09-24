const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser')
const multer = require('multer');

// set up environment variables
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = require("./config/server");
require("./config/database");
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
app.use(session({
  secret: 'your-secret-key', // Replace with your secret key
  resave: false,
  saveUninitialized: true,
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// multer






// Import routes
const customer = require("./src/routes/customerRoutes");
const vendor = require("./src/routes/vendorRoutes");
const shipper = require("./src/routes/shipperRoutes");
const product = require("./src/routes/productRoutes");
const distributionHub = require("./src/routes/distributionHubRoutes");
const order = require("./src/routes/orderRoutes");




app.use(express.static('public'));
app.use("/api/customers", customer);
app.use("/api/vendors", vendor);
app.use("/api/shippers", shipper);
app.use("/api/products", product);
app.use("/api/distributionHubs", distributionHub);
app.use("/api/orders", order);

app.get('/', (req, res) => {
  
  res.send('Test test test');
});



const path = require("path");
// Use the static files
app.use(express.static(path.join(__dirname,"public")));

// Set EJS as the template engine
const views = ["auth", "customer", "vendor", "shipper", "static", "partials"];
const viewDirectories = views.map(view => path.join(__dirname, "views", view));
app.set("views", viewDirectories);

app.set('view engine', 'ejs');




module.exports = app;