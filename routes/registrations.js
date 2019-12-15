const {Registration, validate} = require('../models/registration'); 
const {Student,validateStudent} = require('../models/student'); 
const {Course} = require('../models/course'); 
const auth = require('../middleware/auth')
const mongoose = require('mongoose');
const Fawn = require('fawn');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/',auth, async (req, res) => {
  const rentals = await Registration.find();
  res.send(rentals);
});

router.post('/',auth, async (req, res) => {

  const studentVal = validateStudent(_.pick(req.body, ['name','address','email','phone'])); 
  if (studentVal.error) return res.status(400).send(studentVal.error.details[0].message);

  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send('Invalid course.');

  if (course.batchSizeAvl === 0) return res.status(400).send('Batch is full...');
  
  let student = new Student( _.pick(req.body, ['name','address','email','phone']));

  student = await student.save();

  let registration = new Registration({ 
    course: {
      _id: course._id,
      name: course.name, 
      fees: course.fees,
      allowedInstallments: course.allowedInstallments
    },
    student: {
      _id: student._id,
      name: student.name,
      email: student.email,
      address: student.address,
      phone: student.phone
    },
    modeOfPayment: req.body.modeOfPayment,
    installmentpaid: req.body.installmentpaid
  });
      try {
          new Fawn.Task()
            .save('registrations', registration)
            .update('courses', { _id: course._id }, { 
              $inc: { batchSizeAvl: -1 }
            })
            .run();
        
          res.send(registration);
        }
        catch(ex) {
          Student.findByIdAndRemove(student._id);
          res.status(500).send('Something failed.');
        }
      
});

router.put('/:id',auth, async (req, res) => {

  const studentVal = validateStudent(_.pick(req.body, ['name','address','email','phone'])); 
  if (studentVal.error) return res.status(400).send(studentVal.error.details[0].message);

  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send('Invalid course.');

  let registration = await Registration.findById(req.params.id);
  if (!registration) return res.status(400).send('Invalid registration.');

  const updatedStudent = _.pick(req.body, ['name','address','email','phone']);
  const updatedRegistration = {course: registration.course,
    student:{_id:registration.student._id, name: req.body.name , address:req.body.address, email:req.body.email, phone:req.body.phone},
    modeOfPayment:req.body.modeOfPayment,installmentpaid:req.body.installmentpaid};


  try {
    new Fawn.Task()
      .update('students',{_id: registration.student._id},updatedStudent) 
      .update('registrations',{_id: registration._id},updatedRegistration)
      .run()

      res.send(updatedRegistration);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }
});


router.get('/:id',auth, async (req, res) => {
  
  const registration = await Registration.findOne({_id:req.params.id});

    if (!registration) return res.status(404).send("The Registration with the given ID is not found");

    res.send(registration);
});

router.delete('/:id',auth, async (req,res)=>{

  const registration = await Registration.findById(req.params.id);
  try {
    new Fawn.Task()
      .remove('registrations', {_id: registration._id})
      .remove('students',{_id: registration.student._id})
      .update('courses', { _id: registration.course._id }, { 
        $inc: { batchSizeAvl: 1 }
      })
      .run();
  
    res.send(registration);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }
});


module.exports = router; 