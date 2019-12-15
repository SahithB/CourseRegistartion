const mongoose = require('mongoose');
const Joi = require('joi');



const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55
    },
    address: {
        type: String,
        minlength:5,
        maxlength:55
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number
    }

});

const Student = mongoose.model('Student',studentSchema);

function validateStudent(student){
    const schema = {
        name: Joi.string().min(3).max(55).required(),
        address: Joi.string().min(3).max(55),
        email: Joi.string().email(),
        phone: Joi.number()
    }
    return Joi.validate(student,schema);
};


exports.Student = Student;
exports.validateStudent = validateStudent;