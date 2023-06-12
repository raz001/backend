const express = require("express");
const { PostModel } = require('../model/post.model');
const {auth} = require('../middleware/auth.middleware');

const postRouter = express.Router();

postRouter.post('/add', auth, async (req, res) => {
    try {
        const post = new PostModel(req.body);
        console.log(req.body)
        await post.save();
        res.status(200).json({ msg: 'new post is added', post: req.body })
      } catch (error) {
        res.status(400).json({ error: error })
      }
});
// {
//     "title": "title1",
//    "body": "body1",
//    "device": "Mobile",
//    "no_of_comments": 1
//      }

postRouter.get('/', auth, async (req, res) => {
    try {
      const { userID } = req.body;
      const { user, minComments, maxComments, page, device } = req.query;
      const perPage = 3;
      const query = { userID };
  
      if (user) {
        query.user = user;
      }
  
      if (minComments && maxComments) {
        query.no_of_comments = { $gte: minComments, $lte: maxComments };
      } else if (minComments) {
        query.no_of_comments = { $gte: minComments };
      } else if (maxComments) {
        query.no_of_comments = { $lte: maxComments };
      }
  
      if (device) {
        const devices = device.split('&');
        query.device = { $in: devices };
      }
  
      const count = await PostModel.countDocuments(query);
      const posts = await PostModel.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      res.status(200).json({ posts, count });
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  
  
  postRouter.get('/top', auth, async (req, res) => {
    try {
      const { userID } = req.body;
      const { page } = req.query;
      const perPage = 3;
      
      const count = await PostModel.countDocuments({ userID });
      const posts = await PostModel.find({ userID })
        .sort({ no_of_comments: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      res.status(200).json({ posts, count });
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  


postRouter.patch('/update/:postID',auth,  async(req, res) => {
    const userIDinUserDoc = req.body.userID
    const { postID } = req.params;
  console.log(req.body)
    try {
      const post = await PostModel.findOne({ _id: postID })
      const userIDinPostDoc = post.userID
      if (userIDinUserDoc === userIDinPostDoc) {
        await PostModel.findByIdAndUpdate({ _id: postID }, req.body);
        res.status(200).json({ msg: `${post.title} is updated` })
      } else {
        res.status(200).json({ msg: "Not Authorized!" })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
})

postRouter.delete('/delete/:postID',auth, async (req, res) => {
    const userIDinUserDoc = req.body.userID
    const { postID } = req.params;
  
    try {
      const post = await PostModel.findOne({ _id: postID })
      const userIDinPostDoc = post.userID;

      if (userIDinUserDoc === userIDinPostDoc) {
        await PostModel.findByIdAndDelete({ _id: postID }, req.body);
        res.status(200).json({ msg: `${post.title} is deleted` })
      } else {
        res.status(200).json({ msg: "Not Authorized!" })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
})

module.exports = {postRouter}