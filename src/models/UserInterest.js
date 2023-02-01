import { Schema, model } from "mongoose";

const UserInterestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User id is required'],
  },
  book: [{
    type: Schema.Types.ObjectId,
    ref: 'Interest',
    required: [true, 'Interest ids is required'],
  }],
}, { timestamps: true })

export default model('UserInterest', UserInterestSchema)