import { Schema, model } from "mongoose";

const FollowsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User id is required"],
    },
    follows: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Follow user id is required"],
    }],
    createdAt: {
        type: Date,
        required: [true, "Creation date is required"],
    },
    deletedAt: {
        type: Date,
        required: false,
        defult: null,
    },
}, { timestamps: true })

export default model( 'Follows', FollowsSchema );