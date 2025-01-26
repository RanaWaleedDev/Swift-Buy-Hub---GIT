// //contains all the logic/configuration needed to connect to database
// const mongoose=require('mongoose');

// mongoose.Promise=global.Promise; //promise to any async operations 

// mongoose.connect('mongodb://127.0.0.1:27017/gadgets_infinity',{useNewUrlParser:true})

//      .then( 
//           ()=>{ console.log('DB Connected Succesfully')
          
//         }
//           )
//      .catch(
//            (error)=>{ console.log('error in connection')}
//            );

//  module.exports=mongoose;
           


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Replace the connection string with your MongoDB Atlas connection string
const atlasConnectionUri = 'mongodb+srv://hussnainsarwar666:khan123456@cluster0.4cwk5ff.mongodb.net/SwiftBuyHub';

mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((error) => {
    console.error('Error in connection:', error);
  });

module.exports = mongoose;
