const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const { Course, validate } = require('../models/course');
const router = express.Router();



router.get('/',auth,async (req, res) => {

    const courses = await Course.find();

    res.send(JSON.stringify(courses));
});

router.get('/:id',auth, async (req, res) => {

    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).send("The Course with the given ID is not found");

    res.send(course);
});

router.post('/',auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let course = new Course(
        _.pick(req.body, ['name', 'allowedInstallments', 'duration', 'fees', 'isEMIAllowed', 'batchSizeAvl', 'faculty']));

    course = await course.save();

    res.send(course);

});


router.put('/:id',auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let course;

    if (!req.body.isEMIAllowed) {
        
        await Course.update({ _id: req.params.id }, { $unset: { allowedInstallments: "" }});
        
        course = await Course.findByIdAndUpdate(req.params.id,
            _.pick(req.body, ['name', 'duration','isEMIAllowed', 'fees', 'batchSizeAvl', 'faculty' ]), {
                new: true
            });
    }
    else {
        course = await Course.findByIdAndUpdate(req.params.id,
            _.pick(req.body, ['name','allowedInstallments', 'duration', 'isEMIAllowed', 'fees', 'batchSizeAvl', 'faculty']), {
                new: true
            });
    }
    if (!course) return res.status(404).send("The Course with the given ID is not found");

    res.send(course);

});


router.delete('/:id',auth, async (req, res) => {
    const course = await Course.findByIdAndRemove(req.params.id);

    if (!course) return res.status(404).send('The course with the given ID was not found.');

    res.send(course);
})
module.exports = router;