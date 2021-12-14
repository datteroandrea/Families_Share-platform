const mongoose = require('mongoose')
const objectid = require('objectid')

const postReplySchema = new mongoose.Schema({
  postReply_id: {
    type: String,
    unique: true,
    default: objectid
  },
  post_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true })

postReplySchema.index({ noticeBoard_id: 1 })

mongoose.pluralize(null)
const model = mongoose.model('PostReply', postReplySchema)

module.exports = model
