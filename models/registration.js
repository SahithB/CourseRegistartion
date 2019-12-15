const Joi = require('joi');
const mongoose = require('mongoose');


const registrationSchema = new mongoose.Schema({

    student: {
        type: new mongoose.Schema({
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
        }),
        required: true
    },
    course: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 55
            },

            fees: {
                type: Number,
                min: 500,
                required: true
            },

            allowedInstallments: {
                type: Number,
                required:function(){ return this.isEMIAllowed;},
            },
        }),
        required: true
    },
    modeOfPayment: {
        type: String,
        enum: ["Full", "Installment"],
        required: true
    },
    installmentpaid: {
        type: Number,
        required: function(){if(this.modeOfPayment==="Installment"){return true}}
        
    },
    joiningDate: {
        type: Date,
        default: Date.now()
    }

});

const Registration = mongoose.model('Registration',registrationSchema);

function validateRegistration(register) {
    const schema ={
        courseId: Joi.objectId().required(),
        modeOfPayment: Joi.string().valid(['Full','Installments']).required(),
        installmentpaid: Joi.number().when('modeOfPayment', {is:'Installments',then:Joi.required(),otherwise: Joi.forbidden()})
    };
    return Joi.validate(register, schema,{stripUnknown:true});
}

exports.Registration = Registration;
exports.validate = validateRegistration;