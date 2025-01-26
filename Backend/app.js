const express= require('express');//look for express in node module and load it
const app=express();
app.use(express.json());
const cors = require('cors'); // Import CORS middleware
app.use(cors());

const nodemailer = require('nodemailer');

app.listen(3000, ()=>{
    console.log("server started at port 3000");
});

const mongoose=require('./database/mongoose.js');

const User=require('./database/models/user.js')
const Car=require('./database/models/Car.js')
const Laptop=require('./database/models/Laptop.js')
const ChatMessage = require('./database/models/ChatMessage');
const Subscription = require('./database/models/subscription'); // Assuming you have a Mongoose model for subscriptions
const Newsletter = require('./database/models/newsletter.js'); // Assuming you have a Mongoose model for subscriptions
const SmartInspection = require('./database/models/SmartInspection.js');

const jwt = require('jsonwebtoken');
const multer = require('multer');


// socket start
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle incoming messages
  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message');
});

});

server.listen(3001, () => {
  console.log('Socket started on port 3001');
});

// socket end

 
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); //frontend request allow any frontend

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// image upload
// Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Specify the destination folder for uploaded images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded image
//   }
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    cb(null, filename);
  }
});


const upload = multer({ storage: storage });



app.post('/register', async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ e_mail: req.body.email });

    if (existingUser) {
      // If the email already exists, return an error response
      return res.status(400).json({ error: 'Email already exists' });
    }

    // If the email doesn't exist, proceed to create a new user
    const newUser = new User({
      user_name: req.body.username,
      e_mail: req.body.email,
      password: req.body.password,
      contact: req.body.contact
    });

    await newUser.save();
    const transporter = await createTransporter();

    // Email options
    const mailOptions = {
      from: 'hussnainlocal@gmail.com',
      to: req.body.email,
      subject: 'Welcome',
      text: `Thank you for signing up to Swift Buy Hub Enjoy Your Experience `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { e_mail, password } = req.body;
    console.log(e_mail) 

    // Find the user by email
    const user = await User.findOne({ e_mail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored password
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // For simplicity, you might want to send back user details in response
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/cars', upload.array('images'), async (req, res) => {
  try {
    // Handle uploaded images
    const images = req.files.map(file => file.filename);
    const timestamp = new Date();

    // Extract other car data from request body
    const {selectedCategory, engineCapacity, modelYear, Mileage, Company, Vaarient, EngineType, Transmission, BodyType, accident, location, description,userId ,price} = req.body;
    // Create a new Car instance with the extracted data
    const car = new Car({
      selectedCategory,
      engineCapacity,
      modelYear,
      Mileage,
      Company,
      Vaarient,
      EngineType,
      Transmission,
      BodyType,
      accident,
      location,
      description,
      images, 
      userId,
      timestamp ,
      price
    });

    // Save the car data
    await car.save();

    res.status(201).json({ message: 'Car data saved successfully' });
  } catch (error) {
    console.error('Error saving car data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/laptops', upload.array('images'), async (req, res) => {
  try {
    const { selectedCategory,company, typeName, Ram, Weight, Touchscreen, Ips, ppi, Cpubrand, HDD, SSD, Gpubrand, os, location, description,Inches,pixels ,userId} = req.body;
    const images = req.files.map(file => file.filename); // Get filenames of uploaded images
    const timestamp = new Date();
    const laptop = new Laptop({
      selectedCategory,
      company,
      typeName,
      Ram,
      Weight,
      Touchscreen,
      Ips,
      ppi,
      Cpubrand,
      HDD,
      SSD,
      Gpubrand,
      os,
      location,
      description,
      images,
      Inches,
      pixels,
      userId,
      timestamp ,
      price
    });

    await laptop.save();
    res.status(201).json({ message: 'Laptop data saved successfully' });
  } catch (error) {
    console.error('Error saving laptop data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/cars/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cars = await Car.find({ userId });
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/laptops/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const laptops = await Laptop.find({ userId });
    res.status(200).json(laptops);
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})



app.get('/carsAll', async (req, res) => {
  try {
      const cars = await Car.find();
      console.log(cars,'cars')
      res.status(200).json(cars);
  } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint to fetch all laptops
app.get('/laptopsAll', async (req, res) => {
  try {
      const laptops = await Laptop.find();
      res.status(200).json(laptops);
  } catch (error) {
      console.error('Error fetching laptops:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// New endpoint to search for a document based on the selected category
app.get('/search/:selectedCategory/:id', async (req, res) => {
  try {
    const selectedCategory = req.params.selectedCategory;
    const id = req.params.id;

    // Determine the collection based on the selected category
    let Model;
    if (selectedCategory === 'cars') {
      Model = Car;
    } else if (selectedCategory === 'laptops') {
      Model = Laptop;
    } else {
      return res.status(400).json({ error: 'Invalid selected category' });
    }

    // Search for the document in the determined collection
    const document = await Model.findOne({ _id: id });

    if (document) {
      // Document found, send it in the response
      res.status(200).json(document);
    } else {
      // Document not found in the specified collection
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error('Error searching document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/chat', async (req, res) => {
  try {
    const { senderId, receiverId, message, adId } = req.body;

    // Create a new chat message
    const chatMessage = new ChatMessage({
      senderId,
      receiverId,
      message,
      adId // Include adId in the chat message
    });

    // Save the chat message to the database
    await chatMessage.save();

    res.status(201).json({ message: 'Chat message saved successfully' });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/messages/:senderId/:adId', async (req, res) => {
  try {
    const { senderId, adId } = req.params;

    // Query the database for messages where senderId, receiverId, and adId match
    const messages = await ChatMessage.find({ $or: [{ senderId, adId }, { receiverId: senderId, adId }] });

    // Return the messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/username/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by _id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user_name associated with the _id
    res.status(200).json({ user_name: user.user_name });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/messages/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database for messages where senderId or receiverId matches the userId
    const messages = await ChatMessage.find({ $or: [{ senderId: userId }, { receiverId: userId }] });

    // Return the messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/users', async (req, res) => {
  try {
    // Query the database to fetch all users
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  '657862359472-o5c1rgps10fkds77cgbio852tkk7tunc.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: '1//04WPGyLvNfV1CCgYIARAAGAQSNwF-L9IrTNUQ2fuTwV5T6nJ1VMy5LNitZKMs1NdKdycnrXLdAoZDM9AsN85t2o3EzafA9rX5q2k'
});
oauth2Client.setCredentials({
  access_token: 'ya29.a0Ad52N38BW67gG6XABVIym22PaMdLdM54pUcmsbQsohYAs_adqeGyUEPF5Fsg6iO5_fGiBLMBUPByVPoR8PyVRqL2vcIfJ3N0f9qn75Z-C1210sERzRoQpyY2Ctp76hHrQJMfJrr3UqQdyWZsVITXgzWwuZc67xyfraw2aCgYKAekSARASFQHGX2Miks9toFIi_FelhNAWIUcOYg0171'
});
// // Get an access token
const getAccessToken = async () => {
  const accessToken = await oauth2Client.getAccessToken();
  return accessToken;
};

// Create a Nodemailer transporter using OAuth2
const createTransporter = async () => {
  const accessToken = await getAccessToken();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'hussnainlocal@gmail.com', // Your email address
      clientId: '657862359472-o5c1rgps10fkds77cgbio852tkk7tunc.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04bykE_5hW8h_CgYIARAAGAQSNwF-L9IrOujZWXQ4F_H2NWbZTxzTp4-fUe1JbzvGkjYzN-miLUfmibieIx3jDSxPxY6uixjaNPI',
      accessToken: 'ya29.a0Ad52N38BW67gG6XABVIym22PaMdLdM54pUcmsbQsohYAs_adqeGyUEPF5Fsg6iO5_fGiBLMBUPByVPoR8PyVRqL2vcIfJ3N0f9qn75Z-C1210sERzRoQpyY2Ctp76hHrQJMfJrr3UqQdyWZsVITXgzWwuZc67xyfraw2aCgYKAekSARASFQHGX2Miks9toFIi_FelhNAWIUcOYg0171',
    }
  });
  return transporter;
};
// Route to send email
app.post('/sendEmail', async (req, res) => {
  try {
    const { subscriptionType, userEmail } = req.body;

    // Create transporter
    const transporter = await createTransporter();

    // Email options
    const mailOptions = {
      from: 'hussnainlocal@gmail.com',
      to: userEmail,
      subject: 'Subscription Confirmation',
      text: `Thank you for subscribing to ${subscriptionType}. Subscrption Our Team will Reach you out soon to keep you updated `
    };

    const subscription = new Subscription({
      email: userEmail,
      subscriptionType: subscriptionType
    });
    await subscription.save();

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Email sent successfully' }); // Return JSON response
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' }); // Return JSON response
  }
});
 


app.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/subscriptions/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the subscription by ID and update its status
    const subscription = await Subscription.findByIdAndUpdate(id, { status }, { new: true });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription status updated successfully', subscription });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/newsletter/subscribe', (req, res) => {
  const { email } = req.body;

  Newsletter.findOne({ email })
  .then(async existingEmail => {
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    const transporter = await createTransporter();
    const mailOptions = {
      from: 'hussnainlocal@gmail.com',
      to: email,
      subject: 'NewsLetter Subscription Sucess',
      text: `Thank you for subscribing to Our NewsLetter You will receive all updates `
    };
    // Send email
    await transporter.sendMail(mailOptions);
    // Create new subscription
    const newSubscription = new Newsletter({ email });
    return newSubscription.save();
  })
  .then(savedSubscription => {
    return res.status(201).json({ message: 'Successfully subscribed to newsletter', subscription: savedSubscription });
  })
  .catch(err => {
    return res.status(500).json({ error: 'Internal Server Error' });
  });


});






app.post('/change-password', async (req, res) => {
  try {
    const { e_mail, currentPassword, newPassword } = req.body;

    // console.log(e_mail,currentPassword,newPassword,'ccccccccccccccccccc')

    // Find the user by email
    const user = await User.findOne({ e_mail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided current password with the stored password
    if (currentPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Update the user's password
    await User.updateOne({ e_mail }, { password: newPassword });

    // Return success response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/users/:userId/username', async (req, res) => {
  try {
    const userId = req.params.userId;
    const newUsername = req.body.username;

    console.log(newUsername,'newUsername','userId',userId)

    // Update user's username in the database
    const updatedUser = await User.findByIdAndUpdate(userId, { user_name: newUsername });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return success response
    res.status(200).json({ message: 'Username updated successfully' });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the user with the specified userId
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const natural = require('natural');
const stopwords = require('stopwords').english;

// Additional words to remove
const additionalStopwords = ['car', 'cars', 'laptop', 'laptops'];

// Merge additional stopwords with the default stopwords
const allStopwords = [...stopwords, ...additionalStopwords];

// Initialize the tokenizer
const tokenizer = new natural.WordTokenizer();

app.get('/search123', async (req, res) => {
  try {
    const { q, category } = req.query; // Get query and category from request query parameters
    
    // Tokenize the query string
    const tokens = tokenizer.tokenize(q);

    // Remove stop words from the tokens
    const filteredTokens = tokens.filter(token => !allStopwords.includes(token.toLowerCase()));

    console.log("Extracted keywords:", filteredTokens);

    // Query the database based on the category
    let results = [];

    if (filteredTokens.length === 0 && (q.includes('car') || q.includes('cars') || q.includes('laptop') || q.includes('laptops'))) {
      const containsCar = q.includes('car') || q.includes('cars');
      const containsLaptop = q.includes('laptop') || q.includes('laptops');
  
      if (category === 'cars' && (containsCar || !containsLaptop) ) {
        results = await Car.find();
      } else if (category === 'laptops' && (containsLaptop || !containsCar) ) {
        results = await Laptop.find();
      } else if (category === 'both') {
          if (containsCar && containsLaptop) {
            // Search for both cars and laptops
            const carResults = await Car.find();
            const laptopResults = await Laptop.find();
            results = [...carResults, ...laptopResults];
          } else if (containsCar && !containsLaptop) {
            // Search for cars only
            results = await Car.find();
          } else if (containsLaptop && !containsCar) {
            // Search for laptops only
            results = await Laptop.find();
          }
      }
    }
  else{
    if (category === 'cars') {
      // Search for cars
      results = await Car.find({
        $and: filteredTokens.map(token => ({
          $or: [
            { engineCapacity: { $regex: token, $options: 'i' } },
            { modelYear: { $regex: token, $options: 'i' } },
            { Mileage: { $regex: token, $options: 'i' } },
            { Company: { $regex: token, $options: 'i' } },
            { Vaarient: { $regex: token, $options: 'i' } },
            { EngineType: { $regex: token, $options: 'i' } },
            { Transmission: { $regex: token, $options: 'i' } },
            { BodyType: { $regex: token, $options: 'i' } },
            { location: { $regex: token, $options: 'i' } },
            { description: { $regex: token, $options: 'i' } },
          ]
        }))
      });
    } else if (category === 'laptops') {
      // Search for laptops
      results = await Laptop.find({
        $and: filteredTokens.map(token => ({
          $or: [
            { company: { $regex: token, $options: 'i' } },
            { typeName: { $regex: token, $options: 'i' } },
            { Ram: { $regex: token, $options: 'i' } },
            { Weight: { $regex: token, $options: 'i' } },
            { Touchscreen: { $regex: token, $options: 'i' } },
            { Ips: { $regex: token, $options: 'i' } },
            { ppi: { $regex: token, $options: 'i' } },
            { Cpubrand: { $regex: token, $options: 'i' } },
            { HDD: { $regex: token, $options: 'i' } },
            { SSD: { $regex: token, $options: 'i' } },
            { Gpubrand: { $regex: token, $options: 'i' } },
            { os: { $regex: token, $options: 'i' } },
            { description: { $regex: token, $options: 'i' } },
            { location: { $regex: token, $options: 'i' } },
          ]
        }))
      });
    }
    else if (category === 'both') {
      // Search for both cars and laptops
      const carResults = await Car.find({
        $and: filteredTokens.map(token => ({
          $or: [
            { engineCapacity: { $regex: token, $options: 'i' } },
            { modelYear: { $regex: token, $options: 'i' } },
            { Mileage: { $regex: token, $options: 'i' } },
            { Company: { $regex: token, $options: 'i' } },
            { Vaarient: { $regex: token, $options: 'i' } },
            { EngineType: { $regex: token, $options: 'i' } },
            { Transmission: { $regex: token, $options: 'i' } },
            { BodyType: { $regex: token, $options: 'i' } },
            { location: { $regex: token, $options: 'i' } },
            { description: { $regex: token, $options: 'i' } },
          ]
        }))
      });

      const laptopResults = await Laptop.find({
        $and: filteredTokens.map(token => ({
          $or: [
            { company: { $regex: token, $options: 'i' } },
            { typeName: { $regex: token, $options: 'i' } },
            { Ram: { $regex: token, $options: 'i' } },
            { Weight: { $regex: token, $options: 'i' } },
            { Touchscreen: { $regex: token, $options: 'i' } },
            { Ips: { $regex: token, $options: 'i' } },
            { ppi: { $regex: token, $options: 'i' } },
            { Cpubrand: { $regex: token, $options: 'i' } },
            { HDD: { $regex: token, $options: 'i' } },
            { SSD: { $regex: token, $options: 'i' } },
            { Gpubrand: { $regex: token, $options: 'i' } },
            { os: { $regex: token, $options: 'i' } },
            { description: { $regex: token, $options: 'i' } },
            { location: { $regex: token, $options: 'i' } },
          ]
        }))
      });

      // Combine results from both categories
      results = [...carResults, ...laptopResults];
    }

  }

    // Send the search results
    res.status(200).json({ results });
    
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/physical-inspection', async (req, res) => {
  try {
    // Save data to database
    const smartInspection = new SmartInspection({
      categoryId: req.body.categoryId,
      currentUserId: req.body.currentUserId
    });
    await smartInspection.save();

    const transporter = await createTransporter();
    
    // Send email to currentUserId
    const mailOptions = {
      from: 'hussnainlocal@gmail.com', // Replace with your email address
      to: req.body.currentUserId,
      subject: 'Smart Inspection',
      text: 'Your inspection has been successfully scheduled. Our provider will reach you shortly.'
    };

    await transporter.sendMail(mailOptions);

    // Send response to client
    res.status(200).send('Data saved and email sent successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});



app.get('/getImagesById/:id', async (req, res) => {
  console.log( req.params.id,' req.params.id req.params.id')
  try {
    const id = req.params.id;
    let images = [];

    // Check if the ID corresponds to a Car or a Laptop
    const car = await Car.findById(id);
    if (car) {
      images = car.images[0];
    } else {
      const laptop = await Laptop.findById(id);
      if (laptop) {
        images = laptop.images[0];
      }
    }

    res.status(200).json({ images });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/getUserById/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get('/smart-inspections', async (req, res) => {
  try {
    const smartInspections = await SmartInspection.find();
    res.json(smartInspections);
  } catch (error) {
    console.error('Error fetching smart inspections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route handler for getting category view route
app.get('/getCategoryViewRoute/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Search in Car collection
    const car = await Car.findOne({ _id: categoryId }).exec();
    if (car) {
      // Return route for car category view
      return res.status(200).json({ route: `/category/view/cars/${categoryId}` });
    }

    // Search in Laptop collection
    const laptop = await Laptop.findOne({ _id: categoryId }).exec();
    if (laptop) {
      // Return route for laptop category view
      return res.status(200).json({ route: `/category/view/laptops/${categoryId}` });
    }

    // Handle if categoryId not found in Car or Laptop collections
    console.log('Category not found');
    return res.status(404).json({ error: 'Category not found' });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/api/smartinspections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSmartInspection = await SmartInspection.findByIdAndDelete(id);
    if (!deletedSmartInspection) {
      return res.status(404).json({ error: 'Smart inspection not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting smart inspection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/cars/:id', async (req, res) => {
  try {
    const carId = req.params.id;
    // Find the car by ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Delete the car from the database
    await Car.findByIdAndDelete(carId);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/laptop/:id', async (req, res) => {
  try {
    const carId = req.params.id;
    // Find the car by ID
    const car = await Laptop.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    // Delete the car from the database
    await Laptop.findByIdAndDelete(carId);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

