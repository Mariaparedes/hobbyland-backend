import { Schema, model } from "mongoose";

const ReactionPostSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post id is required'],
    unique: [true, 'Post id must be unique'],
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ids is required'],
  }],
}, { timestamps: true })

export default model('ReactionPost', ReactionPostSchema)