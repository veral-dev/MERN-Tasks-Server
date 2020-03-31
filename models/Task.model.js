const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({

    name: {
        type: String, required: true, trim: true
    },
    state: {
        type: Boolean, default: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Project'
    },
    register: {
        type: Date,
        default: Date.now()
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Task', TaskSchema)