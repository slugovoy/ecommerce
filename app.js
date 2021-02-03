const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
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

//  Routes middleware
app.use('/api', userRoutes)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

