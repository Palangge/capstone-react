const express = require('express');
const bodyParser = require('body-parser');
const { getIndexPage } = require('./server/routes/routes.js');
const userRoutes = require('./server/routes/user.js');
const productRoutes = require('./server/routes/product.js');
const cartRoutes = require('./server/routes/cart.js');
const contactRoutes = require('./server/routes/contact.js');
const path = require('path');
const { connectToMongoDB } = require('./server/driver/mongodb.js');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
//connectToMongoDB();

const app = express();
const port = process.env.PORT || 3000; // Use the provided port or fallback to 3000

app.use(
  session({
    genid: () => uuidv4(),
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000 // 10 mins of inactivity.
    } 
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("public"));

app.use('/users', userRoutes.userRouter);
app.use('/api/products', productRoutes.productRouter);
app.use('/api/cart', cartRoutes.cartRouter);
app.use('/api/contact', contactRoutes.contactRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

module.exports = app; // Export the Express app object
