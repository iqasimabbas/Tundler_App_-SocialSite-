const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const auth = require('../middleware/auth');

// getting posts in news feed
router.get('/', auth, async (req, res) => {

    const get_user = await User.findById(req.user.id)
const posts  = await Post.find({UserId: get_user.following}).populate('posts')
res.send(posts)
})

//adding a post 
router.post('/', auth, async (req, res) => {
    const post = new Post({
        UserId: req.user.id,
        post_image: req.body.image_url,
        caption: req.body.caption,
    })
    res.status(200).send(post)
})


// deleting a post 
router.delete('/:id', auth, async (req, res) => {
    const post = await Post.findById(req.params.id)
     if (!post) return res.status(400).send('Post not found');

     if(!post.UserId == req.user.id) return res.status(400).send('Not Authorized');
     await post.delete()

})

// updating the caption of a post
router.delete('/:id', auth, async (req, res) => {
    let post;
    if (!post) return res.status(400).send('Post not found');
    if(!post.UserId == req.user.id) return res.status(400).send('Not Authorized');
    post = await Post.findByIdAndUpdate(req.params.id, {caption: req.body.caption}); 

})


//liking a post

router.post('/:id/like',auth, async (req, res) => {
    await Post.updateOne({
        _id:req.params.id
    },
    {$push: {
        likes:req.user.id
    }}
    )
})

//unliking a post

router.post('/:id/unlike',auth, async (req, res) => {
    await Post.updateOne({
        _id:req.params.id
    },
    {$pull: {
        likes:req.user.id
    }}
    )
})

// commenting on a post
router.post('/:id/comment',auth, async (req, res) => {
    await Post.updateOne({
        _id:req.params.id
    },{$push: {
        comments:req.body.comments
    }}
)
res.status(200).send('Comment Added')
})

// deleting users all comments from a post 
router.delete('/:id/comment',auth, async (req, res) => {
   let post = await Post.findOne({_id:req.params.id})
let comments = post.comments

function minus(x) {
    x.id = req.user.id; 
}
const target = comments.filter(minus);

await post.comments.filter(target);
})

module.exports = router;