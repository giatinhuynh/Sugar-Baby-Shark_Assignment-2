const mongoose = require('mongoose');

class Connection {
  constructor() {
    const username = "s3962053";
    const password = "webproga2";
    const cluster = "cluster0.qloy7im.mongodb.net";
    const database = "aikia_ecommerce"

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