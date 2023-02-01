import { Schema, model } from "mongoose";

const InterestSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name of interest is required"],
        minlength: [2, "Name must be at least 2 character"],
        maxlength: [200, "Name must be at most 200 characters"],
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

export default model( 'Interest', InterestSchema );