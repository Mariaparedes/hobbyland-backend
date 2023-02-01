import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [1, "First name must be at less 1 character"],
        maxlength: [100, "First name must be less than 100 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [1, "Last name must be at less 1 character"],
        maxlength: [100, "Last name must be less than 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        minlength: [6, "Email must be at less 6 characters"],
        maxlength: [255, "Email must be less than 255 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at less 8 character"],
        maxlength: [200, "Password must be less than 200 characters"]
    },
    photo: {
        type: String,
        required: false,
        minlength: [1, "Photo must be at less 1 character"],
        maxlength: [1024, "Photo must be less than 1024 characters"],
        default: 'none',
    },
    address: {
        type: String,
        required: false,
        minlength: [1, "Address must be at less 1 character"],
        maxlength: [1024, "Address must be less than 1024 characters"],
    },
    phone: {
        type: String,
        required: false,
        minlength: [1, "Phone must be at less 1 character"],
        maxlength: [20, "Phone must be less than 20 characters"],
    },
    birthday: {
        type: Date,
        required: false,
    },
    biography: {
        type: String,
        required: false,
        minlength: [1, "Biography must be at less 1 character"],
        maxlength: [1024, "Biography must be less than 1024 characters"],
    },
    tokens: [{
        token: {
            type: String,
            required: false,
            minlength: [1, "Token must be at less 1 character"],
            maxlength: [1024, "Token must be less than 1024 characters"],
        },
    }],
    status: {
        type: Boolean,
        default: true,
    }
})

export default model( 'User', UserSchema );