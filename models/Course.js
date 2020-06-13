const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add course title']
    },

    description: {
        type: String,
        trim: true,
        required: [true, 'Please add course description']
    },

    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },

    tuition: {
        type: Number,
        required: [true, 'Please add tuition amount']
    },

    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum skills'],
        enum: ['beginner', 'intermediate','advanced']
    },
    scholarshipAvalable:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

module.exports = mongoose.model('Course', CourseSchema)