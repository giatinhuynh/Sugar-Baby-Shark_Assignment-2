const mongoose = require('mongoose');

class Connection {
  constructor() {
    const username = process.env.MONGODB_USERNAME ;
    const password = process.env.MONGODB_PASSWORD;
    const cluster = process.env.MONGODB_CLUSTER;
    const database = process.env.MONGODB_DATABASE


    let uri =`mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
//mongodb+srv://s3962053:webproga2@cluster0.qloy7im.mongodb.net/aikia_ecommerce?retryWrites=true&w=majority
    
      
      mongoose.connect(uri)
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error')
      })
}
}

module.exports = new Connection();