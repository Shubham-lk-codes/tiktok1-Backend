import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['creator', 'consumer'], required: true },
    profileImage: { type: String, default: '' }, // Profile image URL
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of follower IDs
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of following IDs
  },
  { timestamps: true }
);


// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
