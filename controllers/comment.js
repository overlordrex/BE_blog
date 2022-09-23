import { handleError } from '../utils/error.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res, next) => {
  const comment = new Comment({ userId: req.user.id, ...req.body });
  try {
    const savedComment = await comment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comment = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const post = await Post.findById(comment.videoId);

    if (comment.userId === req.user.id || req.user.id === post.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('comment deleted');
    } else {
      return next(handleError(403, 'cannot do this'));
    }
  } catch (err) {
    next(err);
  }
};
