import { Schema, model } from "mongoose";

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User id is required"],
    },
    interest: [{
        type: Schema.Types.ObjectId,
        ref: 'Interest',
    }],
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [1, "Description must be at least 1 character"],
        maxlength: [1024, "Description must be at most 1024 characters"],
    },
    photo: {
        type: String,
        required: [true, "Photo is required"],
        minlength: [1, "Photo must be at least 1 character"],
        maxlength: [1024, "Photo must be at most 1024 characters"],
        default: 'none',
    },
    createdAt: {
        type: Date,
        required: [true, "Creation date is required"],
    },
    deletedAt: {
        type: Date,
        required: false,
        defult: null,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

export default model( 'Post', PostSchema );