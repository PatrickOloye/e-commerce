const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ProductRoute = require('./routes/product');
const CategoryRoute = require('./routes/category');
const UserRoute = require('./routes/user');
const cors = require('cors');
const authJwt = require('./authMiddle/jwt');
const { errorHandler } = require('./authMiddle/errorHandler');

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt);
app.use(errorHandler);

//routes
app.use(`/api/v0/category`, CategoryRoute);
app.use(`/api/v0/product`, ProductRoute);
app.use(`/api/v0/users`, UserRoute);
app.use(`/api/v0/orders`, UserRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3030, () => {
      console.log('database connected');
      console.log('server is running on port 3030');
    });
  })
  .catch((err) => {
    console.log(err);
  });
