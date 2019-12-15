const mongoose = require('mongoose');
const Joi = require('joi');



const courseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    isEMIAllowed:{
        type: Boolean,
        required: true
    },
    allowedInstallments: {
        type: Number,
        required:function(){ return this.isEMIAllowed;},
    },
    fees: {
        type: Number,
        min: 500,
        required: true
    },
    batchSizeAvl: {
        type: Number,
        required: true
    },
    faculty: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55
    }

});

const Course = mongoose.model('Course',courseSchema);

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).max(55).required(),
        duration: Joi.number().required(),
        fees: Joi.number().required().min(500),
        batchSizeAvl: Joi.number().required(),
        faculty: Joi.string().min(3).max(55).required(),
        isEMIAllowed: Joi.boolean().required(),
        allowedInstallments:Joi.number().min(1).when('isEMIAllowed', {is:true,then:Joi.required(),otherwise: Joi.forbidden()})
    }
    return Joi.validate(course,schema);
};


exports.Course = Course;
exports.validate = validateCourse;