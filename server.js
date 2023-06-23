const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.js');
const productRoutes = require('./routes/product.js');
const cartRoutes = require('./routes/cart.js');
const contactRoutes = require('./routes/contact.js');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

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

app.use('/api/users', userRoutes.userRouter);
app.use('/api/products', productRoutes.productRouter);
app.use('/api/cart', cartRoutes.cartRouter);
app.use('/api/contact', contactRoutes.contactRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = app;
