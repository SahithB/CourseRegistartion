const Joi = require('joi');
const mongoose = require('mongoose');

const Registration = mongoose.model('Registration', new mongoose.Schema({
    student: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 55
            },
            email: {
                type: String,
                required: true
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

            faculty: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 55
            }
        }),
        required: true
    },
    modeOfPayment: {
        type: String,
        enum: ["Full", "Installment"],
        required: true
    },
    installmentpaid: {
        type: String,
        required: true
    },
    joiningDate: {
        type: Date,
        default: Date.now()
    }

}));

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;