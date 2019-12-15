const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const courses = require('./routes/courses');
const registrations = require('./routes/registrations');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


mongoose.connect('mongodb://localhost/RegistrationsDB')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/courses', courses);
app.use('/api/registrations', registrations);
app.use('/api/auth', auth);

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/CourseRegistration')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/CourseRegistration/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));