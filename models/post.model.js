const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: { type: Object},
    text: String,
    image: String,
    createdAt: Date,
    likes: {type: [{ type: Object}], default: []},
    comments: {type: [{
      user: { type: Object},
      text: String,
      createdAt: Date
    }], default:[]}
})

const postModel = mongoose.model('posts',postSchema);

module.exports = {
    postModel
}