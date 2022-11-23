const mongoose = require('mongoose')
let PostSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post_image: {
        type: String,
    },
    Caption: {
        type: String,
    },
    likes: {
        type: Array
    },

    comments: [{
        id: mongoose.Types.ObjectId,
        ref:'User',
        type: string,
    }]
})

module.exports = mongoose.model('Post', PostSchema)