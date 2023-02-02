import Post from "../models/Post.js";
import ReactionPost from "../models/ReactionPost.js";
import * as responses from "../helpers/responses.js";
import cloudinary from "../helpers/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { user, description, interest } = req.body;

    if (!user || !description || !interest)
      return responses.responseGeneric(res, 400, "You must enter all the data");

    const file = req?.files?.image;
    if (!file) {
      return responses.responseGeneric(res, 400, "The image is missing", file);
    }
    const response = await cloudinary.uploader.upload(file.tempFilePath);

    if (response.secure_url) {
      const post = new Post({
        user,
        description,
        photo: response.secure_url,
        createdAt: Date.now(),
        interest: interest && interest,
      });

      const savePost = await post.save();
      const postPopulate = await mPost.findOne({ _id: savePost._id });
      return responses.responseOK(res, 200, "Success", postPopulate);
    } else return responses.responseServerError(res, "Could not upload image");
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: true }).exec();

    responses.responseOK(res, 200, "Success", posts);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getPostByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({
      user: id,
      status: true,
    }).exec();

    responses.responseOK(res, 200, "Success", posts);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({
      _id: id,
      status: true,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user" });

    responses.responseOK(res, 200, "Success", post);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { user } = req.body;
    const posts = await Post.find({
      user: {
        $in: user,
      },
      status: true,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "user" });

    responses.responseOK(res, 200, "Success", posts);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const { description } = req.body;
    const { id } = req.params;

    const updatePost = await Post.findOneAndUpdate(
      { _id: id, status: true },
      {
        $set: {
          description: description,
        },
      }
    );

    responses.responseOK(res, 200, "Success", updatePost);
  } catch (error) {
    responses.response(res, error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await Post.findOneAndUpdate(
      { _id: id, status: true },
      {
        $set: {
          status: false,
          deletedAt: new Date(),
        },
      }
    );

    responses.responseOK(res, 200, "Post deleted", deletePost);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getPostByInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    const posts = await PostTag.find({
      interest: {
        $in: interest,
      },
      status: true,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "post",
        populate: {
          path: "user",
        },
      });

    responses.responseOK(res, 200, "Success", posts);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const setReactionPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { users } = req.body;
    const post = await Post.findOne({ _id: id, status: true });

    if (!post) {
      return responses.responseNotFound(res, "Not found", post);
    } else if (await ReactionPost.findOne({ post: id })) {
      const updateReaction = await ReactionPost.findOneAndUpdate(
        { post: id },
        {
          $set: {
            users: users,
          },
        }
      );
      responses.responseOK(res, 200, "Success", updateReaction);
    } else {
      const reactionPost = new ReactionPost({
        post: id,
        users: users,
      });
      const saveReactionPost = await reactionPost.save();

      responses.responseOK(res, 200, "Success", saveReactionPost);
    }
  } catch (error) {
    responses.responseServerError(res, error);
  }
};

export const getReactionPost = async (req, res) => {
  try {
    const { id } = req.params;
    const reactions = await ReactionPost.find({
      post: id,
      status: true,
    }).populate("users");

    responses.responseOK(res, 200, "Success", reactions);
  } catch (error) {
    responses.responseServerError(res, error);
  }
};