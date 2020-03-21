const db = require('./config/database');
const mongoose = require('mongoose');

//structuring users
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  admin: Boolean
});

const opendb = () => {
  User = mongoose.model('users', userSchema)
  //connect to database
  mongoose.connect(db.mongoURI, {useNewUrlParser: true,
  useUnifiedTopology: true});
  return mongoose.connection;
}

module.exports.opendb = opendb;
