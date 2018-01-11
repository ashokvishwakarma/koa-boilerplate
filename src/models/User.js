import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  mobile: Number,
  added_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

UserSchema.plugin(mongoosePaginate);

export default mongoose.model('User', UserSchema)
