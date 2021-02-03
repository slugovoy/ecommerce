const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


// import routes

const userRoutes = require('./routes/user')

// App
const app = express();

// DB
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    }
  )
  .then(() => console.log('DB Connected'))
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//  Routes middleware
app.use('/api', userRoutes)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

