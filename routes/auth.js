const Joi = require('joi');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
    
  const credentials = {
      name: 'Admin',
      email: 'admin@wipro.com',
      password:'wipro@123',
      isAdmin: true
  }

  if(req.body.email != credentials.email || req.body.password != credentials.password)
   return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ name: this.name, isAdmin: this.isAdmin },'JWTPrivateKey');

  res.send({token:token});
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 