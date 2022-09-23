import Post from '../models/Post.js';
import User from '../models/User.js';
import { handleError } from '../utils/error.js';

export const addPost = async (req, res, next) => {
  const post = new Post({ ...req.body, userId: req.user.id });
  try {
    const savePost = await post.save();

    res.status(200).json(savePost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.user.id === post.userId) {
      const newPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(newPost);
    } else {
      return next(handleError(403, 'you can only update your post'));
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.id) {
      await Post.findByIdAndDelete(req.param.id);

      res.status(200).json('Post deleted');
    } else {
      return next(handleError(403, 'you can only update your post'));
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const post = await Post.aggregate([{ $sample: { size: 40 } }]);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const trending = async (req, res, next) => {
  try {
    const post = await Post.find().sort({ views: -1 });

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribed = user.subscribedTo;

    const list = await Promise.all(
      subscribed.map((id) => {
        return Post.find({ userId: id });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const tags = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const post = await Post.find({ tags: { $in: tags } }).limit(25);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const search = req.query.q;
  try {
    const post = await Post.find({
      title: { $regex: search, $options: 'i' },
    }).limit(25);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200).json('viewed');
  } catch (err) {
    next(err);
  }
};
