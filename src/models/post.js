const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    post_id: {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

mongoose.pluralize(null)

const model = mongoose.model('Post', postSchema)

module.exports = model