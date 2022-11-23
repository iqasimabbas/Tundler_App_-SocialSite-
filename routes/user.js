const router = require('express').Router()
//const bcrypt = require('bcryptjs');
const User = require('../models/user')
const auth = require('../middleware/auth');

// registering a user

router.post('/register', async (req,res)=>{

    let user = await User.findOne({ email: req.body.email});
    if (user) return res.status(400).send('User already registered.');
      
user = new User ({
    name: req.body.name,
    email:req.body.email,
    password:req.body.password
})

const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']))
});

// logging a user

router.post('/login', async (req,res)=>{

    const {email, password} = req.body
        if( !email || !password){
            return res.status(400).json({ 
                msg: 'provide email and password'})}


         let user = await User.findOne({email})
         if(!user ) return res.status(400).json({
            msg: 'invalid email or password'})

            //const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch ) return res.status(400).json({ 
                msg: 'invalid email or password'})

})

//getting a user

router.get('/:id', async (req, res) => {

    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('user not found')
    res.status(200).send(user)

})



// following a user

router.post('/follow/:id', auth, async (req,res)=>{

    await User.updateOne({
        _id:req.user._id
    },
    {$push: {
        following:req.params.id
    }})


    await User.updateOne({
        _id:req.params._id
    },
    {$push: {
        followers:req.user.id
    }})
} )

// unfollowing a user

router.post('/unfollow/:id', auth, async (req,res)=>{

    await User.updateOne({
        _id:req.user._id
    },
    {$pull: {
        following:req.params.id
    }})


    await User.updateOne({
        _id:req.params._id
    },
    {$pull: {
        followers:req.user.id
    }})
} )

module.exports = router
