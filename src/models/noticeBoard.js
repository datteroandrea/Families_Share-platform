const mongoose = require('mongoose')

const noticeBoardSchema = new mongoose.Schema({
    board_id: {
        type: String,
        required: true,
        unique: true
    },
    group_id: {
        type: String,
        required: true,
        unique: true
    },
    posts: {
        type: [String],
        required: true
    }
}, { timestamps: true })

mongoose.pluralize(null)

const model = mongoose.model('NoticeBoard', noticeBoardSchema)

module.exports = model