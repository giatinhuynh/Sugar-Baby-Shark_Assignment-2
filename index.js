const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const Customer = require('./models/Customer.js');
const Vendor = require('./models/Vendor.js');
const Shipper = require('./models/Shipper.js');
const Product = require('./models/Product.js');
const DistributionHub = require('./models/DistributionHub.js');
const Order = require('./models/Order.js');

mongoose.connect('mongodb+srv://s3962053:webproga2@cluster0.qloy7im.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('Error: ', err.message));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.use(express.static('public'));

