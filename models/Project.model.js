const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({

    name: {
        type: String, required: true, trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    register: {
        type: Date,
        default: Date.now()
    },

},{
    timestamps: true
})

module.exports = mongoose.model('Project', ProjectSchema)