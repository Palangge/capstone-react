// server.js
const express = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
//const { getIndexPage, handleNotFound } = require('./server/routes/routes.js');
const userRoutes = require('./server/routes/user.js');
const productRoutes = require('./server/routes/product.js');
const cartRoutes = require('./server/routes/cart.js');
const contactRoutes = require('./server/routes/contact.js');
const path = require('path');
//const { connectToMongoDB } = require('./server/driver/mongodb.js');
//const session = require('express-session');
//all session variables are server side, no vulnerabilities there unless server is hacked
//request.session.var is saved on the server side
//client only have session_id
//even if that is spoofed, their credentials will be invalid, they won't be able to use the session variables until they clear their browser data
//const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 3000; // Replace with whatever port is free, or just keep this as is

/*
const or_port = 3000;
const allowedOrigins = 
['http://127.0.0.1:'+or_port,
 'http://localhost:'+or_port];// Modify as needed
// Enable CORS with credentials
app.use(cors({
  origin: allowedOrigins, 
  credentials: true // for cookies, yum
}));
*/
/*
app.use(
  session({
    genid: () => uuidv4(),//unique id for session_id
    secret: uuidv4(),//'IForgotMyCarKeyButTheActualQuestionIsWhereIsMyCar',//this is the signiture used for credential, if the credential is modified it is then invalid
    resave: false,//only the first save request is needed to identify the browser
    saveUninitialized: false,//complying with GDPR regulations
    // Additional configuration options, if ever
     cookie: {
      // Session expires after 60000 = 1 mins of inactivity.
      expires: 600000 // 10 mins of inactivity.
    } 
  })
);*/

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the React build files
//app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("public"));

// Route for index //not needed since react will handle all routes for browser user/client/customer/admin any frontend user
//app.get('/', getIndexPage);

//route priority is server first
//if requested route is not handled by server let react app handle that route

app.use('/users', userRoutes.userRouter);//no need to put api here we don't use 'users' as a header check routes/routess.js

app.use('/api/products', productRoutes.productRouter);//put api here to avoid collision

app.use('/api/cart', cartRoutes.cartRouter);//put api here to avoid collision

app.use('/api/contact', contactRoutes.contactRouter);//put api here to avoid collision


//Currently react app handles all routes that is not '/users' or '/api/products'
//Error 404 is also handled by react app
// Catch-all route to serve the React app
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Error 404 - Page not found | this will probably not be reached but leave it here anyway
//app.use(handleNotFound);

// Start the server
app.listen(port, () => {
  console.log('Server is running on port '+port);
});

// Connect to MongoDB
//connectToMongoDB();
module.exports = app;
