const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;


// Import routes
const customer = require("./src/routes/customerRoutes");
const vendor = require("./src/routes/vendorRoutes");

const shipper = require("./src/routes/shipperRoutes");
const product = require("./src/routes/productRoutes");
const distributionHub = require("./src/routes/distributionHubRoutes");
const order = require("./src/routes/orderRoutes");

app.get('/', (req, res) => {
  
  res.send('Test test test');
});

app.use(express.static('public'));
app.use("/api/customers", customer);
app.use("/api/distributionHubs", distributionHub);
app.use("/api/orders", order);
app.use("/api/products", product);
app.use("/api/vendors", vendor);
app.use("/api/shippers", shipper);

// Set EJS as the template engine
app.set('view engine', 'ejs');


// set up port 
mongoose.connect('mongodb+srv://s3962053:webproga2@cluster0.qloy7im.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('Error: ', err.message));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const router = express.Router();

module.exports = router;