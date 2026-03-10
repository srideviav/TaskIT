const mongoose = require('mongoose');
const commentSchema = require("./comment.model");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        index: true,
        default: 'To Do'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
},
    { timestamps: true }
)

 module.exports =  mongoose.model('Task', taskSchema);
