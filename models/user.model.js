const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  bio: String,
  posts: {type:[{ type: Object}], default:[]},
  friends:{type:[{ type: Object}], default:[]},
  friendRequests: {type:[{ type: Object}], default:[]}
})

const userModel = mongoose.model('users',userSchema);

module.exports = {
    userModel
}