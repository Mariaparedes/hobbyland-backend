import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required"],
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post id is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [1, "Description must be at least 1 character"],
        maxlength: [1024, "Description must be less than 1024 characters"],
    },
    likes: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Date,
        required: false,
        default: null,
    },
}, { timestamps: true });

export default model("Comment", CommentSchema);
