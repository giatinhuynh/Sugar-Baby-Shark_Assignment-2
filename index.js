const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://s3962053:webproga2@cluster0.qloy7im.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.log('Error: ', err.message));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.get('/', (req, res) => {
  res.send('Test test test');
});

app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');