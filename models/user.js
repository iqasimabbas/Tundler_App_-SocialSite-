const config =  require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt.js');
const validator = require('validator');

//Defining User Model

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:12,
        trime: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique:true,
        validate: [validator.isEmail, 'Please provide a valid email']
},
password : {
    type: String,
    required: true,
    minlength: 6,
    maxlength:15,

},

following: {
    type: Array
},
followers: {
    type: Array
},

isAdmin: Boolean,
userId: mongoose.Types.ObjectId
});

// hiding password
const salt =  bcrypt.genSalt(12);
user.password = bcrypt.hash(user.password, salt);


// creating authentication token
userSchema.methods.generateAuthToken = function(){
   const token = jwt.sign({_id:user._id, isAdmin:this.Admin}, config.get('jwtPrivateKey'));
return token;
}

//login in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


const User = mongoose.model('User', userSchema)
module.exports = User