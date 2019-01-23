const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const profileSchema = Schema({
  path:    String,
  originalName: String,
  username : String
}, {
  timestamps : true
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;